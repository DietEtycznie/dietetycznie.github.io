import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";

@Component({
  selector: "app-auth-shell",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="auth-split fade-in">
      <!-- Left Editorial Visual Panel -->
      <aside class="auth-aside" aria-hidden="false">
        <div class="auth-aside__inner">
          <div class="auth-aside__copy">
            <h2>{{ asideTitle }}</h2>
            <p>{{ asideDescription }}</p>
          </div>

          <div class="auth-visual">
            <div class="auth-visual__glow" aria-hidden="true"></div>
            <img
              src="assets/presentation-header-cutout.png"
              alt="Świeże owoce jagodowe i cytrusy — DietEtycznie"
              class="auth-visual__img"
            />
          </div>
        </div>
      </aside>

      <!-- Right Form Panel -->
      <section class="auth-main">
        <img
          src="assets/presentation-header-cutout.png"
          alt=""
          aria-hidden="true"
          class="auth-mobile-bg"
        />
        <div class="auth-form-wrap">
          <div class="auth-form-head">
            <h1>{{ formTitle }}</h1>
            <p>{{ formSubtitle }}</p>
          </div>

          <ng-content></ng-content>
        </div>
      </section>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .auth-split {
        display: grid;
        grid-template-columns: 1fr 1fr;
        min-height: calc(100vh - 67px);
        background: var(--bg-surface);
      }

      // Left Brand & Visual Panel
      .auth-aside {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 2.5rem 3rem;
        background:
          radial-gradient(
            900px 660px at 0% 0%,
            rgba(230, 176, 210, 0.42) 0%,
            rgba(230, 176, 210, 0.18) 46%,
            transparent 78%
          ),
          radial-gradient(
            ellipse 96% 88% at 50% 54%,
            rgba(90, 94, 110, 0.2) 0%,
            rgba(90, 94, 110, 0.1) 48%,
            rgba(90, 94, 110, 0.03) 76%,
            transparent 96%
          ),
          var(--bg-paper);
        border-right: 1px solid var(--border-subtle);
        overflow: hidden;
      }

      :host-context([data-theme="dark"]) .auth-aside {
        background:
          radial-gradient(
            900px 660px at 0% 0%,
            rgba(230, 176, 210, 0.24) 0%,
            rgba(230, 176, 210, 0.09) 46%,
            transparent 78%
          ),
          radial-gradient(
            ellipse 96% 88% at 50% 54%,
            rgba(180, 188, 224, 0.13) 0%,
            rgba(180, 188, 224, 0.05) 50%,
            transparent 84%
          ),
          var(--bg-paper);
      }

      .auth-aside__inner {
        position: relative;
        z-index: 1;
        width: 100%;
        max-width: 460px;
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      }

      .auth-aside__copy {
        h2 {
          font-size: clamp(1.75rem, 2.6vw, 2.25rem);
          font-weight: 800;
          line-height: 1.15;
          letter-spacing: -0.03em;
          color: var(--ink-primary);
          margin: 0 0 0.7rem;
        }

        p {
          font-size: 0.96rem;
          line-height: 1.65;
          color: var(--ink-secondary);
          margin: 0;
          max-width: 410px;
        }
      }

      .auth-visual {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0.75rem 0;
      }

      .auth-visual__glow {
        position: absolute;
        inset: -56px -96px;
        background: radial-gradient(
          ellipse 64% 62% at 50% 52%,
          rgba(95, 105, 103, 0.14) 0%,
          rgba(95, 105, 103, 0.05) 48%,
          transparent 74%
        );
        pointer-events: none;
        z-index: 0;
      }

      :host-context([data-theme="dark"]) .auth-visual__glow {
        background: radial-gradient(
          ellipse 64% 62% at 50% 52%,
          rgba(215, 222, 220, 0.09) 0%,
          rgba(215, 222, 220, 0.03) 48%,
          transparent 75%
        );
      }

      .auth-visual__img {
        position: relative;
        z-index: 1;
        width: 100%;
        max-width: 340px;
        height: auto;
        display: block;
        object-fit: contain;
        filter: drop-shadow(0 18px 34px rgba(15, 28, 22, 0.16));
      }

      :host-context([data-theme="dark"]) .auth-visual__img {
        filter: drop-shadow(0 20px 38px rgba(0, 0, 0, 0.48));
      }

      // Right Form Panel
      .auth-main {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 2.5rem 2rem;
        background: var(--bg-surface);
      }

      .auth-mobile-bg {
        display: none;
      }

      .auth-form-wrap {
        width: 100%;
        max-width: 390px;
      }

      .auth-form-head {
        margin-bottom: 1.75rem;

        h1 {
          font-size: 1.65rem;
          font-weight: 800;
          letter-spacing: -0.025em;
          color: var(--ink-primary);
          margin: 0 0 0.4rem;
        }

        p {
          font-size: 0.9rem;
          line-height: 1.55;
          color: var(--ink-secondary);
          margin: 0;
        }
      }

      @media (max-width: 920px) {
        .auth-split {
          grid-template-columns: 1fr;
          min-height: calc(100dvh - 60px);
        }

        .auth-aside {
          display: none;
        }

        .auth-main {
          position: relative;
          overflow: hidden;
          padding: 2.5rem 1.15rem 3rem;
          align-items: center;
          background:
            radial-gradient(
              440px 300px at 96% 0%,
              rgba(230, 176, 210, 0.34) 0%,
              rgba(230, 176, 210, 0.12) 48%,
              transparent 76%
            ),
            radial-gradient(
              380px 260px at 4% 100%,
              rgba(252, 98, 3, 0.1) 0%,
              rgba(230, 176, 210, 0.08) 50%,
              transparent 76%
            ),
            var(--bg-paper);
        }

        .auth-mobile-bg {
          display: block;
          position: absolute;
          top: -20px;
          right: -68px;
          width: 340px;
          height: auto;
          object-fit: contain;
          filter: blur(12px);
          opacity: 0.3;
          pointer-events: none;
          user-select: none;
          z-index: 0;
        }

        :host-context([data-theme="dark"]) .auth-mobile-bg {
          opacity: 0.2;
        }

        .auth-form-wrap {
          position: relative;
          z-index: 1;
          background: color-mix(in srgb, var(--bg-surface) 84%, transparent);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid var(--border-subtle);
          border-radius: 18px;
          padding: 1.75rem 1.35rem;
          box-shadow: var(--shadow-card);
        }
      }
    `,
  ],
})
export class AuthShellComponent {
  @Input() asideTitle = "Jedna dieta. Pełen spokój.";
  @Input() asideDescription =
    "Sprawdzone przepisy z pełnym makro, zalecenia dla chorób dietozależnych i 7-dniowe jadłospisy w jednym miejscu.";
  @Input() formTitle = "";
  @Input() formSubtitle = "";
}
