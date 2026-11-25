import { inject, Injectable } from "@angular/core";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  User as FirebaseUser,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { BehaviorSubject, map, Observable } from "rxjs";
import { User } from "../models/user.model";
import { FirebaseService } from "./firebase.service";
import { LocalStoreService } from "./local-store.service";

const BOOTSTRAP_ADMIN_UID = "QXmfYBytYyPzHQKr3IhMILGlQrv2";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private firebase = inject(FirebaseService);
  private localStore = inject(LocalStoreService);

  private userSubject = new BehaviorSubject<User | null>(null);
  readonly user$: Observable<User | null> = this.userSubject.asObservable();

  private authReadySubject = new BehaviorSubject<boolean>(false);
  readonly authReady$: Observable<boolean> = this.authReadySubject.asObservable();

  readonly isAdmin$: Observable<boolean> = this.user$.pipe(
    map((u) => Boolean(u && (u.role === "admin" || u.uid === BOOTSTRAP_ADMIN_UID))),
  );

  readonly isPro$: Observable<boolean> = this.user$.pipe(
    map((u) => Boolean(u?.subscription?.active && u.subscription.tier !== "free")),
  );

  constructor() {
    if (this.firebase.isConfigured && this.firebase.auth) {
      onAuthStateChanged(this.firebase.auth, async (fbUser) => {
        if (!fbUser) {
          this.userSubject.next(null);
          this.authReadySubject.next(true);
          return;
        }
        try {
          const profile = await this.loadOrCreateUserProfile(fbUser);
          this.userSubject.next(profile);
        } catch (err) {
          console.warn("Failed loading Firestore user profile, falling back.", err);
          this.userSubject.next({
            uid: fbUser.uid,
            email: fbUser.email || "",
            displayName: fbUser.displayName || "Użytkownik",
            photoURL: fbUser.photoURL || undefined,
            role: fbUser.uid === BOOTSTRAP_ADMIN_UID ? "admin" : "user",
            savedRecipes: [],
            medicalConditions: [],
            dietPlans: [],
          });
        } finally {
          this.authReadySubject.next(true);
        }
      });
    } else {
      const savedDemo = this.localStore.getDemoUser();
      this.userSubject.next(savedDemo);
      this.authReadySubject.next(true);
    }
  }

  get currentUserSnapshot(): User | null {
    return this.userSubject.value;
  }

  get isLoggedIn(): boolean {
    return Boolean(this.userSubject.value);
  }

  async signIn(email: string, password: string): Promise<User> {
    if (this.firebase.isConfigured && this.firebase.auth) {
      const cred = await signInWithEmailAndPassword(
        this.firebase.auth,
        email,
        password,
      );
      const profile = await this.loadOrCreateUserProfile(cred.user);
      this.userSubject.next(profile);
      return profile;
    }

    const existing = this.localStore
      .getUsers()
      .find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
    const demoUser: User = existing ?? {
      uid: "demo-" + email.replace(/[^a-z0-9]/gi, "").slice(0, 12),
      email,
      displayName: email.split("@")[0] || "Użytkownik Demo",
      role: email.toLowerCase().includes("admin") ? "admin" : "user",
      medicalConditions: [],
      savedRecipes: [],
      dietPlans: [],
      subscription: { tier: "free", active: false },
    };
    this.localStore.upsertUser(demoUser);
    this.localStore.saveDemoUser(demoUser);
    this.userSubject.next(demoUser);
    return demoUser;
  }

  async signInDemo(asAdmin = false): Promise<User> {
    const targetUid = asAdmin ? "demo-admin" : "demo-user";
    const existing = this.localStore.getUsers().find((u) => u.uid === targetUid);
    const demoUser: User = existing ?? {
      uid: targetUid,
      email: asAdmin ? "admin@dietetycznie.pl" : "demo@dietetycznie.pl",
      displayName: asAdmin ? "Admin DietEtycznie" : "Konto Demo",
      role: asAdmin ? "admin" : "user",
      medicalConditions: ["Hashimoto"],
      savedRecipes: ["rec-omlet-losos-szpinak", "rec-kurczak-grecki-ryz"],
      dietPlans: [],
      subscription: { tier: asAdmin ? "pro" : "free", active: asAdmin },
    };
    this.localStore.upsertUser(demoUser);
    this.localStore.saveDemoUser(demoUser);
    this.userSubject.next(demoUser);
    return demoUser;
  }

  async signInWithGoogle(): Promise<User> {
    if (this.firebase.isConfigured && this.firebase.auth) {
      const provider = new GoogleAuthProvider();
      const cred = await signInWithPopup(this.firebase.auth, provider);
      const profile = await this.loadOrCreateUserProfile(cred.user);
      this.userSubject.next(profile);
      return profile;
    }
    return this.signInDemo(false);
  }

  async signUp(
    email: string,
    password: string,
    displayName: string,
  ): Promise<User> {
    if (this.firebase.isConfigured && this.firebase.auth && this.firebase.db) {
      const cred = await createUserWithEmailAndPassword(
        this.firebase.auth,
        email,
        password,
      );
      const user: User = {
        uid: cred.user.uid,
        email: cred.user.email || email,
        displayName,
        role: "user",
        medicalConditions: [],
        savedRecipes: [],
        dietPlans: [],
        subscription: { tier: "free", active: false },
      };
      await setDoc(doc(this.firebase.db, `users/${user.uid}`), {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        medicalConditions: [],
        savedRecipes: [],
        dietPlans: [],
      });
      this.userSubject.next(user);
      return user;
    }

    const demoUser: User = {
      uid: "demo-" + Date.now(),
      email,
      displayName: displayName || "Użytkownik Demo",
      role: "user",
      medicalConditions: [],
      savedRecipes: [],
      dietPlans: [],
      subscription: { tier: "free", active: false },
    };
    this.localStore.upsertUser(demoUser);
    this.localStore.saveDemoUser(demoUser);
    this.userSubject.next(demoUser);
    return demoUser;
  }

  async signOut(): Promise<void> {
    if (this.firebase.isConfigured && this.firebase.auth) {
      await signOut(this.firebase.auth);
    }
    this.localStore.saveDemoUser(null);
    this.userSubject.next(null);
  }

  updateCurrentUserSnapshot(patch: Partial<User>): void {
    const current = this.userSubject.value;
    if (!current) return;
    const updated: User = { ...current, ...patch };
    this.userSubject.next(updated);
    if (!this.firebase.isConfigured) {
      this.localStore.upsertUser(updated);
      this.localStore.saveDemoUser(updated);
    }
  }

  private async loadOrCreateUserProfile(fbUser: FirebaseUser): Promise<User> {
    if (!this.firebase.db) {
      return {
        uid: fbUser.uid,
        email: fbUser.email || "",
        displayName: fbUser.displayName || "Użytkownik",
        role: fbUser.uid === BOOTSTRAP_ADMIN_UID ? "admin" : "user",
        savedRecipes: [],
        medicalConditions: [],
        dietPlans: [],
      };
    }

    const userRef = doc(this.firebase.db, `users/${fbUser.uid}`);
    const snap = await getDoc(userRef);

    let isAdminDoc = fbUser.uid === BOOTSTRAP_ADMIN_UID;
    try {
      const adminSnap = await getDoc(
        doc(this.firebase.db, `admins/${fbUser.uid}`),
      );
      if (adminSnap.exists()) {
        isAdminDoc = true;
      }
    } catch {
      // admins doc may not exist or be unreadable
    }

    if (snap.exists()) {
      const data = snap.data() as User;
      return {
        ...data,
        uid: fbUser.uid,
        email: data.email || fbUser.email || "",
        displayName: data.displayName || fbUser.displayName || "Użytkownik",
        photoURL: data.photoURL || fbUser.photoURL || undefined,
        role: isAdminDoc || data.role === "admin" ? "admin" : "user",
        savedRecipes: data.savedRecipes ?? [],
        medicalConditions: data.medicalConditions ?? [],
        dietPlans: data.dietPlans ?? [],
      };
    }

    const newUser: User = {
      uid: fbUser.uid,
      email: fbUser.email || "",
      displayName: fbUser.displayName || "Użytkownik",
      ...(fbUser.photoURL ? { photoURL: fbUser.photoURL } : {}),
      medicalConditions: [],
      savedRecipes: [],
      dietPlans: [],
    };
    await setDoc(userRef, this.firebase.cleanPayload(newUser));
    return {
      ...newUser,
      role: isAdminDoc ? "admin" : "user",
    };
  }
}
