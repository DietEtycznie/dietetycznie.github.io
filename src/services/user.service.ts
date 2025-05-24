import { Injectable } from '@angular/core';
import { 
  Firestore, 
  doc,
  updateDoc,
  getDoc,
  DocumentData 
} from '@angular/fire/firestore';
import { Observable, from, map } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private firestore: Firestore) { }

  getUserById(id: string): Observable<User> {
    const userRef = doc(this.firestore, `users/${id}`);
    return from(getDoc(userRef)).pipe(
      map(doc => {
        return {
          ...doc.data() as DocumentData,
          id: doc.id
        } as User;
      })
    );
  }

  updateUser(id: string, userData: Partial<User>): Observable<void> {
    const userRef = doc(this.firestore, `users/${id}`);
    return from(updateDoc(userRef, userData));
  }

  addSavedRecipe(userId: string, recipeId: string): Observable<void> {
    const userRef = doc(this.firestore, `users/${userId}`);
    return from(getDoc(userRef)).pipe(
      map(doc => {
        const userData = doc.data() as User;
        const savedRecipes = userData.savedRecipes || [];
        if (!savedRecipes.includes(recipeId)) {
          savedRecipes.push(recipeId);
          return updateDoc(userRef, { savedRecipes });
        }
        return Promise.resolve();
      })
    );
  }

  removeSavedRecipe(userId: string, recipeId: string): Observable<void> {
    const userRef = doc(this.firestore, `users/${userId}`);
    return from(getDoc(userRef)).pipe(
      map(doc => {
        const userData = doc.data() as User;
        const savedRecipes = userData.savedRecipes || [];
        const updatedRecipes = savedRecipes.filter(id => id !== recipeId);
        return updateDoc(userRef, { savedRecipes: updatedRecipes });
      })
    );
  }

  updateMedicalConditions(userId: string, conditions: string[]): Observable<void> {
    const userRef = doc(this.firestore, `users/${userId}`);
    return from(updateDoc(userRef, { medicalConditions: conditions }));
  }
}