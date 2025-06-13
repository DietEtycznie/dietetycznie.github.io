import { inject, Injectable } from "@angular/core";
import {
  Firestore,
  doc,
  updateDoc,
  getDoc,
  DocumentData,
} from "@angular/fire/firestore";
import { Observable, from, map, switchMap, shareReplay } from "rxjs";
import { User } from "../models/user.model";
import { AuthService } from "./auth.service";
import { take } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class UserService {
  private firestore = inject(Firestore);
  private authService = inject(AuthService);

  currentUser$ = this.authService.user$.pipe(take(1), shareReplay(1));

  getUserById(id: string): Observable<User | null> {
    const userRef = doc(this.firestore, `users/${id}`);
    return from(getDoc(userRef)).pipe(
      map((docSnap) => {
        if (!docSnap.exists()) {
          return null;
        }
        const data = docSnap.data() as DocumentData;
        return {
          uid: data["uid"] ?? "",
          email: data["email"] ?? "",
          displayName: data["displayName"],
          photoURL: data["photoURL"],
          medicalConditions: data["medicalConditions"],
          savedRecipes: data["savedRecipes"],
          dietPlans: data["dietPlans"],
        } as User;
      }),
    );
  }

  updateUser(id: string, userData: Partial<User>): Observable<void> {
    const userRef = doc(this.firestore, `users/${id}`);
    return from(updateDoc(userRef, userData));
  }

  addSavedRecipe(userId: string, recipeId: string): Observable<void> {
    const userRef = doc(this.firestore, `users/${userId}`);
    return from(getDoc(userRef)).pipe(
      switchMap((doc) => {
        const userData = doc.data() as User;
        const savedRecipes = userData.savedRecipes || [];
        if (!savedRecipes.includes(recipeId)) {
          savedRecipes.push(recipeId);
          return from(updateDoc(userRef, { savedRecipes }));
        }
        return from(Promise.resolve());
      }),
    );
  }

  removeSavedRecipe(userId: string, recipeId: string): Observable<void> {
    const userRef = doc(this.firestore, `users/${userId}`);
    return from(getDoc(userRef)).pipe(
      switchMap((doc) => {
        const userData = doc.data() as User;
        const savedRecipes = userData.savedRecipes || [];
        const updatedRecipes = savedRecipes.filter((id) => id !== recipeId);
        return from(updateDoc(userRef, { savedRecipes: updatedRecipes }));
      }),
    );
  }

  updateMedicalConditions(
    userId: string,
    conditions: string[],
  ): Observable<void> {
    const userRef = doc(this.firestore, `users/${userId}`);
    return from(updateDoc(userRef, { medicalConditions: conditions }));
  }
}
