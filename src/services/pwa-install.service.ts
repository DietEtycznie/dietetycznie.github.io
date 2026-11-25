import { Injectable, NgZone, OnDestroy, inject } from "@angular/core";
import { BehaviorSubject } from "rxjs";

export interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  prompt(): Promise<void>;
  readonly userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

export type PwaInstallMode = "none" | "native" | "ios";

const DISMISS_STORAGE_KEY = "dietetycznie_pwa_install_dismissed_at";
const DISMISS_COOLDOWN_MS = 14 * 24 * 60 * 60 * 1000; // 14 days

export function isIosSafariUserAgent(userAgent: string): boolean {
  const isIos = /iPhone|iPad|iPod/i.test(userAgent);
  if (!isIos) return false;
  const isOtherIosBrowser = /CriOS|FxiOS|EdgiOS|OPiOS|DuckDuckGo/i.test(userAgent);
  const isSafari = /Safari/i.test(userAgent);
  return isSafari && !isOtherIosBrowser;
}

export function isDismissCooldownActive(
  savedTimestamp: string | null,
  nowMs = Date.now(),
): boolean {
  if (!savedTimestamp) return false;
  const parsed = Number(savedTimestamp);
  if (!Number.isFinite(parsed)) return false;
  return nowMs - parsed < DISMISS_COOLDOWN_MS;
}

@Injectable({
  providedIn: "root",
})
export class PwaInstallService implements OnDestroy {
  private ngZone = inject(NgZone);
  private deferredPrompt: BeforeInstallPromptEvent | null = null;
  private iosDelayTimer: ReturnType<typeof setTimeout> | null = null;

  private modeSubject = new BehaviorSubject<PwaInstallMode>("none");
  readonly mode$ = this.modeSubject.asObservable();

  private readonly onBeforeInstallPrompt = (event: Event): void => {
    event.preventDefault();
    this.deferredPrompt = event as BeforeInstallPromptEvent;
    if (!this.isDismissed() && !this.isStandalone()) {
      this.ngZone.run(() => {
        this.modeSubject.next("native");
      });
    }
  };

  private readonly onAppInstalled = (): void => {
    this.deferredPrompt = null;
    this.ngZone.run(() => {
      this.modeSubject.next("none");
    });
  };

  constructor() {
    if (typeof window === "undefined") return;
    if (this.isStandalone()) return;

    window.addEventListener("beforeinstallprompt", this.onBeforeInstallPrompt);
    window.addEventListener("appinstalled", this.onAppInstalled);

    if (!this.isDismissed() && isIosSafariUserAgent(navigator.userAgent)) {
      this.ngZone.runOutsideAngular(() => {
        this.iosDelayTimer = setTimeout(() => {
          if (!this.isDismissed() && !this.isStandalone() && this.modeSubject.value === "none") {
            this.ngZone.run(() => {
              this.modeSubject.next("ios");
            });
          }
        }, 2500);
      });
    }
  }

  ngOnDestroy(): void {
    if (typeof window !== "undefined") {
      window.removeEventListener("beforeinstallprompt", this.onBeforeInstallPrompt);
      window.removeEventListener("appinstalled", this.onAppInstalled);
    }
    if (this.iosDelayTimer !== null) {
      clearTimeout(this.iosDelayTimer);
      this.iosDelayTimer = null;
    }
  }

  async promptInstall(): Promise<boolean> {
    if (!this.deferredPrompt) return false;
    const promptEvent = this.deferredPrompt;
    this.deferredPrompt = null;

    await promptEvent.prompt();
    const { outcome } = await promptEvent.userChoice;

    this.ngZone.run(() => {
      this.modeSubject.next("none");
    });

    if (outcome === "dismissed") {
      this.saveDismissal();
    }

    return outcome === "accepted";
  }

  dismiss(): void {
    this.saveDismissal();
    this.modeSubject.next("none");
  }

  private isStandalone(): boolean {
    if (typeof window === "undefined") return false;
    const nav = window.navigator as Navigator & { standalone?: boolean };
    return (
      window.matchMedia?.("(display-mode: standalone)").matches === true || nav.standalone === true
    );
  }

  private isDismissed(): boolean {
    try {
      return isDismissCooldownActive(localStorage.getItem(DISMISS_STORAGE_KEY));
    } catch {
      return false;
    }
  }

  private saveDismissal(): void {
    try {
      localStorage.setItem(DISMISS_STORAGE_KEY, String(Date.now()));
    } catch {
      // Ignore storage errors
    }
  }
}
