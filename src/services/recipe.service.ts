import { inject, Injectable } from "@angular/core";
import {
  Firestore,
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  limit,
  DocumentData,
} from "@angular/fire/firestore";
import { Observable, from, map, tap } from "rxjs";
import { Recipe, RecipeModel } from "../models/recipe.model";

@Injectable({
  providedIn: "root",
})
export class RecipeService {
  private firestore = inject(Firestore);

  getRecipes(): Observable<Recipe[]> {
    const recipesRef = collection(this.firestore, "recipes");
    return from(getDocs(recipesRef)).pipe(
      map((snapshot) =>
        snapshot.docs.map((doc) => RecipeModel.toRecipe(doc.data(), doc.id)),
      ),
      tap((recipes) => console.log(recipes.map((r) => r.name))),
    );
  }

  getRecipesByCondition(condition: string): Observable<Recipe[]> {
    const recipesRef = collection(this.firestore, "recipes");
    const q = query(
      recipesRef,
      where("suitableForConditions", "array-contains", condition),
    );

    return from(getDocs(q)).pipe(
      map((snapshot) =>
        snapshot.docs.map((doc) => RecipeModel.toRecipe(doc.data(), doc.id)),
      ),
    );
  }

  getRecipeById(id: string): Observable<Recipe> {
    const recipeRef = doc(this.firestore, `recipes/${id}`);
    return from(getDoc(recipeRef)).pipe(
      map((doc) => RecipeModel.toRecipe(doc.data(), doc.id)),
    );
  }

  addRecipe(
    recipe: Omit<Recipe, "uid" | "createdAt" | "updatedAt">,
  ): Observable<string> {
    const recipesRef = collection(this.firestore, "recipes");
    const newRecipe = {
      ...recipe,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return from(addDoc(recipesRef, newRecipe)).pipe(map((docRef) => docRef.id));
  }

  updateRecipe(id: string, recipe: Partial<Recipe>): Observable<void> {
    const recipeRef = doc(this.firestore, `recipes/${id}`);
    const updatedRecipe = {
      ...recipe,
      updatedAt: new Date(),
    };

    return from(updateDoc(recipeRef, updatedRecipe));
  }

  deleteRecipe(id: string): Observable<void> {
    const recipeRef = doc(this.firestore, `recipes/${id}`);
    return from(deleteDoc(recipeRef));
  }

  getRecentRecipes(count: number = 5): Observable<Recipe[]> {
    const recipesRef = collection(this.firestore, "recipes");
    const q = query(recipesRef, orderBy("createdAt", "desc"), limit(count));

    return from(getDocs(q)).pipe(
      map((snapshot) =>
        snapshot.docs.map((doc) => RecipeModel.toRecipe(doc.data(), doc.id)),
      ),
    );
  }
}
