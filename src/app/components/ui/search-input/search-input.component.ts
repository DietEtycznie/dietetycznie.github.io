import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatIconModule } from "@angular/material/icon";

@Component({
  selector: "app-search-input",
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  template: `
    <div class="search-input-shell">
      <mat-icon class="search-icon">search</mat-icon>
      <input
        type="text"
        [ngModel]="value"
        (ngModelChange)="onValueChange($event)"
        [placeholder]="placeholder"
        [attr.aria-label]="ariaLabel || placeholder"
      />
      @if (value) {
        <button
          type="button"
          class="search-clear"
          (click)="clear()"
          aria-label="Wyczyść wyszukiwanie"
        >
          <mat-icon>close</mat-icon>
        </button>
      }
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .search-input-shell {
        display: flex;
        align-items: center;
        gap: 0.45rem;
        height: 40px;
        width: 100%;
        padding: 0 0.75rem;
        border-radius: 8px;
        border: 1px solid var(--border-strong);
        background: var(--bg-surface);
        transition:
          border-color 0.15s ease,
          box-shadow 0.15s ease;

        &:focus-within {
          border-color: var(--accent-primary);
          box-shadow: 0 0 0 3px var(--accent-soft);
        }
      }

      .search-icon {
        font-size: 18px;
        width: 18px;
        height: 18px;
        color: var(--ink-muted);
        flex-shrink: 0;
      }

      input {
        border: none;
        outline: none;
        width: 100%;
        height: 100%;
        font-size: 0.86rem;
        font-family: inherit;
        color: var(--ink-primary);
        background: transparent;
      }

      .search-clear {
        border: none;
        background: transparent;
        padding: 0;
        width: 22px;
        height: 22px;
        border-radius: 50%;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        color: var(--ink-muted);
        cursor: pointer;
        flex-shrink: 0;

        &:hover {
          background: var(--nav-hover);
          color: var(--ink-primary);
        }

        mat-icon {
          font-size: 15px;
          width: 15px;
          height: 15px;
        }
      }
    `,
  ],
})
export class SearchInputComponent {
  @Input() value = "";
  @Input() placeholder = "Szukaj...";
  @Input() ariaLabel = "";
  @Output() valueChange = new EventEmitter<string>();

  onValueChange(next: string): void {
    this.value = next;
    this.valueChange.emit(next);
  }

  clear(): void {
    this.onValueChange("");
  }
}
