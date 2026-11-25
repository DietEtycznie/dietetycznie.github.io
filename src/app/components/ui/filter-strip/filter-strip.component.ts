import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";

export interface FilterStripItem {
  value: string;
  label: string;
  count?: number;
}

@Component({
  selector: "app-filter-strip",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="filter-strip" role="tablist">
      @for (item of items; track item.value) {
        <button
          type="button"
          class="filter-link"
          role="tab"
          [attr.aria-selected]="activeValue === item.value"
          [class.is-active]="activeValue === item.value"
          (click)="selected.emit(item.value)"
        >
          <span>{{ item.label }}</span>
          @if (item.count !== undefined) {
            <span class="count-pill">{{ item.count }}</span>
          }
        </button>
      }
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .filter-strip {
        display: flex;
        flex-wrap: wrap;
        gap: 0.35rem 1.25rem;
        padding-bottom: 0.85rem;
        border-bottom: 1px solid var(--border-subtle);
      }

      .filter-link {
        display: inline-flex;
        align-items: center;
        gap: 0.4rem;
        border: none;
        background: transparent;
        padding: 0.25rem 0;
        font-family: inherit;
        font-size: 0.86rem;
        font-weight: 500;
        color: var(--ink-secondary);
        cursor: pointer;
        transition: color 0.15s ease;

        &:hover {
          color: var(--ink-primary);
        }

        &.is-active {
          color: var(--accent-dark);
          font-weight: 700;
        }
      }
    `,
  ],
})
export class FilterStripComponent {
  @Input() items: FilterStripItem[] = [];
  @Input() activeValue = "";
  @Output() selected = new EventEmitter<string>();
}
