import { inject, Injectable } from "@angular/core";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { catchError, map, Observable, of } from "rxjs";
import { SEED_RECIPES } from "../data/seed-recipes";
import { Recipe, RecipeModel, resolveRecipeImageUrl } from "../models/recipe.model";
import { FirebaseService } from "./firebase.service";
import { LocalStoreService } from "./local-store.service";

@Injectable({
  providedIn: "root",
})
export class RecipeService {
  private firebase = inject(FirebaseService);
  private localStore = inject(LocalStoreService);

  getRecipes(): Observable<Recipe[]> {
    if (this.firebase.isFallbackMode || !this.firebase.db) {
      return of(this.localStore.getRecipes());
    }

    const recipesRef = collection(this.firebase.db, "recipes");
    return this.firebase.fromFirebase(getDocs(recipesRef)).pipe(
      map((snapshot) => {
        const list = snapshot.docs.map((d) => RecipeModel.toRecipe(d.data(), d.id));
        if (list.length === 0) {
          return this.localStore.getRecipes();
        }
        return list;
      }),
      catchError((err) => {
        console.warn("Firestore recipes fetch failed, using seed fallback.", err);
        this.firebase.activateFallback("Brak dostępu do Firestore — aktywowano lokalną bazę seed.");
        return of(this.localStore.getRecipes());
      }),
    );
  }

  getRecipesByCondition(condition: string): Observable<Recipe[]> {
    if (this.firebase.isFallbackMode || !this.firebase.db) {
      return of(
        this.localStore
          .getRecipes()
          .filter((r) => r.suitableForConditions.includes(condition)),
      );
    }

    const recipesRef = collection(this.firebase.db, "recipes");
    const q = query(
      recipesRef,
      where("suitableForConditions", "array-contains", condition),
    );
    return this.firebase.fromFirebase(getDocs(q)).pipe(
      map((snapshot) =>
        snapshot.docs.map((d) => RecipeModel.toRecipe(d.data(), d.id)),
      ),
      catchError(() =>
        of(
          this.localStore
            .getRecipes()
            .filter((r) => r.suitableForConditions.includes(condition)),
        ),
      ),
    );
  }

  getRecipeById(id: string): Observable<Recipe | null> {
    if (this.firebase.isFallbackMode || !this.firebase.db) {
      const found = this.localStore.getRecipes().find((r) => r.uid === id) ?? null;
      return of(found);
    }

    const recipeRef = doc(this.firebase.db, `recipes/${id}`);
    return this.firebase.fromFirebase(getDoc(recipeRef)).pipe(
      map((snap) =>
        snap.exists() ? RecipeModel.toRecipe(snap.data(), snap.id) : null,
      ),
      catchError(() => {
        const found =
          this.localStore.getRecipes().find((r) => r.uid === id) ?? null;
        return of(found);
      }),
    );
  }

  addRecipe(
    recipe: Omit<Recipe, "uid" | "createdAt" | "updatedAt">,
  ): Observable<string> {
    const now = new Date();
    const normalized = {
      ...recipe,
      imageUrl: recipe.imageUrl || "fallback-plate.png",
      createdAt: now,
      updatedAt: now,
    };

    if (this.firebase.isFallbackMode || !this.firebase.db) {
      const id = "rec-" + Date.now();
      const all = this.localStore.getRecipes();
      all.unshift({
        ...normalized,
        uid: id,
        imageUrl: resolveRecipeImageUrl(normalized.imageUrl),
      });
      this.localStore.saveRecipes(all);
      return of(id);
    }

    const recipesRef = collection(this.firebase.db, "recipes");
    return this.firebase
      .fromFirebase(addDoc(recipesRef, this.firebase.cleanPayload(normalized)))
      .pipe(map((docRef) => docRef.id));
  }

  updateRecipe(id: string, recipe: Partial<Recipe>): Observable<void> {
    if (this.firebase.isFallbackMode || !this.firebase.db) {
      const all = this.localStore.getRecipes().map((r) =>
        r.uid === id
          ? {
              ...r,
              ...recipe,
              imageUrl: resolveRecipeImageUrl(recipe.imageUrl ?? r.imageUrl),
              updatedAt: new Date(),
            }
          : r,
      );
      this.localStore.saveRecipes(all);
      return of(void 0);
    }

    const { uid: _ignoredUid, ...rest } = recipe;
    const recipeRef = doc(this.firebase.db, `recipes/${id}`);
    return this.firebase.fromFirebase(
      updateDoc(
        recipeRef,
        this.firebase.cleanPayload({
          ...rest,
          updatedAt: new Date(),
        }),
      ),
    );
  }

  deleteRecipe(id: string): Observable<void> {
    if (this.firebase.isFallbackMode || !this.firebase.db) {
      const filtered = this.localStore.getRecipes().filter((r) => r.uid !== id);
      this.localStore.saveRecipes(filtered);
      return of(void 0);
    }

    const recipeRef = doc(this.firebase.db, `recipes/${id}`);
    return this.firebase.fromFirebase(deleteDoc(recipeRef));
  }

  getRecentRecipes(count = 6): Observable<Recipe[]> {
    if (this.firebase.isFallbackMode || !this.firebase.db) {
      return of(this.localStore.getRecipes().slice(0, count));
    }

    const recipesRef = collection(this.firebase.db, "recipes");
    const q = query(recipesRef, orderBy("createdAt", "desc"), limit(count));
    return this.firebase.fromFirebase(getDocs(q)).pipe(
      map((snapshot) => {
        const list = snapshot.docs.map((d) => RecipeModel.toRecipe(d.data(), d.id));
        return list.length ? list : this.localStore.getRecipes().slice(0, count);
      }),
      catchError(() => of(this.localStore.getRecipes().slice(0, count))),
    );
  }

  async seedToFirestore(): Promise<number> {
    if (!this.firebase.db) {
      this.localStore.resetAllToSeed();
      return SEED_RECIPES.length;
    }
    let count = 0;
    for (const r of SEED_RECIPES) {
      const { uid, ...payload } = r;
      await setDoc(doc(this.firebase.db, `recipes/${uid}`), payload, {
        merge: true,
      });
      count++;
    }
    return count;
  }
}
