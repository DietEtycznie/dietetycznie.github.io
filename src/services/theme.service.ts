import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

export type ThemeMode = "light" | "dark";
const STORAGE_KEY = "dietetycznie_theme";

@Injectable({
  providedIn: "root",
})
export class ThemeService {
  private themeSubject = new BehaviorSubject<ThemeMode>(this.getInitialTheme());
  readonly theme$ = this.themeSubject.asObservable();

  constructor() {
    this.applyTheme(this.themeSubject.value);
  }

  get currentTheme(): ThemeMode {
    return this.themeSubject.value;
  }

  get isDark(): boolean {
    return this.themeSubject.value === "dark";
  }

  toggle(event?: MouseEvent): void {
    const next: ThemeMode = this.isDark ? "light" : "dark";

    const doc = document as Document & {
      startViewTransition?: (cb: () => void) => { ready: Promise<void> };
    };

    const prefersReduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    if (!doc.startViewTransition || prefersReduced) {
      this.setTheme(next);
      return;
    }

    const x = event ? event.clientX : window.innerWidth - 48;
    const y = event ? event.clientY : 30;
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    );

    const transition = doc.startViewTransition(() => {
      this.setTheme(next);
    });

    transition.ready.then(() => {
      document.documentElement.animate(
        {
          clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`],
        },
        {
          duration: 540,
          easing: "cubic-bezier(0.22, 1, 0.36, 1)",
          pseudoElement: "::view-transition-new(root)",
        },
      );
    });
  }

  setTheme(mode: ThemeMode): void {
    this.themeSubject.next(mode);
    this.applyTheme(mode);
    try {
      localStorage.setItem(STORAGE_KEY, mode);
    } catch {
      // Ignore storage errors
    }
  }

  private getInitialTheme(): ThemeMode {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "dark" || saved === "light") return saved;
    } catch {
      // Ignore storage errors
    }
    return "light";
  }

  private applyTheme(mode: ThemeMode): void {
    const root = document.documentElement;
    const themeColorMeta = document.querySelector('meta[name="theme-color"]');
    if (mode === "dark") {
      root.setAttribute("data-theme", "dark");
      root.style.colorScheme = "dark";
      themeColorMeta?.setAttribute("content", "#10101c");
    } else {
      root.removeAttribute("data-theme");
      root.style.colorScheme = "light";
      themeColorMeta?.setAttribute("content", "#fffdfe");
    }
  }
}
