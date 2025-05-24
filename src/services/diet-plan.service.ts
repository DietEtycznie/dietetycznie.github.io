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
  DocumentData 
} from '@angular/fire/firestore';
import { Observable, from, map } from 'rxjs';
import { DietPlan } from '../models/diet-plan.model';

@Injectable({
  providedIn: 'root'
})
export class DietPlanService {

  constructor(private firestore: Firestore) { }

  getDietPlans(): Observable<DietPlan[]> {
    const plansRef = collection(this.firestore, 'dietPlans');
    return from(getDocs(plansRef)).pipe(
      map(snapshot => 
        snapshot.docs.map(doc => {
          return {
            ...doc.data() as DocumentData,
            id: doc.id
          } as DietPlan;
        })
      )
    );
  }

  getDietPlansByCondition(condition: string): Observable<DietPlan[]> {
    const plansRef = collection(this.firestore, 'dietPlans');
    const q = query(plansRef, where('suitableForConditions', 'array-contains', condition));
    
    return from(getDocs(q)).pipe(
      map(snapshot => 
        snapshot.docs.map(doc => {
          return {
            ...doc.data() as DocumentData,
            id: doc.id
          } as DietPlan;
        })
      )
    );
  }

  getDietPlanById(id: string): Observable<DietPlan> {
    const planRef = doc(this.firestore, `dietPlans/${id}`);
    return from(getDoc(planRef)).pipe(
      map(doc => {
        return {
          ...doc.data() as DocumentData,
          id: doc.id
        } as DietPlan;
      })
    );
  }

  addDietPlan(plan: Omit<DietPlan, 'id'>): Observable<string> {
    const plansRef = collection(this.firestore, 'dietPlans');
    return from(addDoc(plansRef, plan)).pipe(
      map(docRef => docRef.id)
    );
  }

  updateDietPlan(id: string, plan: Partial<DietPlan>): Observable<void> {
    const planRef = doc(this.firestore, `dietPlans/${id}`);
    return from(updateDoc(planRef, plan));
  }

  deleteDietPlan(id: string): Observable<void> {
    const planRef = doc(this.firestore, `dietPlans/${id}`);
    return from(deleteDoc(planRef));
  }
}