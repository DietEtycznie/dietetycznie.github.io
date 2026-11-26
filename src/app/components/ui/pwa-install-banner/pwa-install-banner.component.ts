import { CommonModule } from "@angular/common";
import { Component, Input, inject } from "@angular/core";
import { PwaInstallService } from "../../../../services/pwa-install.service";

@Component({
  selector: "app-pwa-install-banner",
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (!hidden && (mode$ | async); as mode) {
      @if (mode !== "none") {
        <aside class="pwa-install-banner" role="region" aria-label="Instalacja aplikacji">
          <img
            src="assets/icons/icon-192x192.png"
            alt=""
            aria-hidden="true"
            class="pwa-install-banner__icon"
          />

          <div class="pwa-install-banner__copy">
            <strong>Zainstaluj DietEtycznie</strong>
            @if (mode === "native") {
              <span>Szybki dostęp z ekranu głównego i tryb offline.</span>
            } @else {
              <span class="ios-hint">
                Stuknij
                <svg
                  class="ios-share-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-label="Udostępnij"
                >
                  <path d="M12 3v12" />
                  <path d="m7 8 5-5 5 5" />
                  <path d="M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6" />
                </svg>
                → <b>Dodaj do ekranu początkowego</b>
              </span>
            }
          </div>

          <div class="pwa-install-banner__actions">
            @if (mode === "native") {
              <button type="button" class="pwa-install-btn" (click)="install()">Zainstaluj</button>
            }
            <button
              type="button"
              class="pwa-close-btn"
              aria-label="Zamknij baner instalacji"
              (click)="dismiss()"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </aside>
      }
    }
  `,
  styles: [
    `
      .pwa-install-banner {
        position: fixed;
        left: 50%;
        bottom: calc(1rem + env(safe-area-inset-bottom, 0px));
        transform: translateX(-50%);
        z-index: 350;
        width: calc(100vw - 1.5rem);
        max-width: 440px;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.72rem 0.85rem;
        border-radius: 16px;
        background: color-mix(in srgb, var(--bg-surface) 92%, transparent);
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
        border: 1px solid var(--border-strong);
        box-shadow: 0 12px 34px rgba(15, 38, 28, 0.14);
        animation: pwaSlideUp 0.28s cubic-bezier(0.22, 1, 0.36, 1);
      }

      :host-context([data-theme="dark"]) .pwa-install-banner {
        box-shadow: 0 14px 36px rgba(0, 0, 0, 0.42);
      }

      @keyframes pwaSlideUp {
        from {
          opacity: 0;
          transform: translate(-50%, 14px);
        }
        to {
          opacity: 1;
          transform: translate(-50%, 0);
        }
      }

      .pwa-install-banner__icon {
        width: 38px;
        height: 38px;
        border-radius: 10px;
        flex-shrink: 0;
        display: block;
      }

      .pwa-install-banner__copy {
        flex: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 0.12rem;

        strong {
          font-family: "Plus Jakarta Sans", "Inter", sans-serif;
          font-size: 0.88rem;
          font-weight: 700;
          color: var(--ink-primary);
          line-height: 1.2;
        }

        span {
          font-size: 0.77rem;
          line-height: 1.35;
          color: var(--ink-secondary);
        }

        b {
          font-weight: 600;
          color: var(--ink-primary);
        }
      }

      .ios-hint {
        display: inline;
      }

      .ios-share-icon {
        display: inline-block;
        width: 14px;
        height: 14px;
        vertical-align: -2px;
        margin: 0 0.12rem;
        color: var(--accent-dark);
      }

      .pwa-install-banner__actions {
        display: flex;
        align-items: center;
        gap: 0.4rem;
        flex-shrink: 0;
      }

      .pwa-install-btn {
        border: none;
        border-radius: 999px;
        background: var(--accent-primary);
        color: var(--accent-on-primary);
        padding: 0.45rem 0.9rem;
        font-family: "Plus Jakarta Sans", "Inter", sans-serif;
        font-size: 0.8rem;
        font-weight: 600;
        cursor: pointer;
        transition: background 0.16s ease;

        &:hover {
          background: var(--accent-hover);
        }
      }

      .pwa-close-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 30px;
        height: 30px;
        padding: 0;
        border-radius: 8px;
        border: 1px solid var(--border-subtle);
        background: var(--bg-subtle);
        color: var(--ink-secondary);
        cursor: pointer;
        transition:
          color 0.15s ease,
          background 0.15s ease;

        svg {
          width: 15px;
          height: 15px;
        }

        &:hover {
          color: var(--ink-primary);
        }
      }

      @media print {
        .pwa-install-banner {
          display: none !important;
        }
      }
    `,
  ],
})
export class PwaInstallBannerComponent {
  @Input() hidden = false;

  private pwaInstallService = inject(PwaInstallService);
  readonly mode$ = this.pwaInstallService.mode$;

  install(): void {
    void this.pwaInstallService.promptInstall();
  }

  dismiss(): void {
    this.pwaInstallService.dismiss();
  }
}
