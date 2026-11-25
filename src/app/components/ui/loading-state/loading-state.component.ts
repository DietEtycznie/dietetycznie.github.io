import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";

export type LoadingVariant = "cards" | "list" | "detail";

@Component({
  selector: "app-loading-state",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="loading-wrap" role="status" aria-live="polite">
      @if (label) {
        <div class="loading-caption">
          <span class="loading-spinner" aria-hidden="true"></span>
          <span>{{ label }}</span>
        </div>
      }

      @if (variant === "cards") {
        <div class="skeleton-cards">
          @for (_ of placeholders; track $index) {
            <div class="skeleton-card">
              <div class="sk sk--media"></div>
              <div class="skeleton-card__body">
                <div class="sk sk--title"></div>
                <div class="sk sk--meta"></div>
                <div class="skeleton-card__tags">
                  <div class="sk sk--pill"></div>
                  <div class="sk sk--pill"></div>
                </div>
              </div>
            </div>
          }
        </div>
      } @else if (variant === "list") {
        <div class="skeleton-list">
          @for (_ of placeholders; track $index) {
            <div class="skeleton-row">
              <div class="sk sk--title-lg"></div>
              <div class="sk sk--line"></div>
              <div class="sk sk--line sk--short"></div>
            </div>
          }
        </div>
      } @else {
        <div class="skeleton-detail">
          <div class="sk sk--detail-media"></div>
          <div class="skeleton-detail__info">
            <div class="sk sk--pill"></div>
            <div class="sk sk--title-xl"></div>
            <div class="sk sk--line"></div>
            <div class="sk sk--line sk--short"></div>
            <div class="sk sk--strip"></div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .loading-wrap {
        display: flex;
        flex-direction: column;
        gap: 1.1rem;
      }

      .loading-caption {
        display: inline-flex;
        align-items: center;
        gap: 0.55rem;
        font-size: 0.84rem;
        font-weight: 500;
        color: var(--ink-muted);
      }

      .loading-spinner {
        width: 15px;
        height: 15px;
        border-radius: 50%;
        border: 2px solid var(--border-strong);
        border-top-color: var(--accent-primary);
        animation: spin 0.75s linear infinite;
        flex-shrink: 0;
      }

      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }

      @keyframes shimmer {
        0% {
          background-position: -200% 0;
        }
        100% {
          background-position: 200% 0;
        }
      }

      .sk {
        border-radius: 8px;
        background: linear-gradient(
          90deg,
          var(--bg-subtle) 25%,
          var(--border-subtle) 50%,
          var(--bg-subtle) 75%
        );
        background-size: 200% 100%;
        animation: shimmer 1.4s ease-in-out infinite;
      }

      .skeleton-cards {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 1.25rem;
      }

      .skeleton-card {
        border-radius: 16px;
        border: 1px solid var(--border-subtle);
        background: var(--bg-surface);
        overflow: hidden;
      }

      .sk--media {
        height: 196px;
        border-radius: 0;
      }

      .skeleton-card__body {
        padding: 1rem 1.1rem 1.15rem;
        display: flex;
        flex-direction: column;
        gap: 0.6rem;
      }

      .sk--title {
        height: 18px;
        width: 78%;
      }

      .sk--meta {
        height: 13px;
        width: 58%;
      }

      .skeleton-card__tags {
        display: flex;
        gap: 0.45rem;
        padding-top: 0.2rem;
      }

      .sk--pill {
        height: 22px;
        width: 74px;
        border-radius: 999px;
      }

      .skeleton-list {
        display: flex;
        flex-direction: column;
        gap: 1.1rem;
      }

      .skeleton-row {
        padding: 1.45rem 1.5rem;
        border-radius: 14px;
        border: 1px solid var(--border-subtle);
        background: var(--bg-surface);
        display: flex;
        flex-direction: column;
        gap: 0.65rem;
      }

      .sk--title-lg {
        height: 22px;
        width: 38%;
      }

      .sk--line {
        height: 14px;
        width: 86%;
      }

      .sk--short {
        width: 52%;
      }

      .skeleton-detail {
        display: grid;
        grid-template-columns: 420px 1fr;
        gap: 3rem;
        align-items: center;
        padding: 1rem 0 2.5rem;
      }

      .sk--detail-media {
        aspect-ratio: 1 / 1;
        border-radius: 22px;
      }

      .skeleton-detail__info {
        display: flex;
        flex-direction: column;
        gap: 0.9rem;
      }

      .sk--title-xl {
        height: 36px;
        width: 72%;
      }

      .sk--strip {
        height: 68px;
        width: 100%;
        margin-top: 0.4rem;
      }

      @media (max-width: 980px) {
        .skeleton-cards {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .skeleton-detail {
          grid-template-columns: 1fr;
          gap: 1.75rem;
        }
      }

      @media (max-width: 600px) {
        .skeleton-cards {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class LoadingStateComponent {
  @Input() variant: LoadingVariant = "cards";
  @Input() count = 6;
  @Input() label = "Wczytywanie...";

  get placeholders(): number[] {
    return Array.from({ length: this.count }, (_, i) => i);
  }
}
