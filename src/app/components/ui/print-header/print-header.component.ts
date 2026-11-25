import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { BrandLogoComponent } from "../brand-logo/brand-logo.component";

@Component({
  selector: "app-print-header",
  standalone: true,
  imports: [CommonModule, BrandLogoComponent],
  template: `
    <div class="print-brand-header" aria-hidden="true">
      <app-brand-logo size="sm" surface="white"></app-brand-logo>
      <span class="print-domain">{{ domain }}</span>
    </div>
  `,
  styles: [
    `
      :host {
        display: none;
      }

      @media print {
        :host {
          display: block;
        }
      }

      .print-brand-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-bottom: 3.5mm;
        border-bottom: 1px solid #e5ece8;
      }

      .print-domain {
        font-family: "Plus Jakarta Sans", "Inter", sans-serif;
        font-size: 0.78rem;
        font-weight: 700;
        letter-spacing: 0.01em;
        color: #20b27f;
      }
    `,
  ],
})
export class PrintHeaderComponent {
  @Input() domain = "dietetycznie.github.io";
}
