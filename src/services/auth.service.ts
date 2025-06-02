import { Injectable } from "@angular/core";
import {
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  User as FirebaseUser,
  UserCredential,
  GoogleAuthProvider,
  signInWithPopup,
} from "@angular/fire/auth";
import { distinctUntilChanged, Observable, of } from "rxjs";
import { map, switchMap } from "rxjs/operators";
import { Firestore, doc, setDoc, getDoc } from "@angular/fire/firestore";
import { User } from "../models/user.model";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  user$: Observable<User | null>;

  constructor(
    private auth: Auth,
    private firestore: Firestore,
  ) {
    this.user$ = new Observable<FirebaseUser | null>((observer) => {
      return this.auth.onAuthStateChanged(observer);
    }).pipe(
      switchMap((user) => {
        if (user) {
          return this.getUserData(user.uid);
        } else {
          return of(null);
        }
      }),
    );
  }

  async signIn(email: string, password: string): Promise<UserCredential> {
    return await signInWithEmailAndPassword(this.auth, email, password);
  }

  async signInWithGoogle(): Promise<UserCredential> {
    const provider = new GoogleAuthProvider();
    const credential = await signInWithPopup(this.auth, provider);

    const userRef = doc(this.firestore, `users/${credential.user.uid}`);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      // Jeśli użytkownik nie istnieje, utwórz jego dane w Firestore
      const user: User = {
        uid: credential.user.uid,
        email: credential.user.email || "",
        displayName: credential.user.displayName || "Anonimowy Użytkownik",
        medicalConditions: [],
        savedRecipes: [],
        dietPlans: [],
      };

      await this.createUserData(user);
    }

    return credential;
  }

  async signUp(
    email: string,
    password: string,
    displayName: string,
  ): Promise<UserCredential> {
    const credential = await createUserWithEmailAndPassword(
      this.auth,
      email,
      password,
    );

    const user: User = {
      uid: credential.user.uid,
      email: credential.user.email || email,
      displayName: displayName,
      medicalConditions: [],
      savedRecipes: [],
      dietPlans: [],
    };

    await this.createUserData(user);

    return credential;
  }

  async signOut(): Promise<void> {
    return await signOut(this.auth);
  }

  private async createUserData(user: User): Promise<void> {
    const userRef = doc(this.firestore, `users/${user.uid}`);
    return await setDoc(userRef, user);
  }

  private getUserData(uid: string): Observable<User | null> {
    const userRef = doc(this.firestore, `users/${uid}`);
    return new Observable<User | null>((observer) => {
      getDoc(userRef)
        .then((doc) => {
          if (doc.exists()) {
            observer.next(doc.data() as User);
          } else {
            observer.next(null);
          }
          observer.complete();
        })
        .catch((error) => {
          observer.error(error);
        });
    }).pipe(
      distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
    );
  }

  getCurrentUser(): FirebaseUser | null {
    return this.auth.currentUser;
  }

  get isLoggedIn(): boolean {
    return !!this.auth.currentUser;
  }
}
