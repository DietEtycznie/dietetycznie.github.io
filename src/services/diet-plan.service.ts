import { inject, Injectable } from "@angular/core";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { catchError, map, Observable, of } from "rxjs";
import { SEED_DIET_PLANS } from "../data/seed-diet-plans";
import { DietPlan, normalizeMealPlan } from "../models/diet-plan.model";
import { FirebaseService } from "./firebase.service";
import { LocalStoreService } from "./local-store.service";

@Injectable({
  providedIn: "root",
})
export class DietPlanService {
  private firebase = inject(FirebaseService);
  private localStore = inject(LocalStoreService);

  private normalizePlan(plan: DietPlan): DietPlan {
    return {
      ...plan,
      suitableForConditions: plan.suitableForConditions ?? [],
      mealPlan: normalizeMealPlan(plan.mealPlan),
    };
  }

  getPublicDietPlans(): Observable<DietPlan[]> {
    if (this.firebase.isFallbackMode || !this.firebase.db) {
      return of(
        this.localStore
          .getDietPlans()
          .filter((p) => p.userId === null)
          .map((p) => this.normalizePlan(p)),
      );
    }

    const plansRef = collection(this.firebase.db, "dietPlans");
    const q = query(plansRef, where("userId", "==", null));
    return this.firebase.fromFirebase(getDocs(q)).pipe(
      map((snapshot) => {
        const list = snapshot.docs.map((d) =>
          this.normalizePlan({ ...(d.data() as DietPlan), id: d.id }),
        );
        return list.length
          ? list
          : this.localStore
              .getDietPlans()
              .filter((p) => p.userId === null)
              .map((p) => this.normalizePlan(p));
      }),
      catchError(() =>
        of(
          this.localStore
            .getDietPlans()
            .filter((p) => p.userId === null)
            .map((p) => this.normalizePlan(p)),
        ),
      ),
    );
  }

  getUserDietPlans(userId: string): Observable<DietPlan[]> {
    if (this.firebase.isFallbackMode || !this.firebase.db) {
      return of(
        this.localStore
          .getDietPlans()
          .filter((p) => p.userId === userId)
          .map((p) => this.normalizePlan(p)),
      );
    }

    const plansRef = collection(this.firebase.db, "dietPlans");
    const q = query(plansRef, where("userId", "==", userId));
    return this.firebase.fromFirebase(getDocs(q)).pipe(
      map((snapshot) =>
        snapshot.docs.map((d) => this.normalizePlan({ ...(d.data() as DietPlan), id: d.id })),
      ),
      catchError(() =>
        of(
          this.localStore
            .getDietPlans()
            .filter((p) => p.userId === userId)
            .map((p) => this.normalizePlan(p)),
        ),
      ),
    );
  }

  getDietPlans(): Observable<DietPlan[]> {
    if (this.firebase.isFallbackMode || !this.firebase.db) {
      return of(this.localStore.getDietPlans().map((p) => this.normalizePlan(p)));
    }

    const plansRef = collection(this.firebase.db, "dietPlans");
    return this.firebase.fromFirebase(getDocs(plansRef)).pipe(
      map((snapshot) =>
        snapshot.docs.map((d) => this.normalizePlan({ ...(d.data() as DietPlan), id: d.id })),
      ),
      catchError(() => of(this.localStore.getDietPlans().map((p) => this.normalizePlan(p)))),
    );
  }

  getDietPlanById(id: string): Observable<DietPlan | null> {
    if (this.firebase.isFallbackMode || !this.firebase.db) {
      const found = this.localStore.getDietPlans().find((p) => p.id === id);
      return of(found ? this.normalizePlan(found) : null);
    }

    const planRef = doc(this.firebase.db, `dietPlans/${id}`);
    return this.firebase.fromFirebase(getDoc(planRef)).pipe(
      map((snap) =>
        snap.exists() ? this.normalizePlan({ ...(snap.data() as DietPlan), id: snap.id }) : null,
      ),
      catchError(() => {
        const found = this.localStore.getDietPlans().find((p) => p.id === id);
        return of(found ? this.normalizePlan(found) : null);
      }),
    );
  }

  addDietPlan(plan: Omit<DietPlan, "id">): Observable<string> {
    const normalized: Omit<DietPlan, "id"> = {
      ...plan,
      mealPlan: normalizeMealPlan(plan.mealPlan),
    };

    if (this.firebase.isFallbackMode || !this.firebase.db) {
      const id = "plan-" + Date.now();
      const all = this.localStore.getDietPlans();
      all.push({ ...normalized, id });
      this.localStore.saveDietPlans(all);
      return of(id);
    }

    const plansRef = collection(this.firebase.db, "dietPlans");
    return this.firebase
      .fromFirebase(addDoc(plansRef, this.firebase.cleanPayload(normalized)))
      .pipe(map((docRef) => docRef.id));
  }

  updateDietPlan(id: string, plan: Partial<DietPlan>): Observable<void> {
    const { id: _ignoredId, ...rest } = plan;
    const payload = {
      ...rest,
      ...(plan.mealPlan ? { mealPlan: normalizeMealPlan(plan.mealPlan) } : {}),
    };

    if (this.firebase.isFallbackMode || !this.firebase.db) {
      const all = this.localStore
        .getDietPlans()
        .map((p) => (p.id === id ? this.normalizePlan({ ...p, ...payload }) : p));
      this.localStore.saveDietPlans(all);
      return of(void 0);
    }

    const planRef = doc(this.firebase.db, `dietPlans/${id}`);
    return this.firebase.fromFirebase(updateDoc(planRef, this.firebase.cleanPayload(payload)));
  }

  deleteDietPlan(id: string): Observable<void> {
    if (this.firebase.isFallbackMode || !this.firebase.db) {
      const all = this.localStore.getDietPlans().filter((p) => p.id !== id);
      this.localStore.saveDietPlans(all);
      return of(void 0);
    }

    const planRef = doc(this.firebase.db, `dietPlans/${id}`);
    return this.firebase.fromFirebase(deleteDoc(planRef));
  }

  async seedToFirestore(): Promise<number> {
    if (!this.firebase.db) {
      this.localStore.saveDietPlans(SEED_DIET_PLANS.map((p) => this.normalizePlan(p)));
      return SEED_DIET_PLANS.length;
    }
    let count = 0;
    for (const p of SEED_DIET_PLANS) {
      const { id, ...payload } = p;
      await setDoc(doc(this.firebase.db, `dietPlans/${id}`), payload, {
        merge: true,
      });
      count++;
    }
    return count;
  }
}
