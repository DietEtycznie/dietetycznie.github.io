import { Component, DestroyRef, inject, OnInit } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { RouterOutlet } from "@angular/router";
import { SwUpdate } from "@angular/service-worker";
import { FooterComponent, HeaderComponent } from "./components/ui";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  template: `
    <div class="app-shell">
      <app-header />
      <div class="app-content">
        <router-outlet></router-outlet>
      </div>
      <app-footer />

      @if (updateAvailable) {
        <div class="pwa-update-toast" role="status" aria-live="polite">
          <span>Dostępna nowa wersja DietEtycznie</span>
          <div class="pwa-update-toast__actions">
            <button type="button" class="pwa-update-btn" (click)="reloadForUpdate()">
              Odśwież
            </button>
            <button
              type="button"
              class="pwa-dismiss-btn"
              aria-label="Zamknij powiadomienie"
              (click)="updateAvailable = false"
            >
              ×
            </button>
          </div>
        </div>
      }
    </div>
  `,
  styles: [
    `
      .app-shell {
        display: flex;
        flex-direction: column;
        min-height: 100dvh;
        padding-bottom: env(safe-area-inset-bottom, 0px);
      }
      .app-content {
        flex: 1 0 auto;
      }
      .pwa-update-toast {
        position: fixed;
        left: 50%;
        bottom: calc(1.25rem + env(safe-area-inset-bottom, 0px));
        transform: translateX(-50%);
        z-index: 400;
        display: flex;
        align-items: center;
        gap: 0.85rem;
        padding: 0.65rem 0.85rem 0.65rem 1.1rem;
        border-radius: 999px;
        background: var(--bg-surface);
        color: var(--ink-primary);
        border: 1px solid var(--border-strong);
        box-shadow: 0 12px 32px rgba(0, 0, 0, 0.18);
        font-size: 0.86rem;
        font-weight: 500;
        max-width: calc(100vw - 2rem);
      }
      .pwa-update-toast__actions {
        display: flex;
        align-items: center;
        gap: 0.35rem;
        flex-shrink: 0;
      }
      .pwa-update-btn {
        border: none;
        border-radius: 999px;
        background: var(--accent-primary);
        color: #ffffff;
        padding: 0.38rem 0.9rem;
        font-size: 0.82rem;
        font-weight: 600;
        cursor: pointer;
      }
      .pwa-dismiss-btn {
        border: none;
        background: transparent;
        color: var(--ink-muted);
        width: 28px;
        height: 28px;
        border-radius: 50%;
        font-size: 1.1rem;
        line-height: 1;
        cursor: pointer;
      }
    `,
  ],
})
export class AppComponent implements OnInit {
  private swUpdate = inject(SwUpdate, { optional: true });
  private destroyRef = inject(DestroyRef);

  updateAvailable = false;

  ngOnInit(): void {
    if (!this.swUpdate?.isEnabled) return;

    this.swUpdate.versionUpdates.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((event) => {
      if (event.type === "VERSION_READY") {
        this.updateAvailable = true;
      }
    });

    this.swUpdate.unrecoverable.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      window.location.reload();
    });
  }

  reloadForUpdate(): void {
    window.location.reload();
  }
}
