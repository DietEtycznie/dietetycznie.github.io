import { inject, Injectable, NgZone } from "@angular/core";
import { FirebaseApp, getApps, initializeApp } from "firebase/app";
import { Auth, getAuth } from "firebase/auth";
import { Firestore, getFirestore } from "firebase/firestore";
import { FirebaseStorage, getStorage } from "firebase/storage";
import { BehaviorSubject, Observable } from "rxjs";
import { environment } from "../environments/environment";

export function cleanFirestorePayload<T extends Record<string, any>>(data: T): Record<string, any> {
  const cleaned: Record<string, any> = {};
  for (const [key, value] of Object.entries(data)) {
    if (value !== undefined) {
      cleaned[key] = value;
    }
  }
  return cleaned;
}

@Injectable({
  providedIn: "root",
})
export class FirebaseService {
  private ngZone = inject(NgZone);

  readonly app: FirebaseApp | null = null;
  readonly db: Firestore | null = null;
  readonly auth: Auth | null = null;
  readonly storage: FirebaseStorage | null = null;
  readonly isConfigured: boolean = false;

  private fallbackSubject = new BehaviorSubject<boolean>(false);
  readonly isFallbackMode$ = this.fallbackSubject.asObservable();

  private fallbackReasonSubject = new BehaviorSubject<string>("");
  readonly fallbackReason$ = this.fallbackReasonSubject.asObservable();

  constructor() {
    const cfg = environment.firebase;
    const hasConfig = Boolean(cfg?.apiKey && cfg?.projectId);

    if (hasConfig) {
      try {
        this.app = getApps().length ? getApps()[0] : initializeApp(cfg);
        this.db = getFirestore(this.app);
        this.auth = getAuth(this.app);
        this.storage = getStorage(this.app);
        this.isConfigured = true;
      } catch (err) {
        console.warn("Firebase initialization failed, using local fallback.", err);
        this.activateFallback("Błąd inicjalizacji Firebase — uruchomiono tryb lokalny.");
      }
    } else {
      this.activateFallback("Brak konfiguracji Firebase — uruchomiono tryb lokalny z bazą seed.");
    }
  }

  get isFallbackMode(): boolean {
    return !this.isConfigured || this.fallbackSubject.value;
  }

  activateFallback(reason: string): void {
    if (!this.fallbackSubject.value) {
      this.fallbackSubject.next(true);
      this.fallbackReasonSubject.next(reason);
    }
  }

  /** Wraps native ES2022 Firebase Promises so emissions always re-enter NgZone and trigger change detection. */
  fromFirebase<T>(promise: Promise<T>): Observable<T> {
    return new Observable<T>((subscriber) => {
      promise.then(
        (value) =>
          this.ngZone.run(() => {
            subscriber.next(value);
            subscriber.complete();
          }),
        (err) =>
          this.ngZone.run(() => {
            subscriber.error(err);
          }),
      );
    });
  }

  runInZone<T>(fn: () => T): T {
    return this.ngZone.run(fn);
  }

  /** Removes top-level undefined properties because Firestore v13 rejects undefined field values. */
  cleanPayload<T extends Record<string, any>>(data: T): Record<string, any> {
    return cleanFirestorePayload(data);
  }
}
