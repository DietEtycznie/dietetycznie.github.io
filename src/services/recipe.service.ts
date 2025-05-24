import { Injectable } from '@angular/core';
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
  DocumentData 
} from '@angular/fire/firestore';
import { Observable, from, map } from 'rxjs';
import { Recipe } from '../models/recipe.model';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {

  constructor(private firestore: Firestore) { }

  getRecipes(): Observable<Recipe[]> {
    const recipesRef = collection(this.firestore, 'recipes');
    return from(getDocs(recipesRef)).pipe(
      map(snapshot => 
        snapshot.docs.map(doc => {
          const data = doc.data() as DocumentData;
          return {
            ...data,
            id: doc.id,
            createdAt: data['createdAt']?.toDate(),
            updatedAt: data['updatedAt']?.toDate()
          } as Recipe;
        })
      )
    );
  }

  getRecipesByCondition(condition: string): Observable<Recipe[]> {
    const recipesRef = collection(this.firestore, 'recipes');
    const q = query(recipesRef, where('suitableForConditions', 'array-contains', condition));
    
    return from(getDocs(q)).pipe(
      map(snapshot => 
        snapshot.docs.map(doc => {
          const data = doc.data() as DocumentData;
          return {
            ...data,
            id: doc.id,
            createdAt: data['createdAt']?.toDate(),
            updatedAt: data['updatedAt']?.toDate()
          } as Recipe;
        })
      )
    );
  }

  getRecipeById(id: string): Observable<Recipe> {
    const recipeRef = doc(this.firestore, `recipes/${id}`);
    return from(getDoc(recipeRef)).pipe(
      map(doc => {
        const data = doc.data() as DocumentData;
        return {
          ...data,
          id: doc.id,
          createdAt: data['createdAt']?.toDate(),
          updatedAt: data['updatedAt']?.toDate()
        } as Recipe;
      })
    );
  }

  addRecipe(recipe: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>): Observable<string> {
    const recipesRef = collection(this.firestore, 'recipes');
    const newRecipe = {
      ...recipe,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    return from(addDoc(recipesRef, newRecipe)).pipe(
      map(docRef => docRef.id)
    );
  }

  updateRecipe(id: string, recipe: Partial<Recipe>): Observable<void> {
    const recipeRef = doc(this.firestore, `recipes/${id}`);
    const updatedRecipe = {
      ...recipe,
      updatedAt: new Date()
    };
    
    return from(updateDoc(recipeRef, updatedRecipe));
  }

  deleteRecipe(id: string): Observable<void> {
    const recipeRef = doc(this.firestore, `recipes/${id}`);
    return from(deleteDoc(recipeRef));
  }

  getRecentRecipes(count: number = 5): Observable<Recipe[]> {
    const recipesRef = collection(this.firestore, 'recipes');
    const q = query(recipesRef, orderBy('createdAt', 'desc'), limit(count));
    
    return from(getDocs(q)).pipe(
      map(snapshot => 
        snapshot.docs.map(doc => {
          const data = doc.data() as DocumentData;
          return {
            ...data,
            id: doc.id,
            createdAt: data['createdAt']?.toDate(),
            updatedAt: data['updatedAt']?.toDate()
          } as Recipe;
        })
      )
    );
  }
}