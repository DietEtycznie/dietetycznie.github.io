import { inject, Injectable } from "@angular/core";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { catchError, from, map, Observable, of, tap } from "rxjs";
import { User } from "../models/user.model";
import { AuthService } from "./auth.service";
import { FirebaseService } from "./firebase.service";
import { LocalStoreService } from "./local-store.service";

@Injectable({
  providedIn: "root",
})
export class UserService {
  private firebase = inject(FirebaseService);
  private authService = inject(AuthService);
  private localStore = inject(LocalStoreService);

  readonly currentUser$ = this.authService.user$;

  getAllUsers(): Observable<User[]> {
    if (this.firebase.isFallbackMode || !this.firebase.db) {
      return of(this.localStore.getUsers());
    }

    const usersRef = collection(this.firebase.db, "users");
    return from(getDocs(usersRef)).pipe(
      map((snap) =>
        snap.docs.map((d) => ({
          ...(d.data() as User),
          uid: d.id,
        })),
      ),
      catchError(() => of(this.localStore.getUsers())),
    );
  }

  getUserById(id: string): Observable<User | null> {
    if (!this.firebase.isConfigured || !this.firebase.db) {
      const found =
        this.localStore.getUsers().find((u) => u.uid === id) ??
        this.authService.currentUserSnapshot;
      return of(found && found.uid === id ? found : null);
    }

    const userRef = doc(this.firebase.db, `users/${id}`);
    return from(getDoc(userRef)).pipe(
      map((snap) => (snap.exists() ? ({ ...(snap.data() as User), uid: snap.id }) : null)),
      catchError(() => of(this.authService.currentUserSnapshot)),
    );
  }

  createUser(userData: Omit<User, "uid"> & { uid?: string }): Observable<User> {
    const uid =
      userData.uid?.trim() ||
      "usr-" +
        (userData.email || "user")
          .toLowerCase()
          .replace(/[^a-z0-9]/g, "")
          .slice(0, 10) +
        "-" +
        Date.now().toString(36).slice(-4);

    const created: User = {
      uid,
      email: userData.email.trim(),
      displayName: userData.displayName?.trim() || userData.email.split("@")[0],
      role: userData.role ?? "user",
      medicalConditions: userData.medicalConditions ?? [],
      savedRecipes: userData.savedRecipes ?? [],
      dietPlans: userData.dietPlans ?? [],
      subscription: userData.subscription ?? { tier: "free", active: false },
    };

    if (this.firebase.isFallbackMode || !this.firebase.db) {
      this.localStore.upsertUser(created);
      return of(created);
    }

    const userRef = doc(this.firebase.db, `users/${uid}`);
    const writeOps: Promise<unknown>[] = [
      setDoc(userRef, this.firebase.cleanPayload(created)),
    ];
    if (created.role === "admin") {
      writeOps.push(
        setDoc(doc(this.firebase.db, `admins/${uid}`), {
          email: created.email,
          grantedAt: new Date().toISOString(),
        }),
      );
    }
    return from(Promise.all(writeOps)).pipe(
      map(() => created),
      catchError(() => {
        this.localStore.upsertUser(created);
        return of(created);
      }),
    );
  }

  updateUser(id: string, userData: Partial<User>): Observable<void> {
    const cur = this.authService.currentUserSnapshot;
    if (cur && cur.uid === id) {
      this.authService.updateCurrentUserSnapshot(userData);
    }

    if (this.firebase.isFallbackMode || !this.firebase.db) {
      const list = this.localStore.getUsers().map((u) =>
        u.uid === id ? { ...u, ...userData } : u,
      );
      this.localStore.saveUsers(list);
      return of(void 0);
    }

    const userRef = doc(this.firebase.db, `users/${id}`);
    const ops: Promise<unknown>[] = [
      updateDoc(userRef, this.firebase.cleanPayload(userData)),
    ];
    if (userData.role === "admin") {
      ops.push(
        setDoc(doc(this.firebase.db, `admins/${id}`), {
          email: userData.email ?? "",
          grantedAt: new Date().toISOString(),
        }),
      );
    } else if (userData.role === "user") {
      ops.push(deleteDoc(doc(this.firebase.db, `admins/${id}`)).catch(() => void 0));
    }

    return from(Promise.all(ops)).pipe(
      map(() => void 0),
      catchError(() => {
        const list = this.localStore.getUsers().map((u) =>
          u.uid === id ? { ...u, ...userData } : u,
        );
        this.localStore.saveUsers(list);
        return of(void 0);
      }),
    );
  }

  deleteUser(id: string): Observable<void> {
    if (this.firebase.isFallbackMode || !this.firebase.db) {
      this.localStore.deleteUser(id);
      return of(void 0);
    }

    const userRef = doc(this.firebase.db, `users/${id}`);
    const adminRef = doc(this.firebase.db, `admins/${id}`);
    return from(
      Promise.all([
        deleteDoc(userRef),
        deleteDoc(adminRef).catch(() => void 0),
      ]),
    ).pipe(
      map(() => void 0),
      catchError(() => {
        this.localStore.deleteUser(id);
        return of(void 0);
      }),
    );
  }

  addSavedRecipe(userId: string, recipeId: string): Observable<void> {
    const current = this.authService.currentUserSnapshot;
    const saved = Array.from(new Set([...(current?.savedRecipes ?? []), recipeId]));
    return this.updateUser(userId, { savedRecipes: saved });
  }

  removeSavedRecipe(userId: string, recipeId: string): Observable<void> {
    const current = this.authService.currentUserSnapshot;
    const saved = (current?.savedRecipes ?? []).filter((id) => id !== recipeId);
    return this.updateUser(userId, { savedRecipes: saved });
  }

  updateMedicalConditions(
    userId: string,
    conditions: string[],
  ): Observable<void> {
    return this.updateUser(userId, { medicalConditions: conditions }).pipe(
      tap(() => {
        if (this.authService.currentUserSnapshot?.uid === userId) {
          this.authService.updateCurrentUserSnapshot({
            medicalConditions: conditions,
          });
        }
      }),
    );
  }
}
