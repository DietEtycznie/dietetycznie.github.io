import { inject, Injectable } from "@angular/core";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { catchError, map, Observable, of } from "rxjs";
import { SEED_MEDICAL_CONDITIONS } from "../data/seed-conditions";
import { MedicalCondition } from "../models/medical-condition.model";
import { FirebaseService } from "./firebase.service";
import { LocalStoreService } from "./local-store.service";

@Injectable({
  providedIn: "root",
})
export class MedicalConditionService {
  private firebase = inject(FirebaseService);
  private localStore = inject(LocalStoreService);

  getMedicalConditions(): Observable<MedicalCondition[]> {
    if (this.firebase.isFallbackMode || !this.firebase.db) {
      return of(this.localStore.getConditions());
    }

    const conditionsRef = collection(this.firebase.db, "medicalConditions");
    return this.firebase.fromFirebase(getDocs(conditionsRef)).pipe(
      map((snapshot) => {
        const list = snapshot.docs.map(
          (d) => ({ ...d.data(), id: d.id }) as MedicalCondition,
        );
        return list.length ? list : this.localStore.getConditions();
      }),
      catchError((err) => {
        console.warn("Firestore conditions fetch failed, using seed fallback.", err);
        this.firebase.activateFallback("Brak dostępu do Firestore — aktywowano lokalną bazę seed.");
        return of(this.localStore.getConditions());
      }),
    );
  }

  getMedicalConditionById(id: string): Observable<MedicalCondition | null> {
    if (this.firebase.isFallbackMode || !this.firebase.db) {
      const found =
        this.localStore.getConditions().find((c) => c.id === id) ?? null;
      return of(found);
    }

    const conditionRef = doc(this.firebase.db, `medicalConditions/${id}`);
    return this.firebase.fromFirebase(getDoc(conditionRef)).pipe(
      map((snap) =>
        snap.exists() ? ({ ...snap.data(), id: snap.id } as MedicalCondition) : null,
      ),
      catchError(() =>
        of(this.localStore.getConditions().find((c) => c.id === id) ?? null),
      ),
    );
  }

  addMedicalCondition(
    condition: Omit<MedicalCondition, "id">,
  ): Observable<string> {
    if (this.firebase.isFallbackMode || !this.firebase.db) {
      const id = "cond-" + Date.now();
      const all = this.localStore.getConditions();
      all.push({ ...condition, id });
      this.localStore.saveConditions(all);
      return of(id);
    }

    const conditionsRef = collection(this.firebase.db, "medicalConditions");
    return this.firebase
      .fromFirebase(addDoc(conditionsRef, this.firebase.cleanPayload(condition)))
      .pipe(map((docRef) => docRef.id));
  }

  updateMedicalCondition(
    id: string,
    condition: Partial<MedicalCondition>,
  ): Observable<void> {
    if (this.firebase.isFallbackMode || !this.firebase.db) {
      const all = this.localStore
        .getConditions()
        .map((c) => (c.id === id ? { ...c, ...condition } : c));
      this.localStore.saveConditions(all);
      return of(void 0);
    }

    const { id: _ignoredId, ...rest } = condition;
    const conditionRef = doc(this.firebase.db, `medicalConditions/${id}`);
    return this.firebase.fromFirebase(
      updateDoc(conditionRef, this.firebase.cleanPayload(rest)),
    );
  }

  deleteMedicalCondition(id: string): Observable<void> {
    if (this.firebase.isFallbackMode || !this.firebase.db) {
      const all = this.localStore.getConditions().filter((c) => c.id !== id);
      this.localStore.saveConditions(all);
      return of(void 0);
    }

    const conditionRef = doc(this.firebase.db, `medicalConditions/${id}`);
    return this.firebase.fromFirebase(deleteDoc(conditionRef));
  }

  async seedToFirestore(): Promise<number> {
    if (!this.firebase.db) {
      this.localStore.saveConditions(SEED_MEDICAL_CONDITIONS.map((c) => ({ ...c })));
      return SEED_MEDICAL_CONDITIONS.length;
    }
    let count = 0;
    for (const c of SEED_MEDICAL_CONDITIONS) {
      const { id, ...payload } = c;
      await setDoc(doc(this.firebase.db, `medicalConditions/${id}`), payload, {
        merge: true,
      });
      count++;
    }
    return count;
  }
}
