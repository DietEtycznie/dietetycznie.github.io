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
  DocumentData,
} from "@angular/fire/firestore";
import { Observable, from, map } from "rxjs";
import { MedicalCondition } from "../models/medical-condition.model";

@Injectable({
  providedIn: "root",
})
export class MedicalConditionService {
  private firestore = inject(Firestore);

  getMedicalConditions(): Observable<MedicalCondition[]> {
    const conditionsRef = collection(this.firestore, "medicalConditions");
    return from(getDocs(conditionsRef)).pipe(
      map((snapshot) =>
        snapshot.docs.map((doc) => {
          return {
            ...(doc.data() as DocumentData),
            id: doc.id,
          } as MedicalCondition;
        }),
      ),
    );
  }

  getMedicalConditionById(id: string): Observable<MedicalCondition> {
    const conditionRef = doc(this.firestore, `medicalConditions/${id}`);
    return from(getDoc(conditionRef)).pipe(
      map((doc) => {
        return {
          ...(doc.data() as DocumentData),
          id: doc.id,
        } as MedicalCondition;
      }),
    );
  }

  addMedicalCondition(
    condition: Omit<MedicalCondition, "id">,
  ): Observable<string> {
    const conditionsRef = collection(this.firestore, "medicalConditions");
    return from(addDoc(conditionsRef, condition)).pipe(
      map((docRef) => docRef.id),
    );
  }

  updateMedicalCondition(
    id: string,
    condition: Partial<MedicalCondition>,
  ): Observable<void> {
    const conditionRef = doc(this.firestore, `medicalConditions/${id}`);
    return from(updateDoc(conditionRef, condition));
  }

  deleteMedicalCondition(id: string): Observable<void> {
    const conditionRef = doc(this.firestore, `medicalConditions/${id}`);
    return from(deleteDoc(conditionRef));
  }
}
