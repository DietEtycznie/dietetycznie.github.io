import { Component, Input, Output, EventEmitter } from "@angular/core";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { FormsModule } from "@angular/forms";

@Component({
  selector: "app-input-select",
  standalone: true,
  imports: [MatFormFieldModule, MatSelectModule, FormsModule],
  template: `
    <mat-form-field appearance="outline" class="form-group">
      <mat-label>{{ label }}</mat-label>
      <mat-select
        [ngModel]="model"
        (ngModelChange)="onModelChange($event)"
        [name]="name"
      >
        @for (option of options; track option) {
          <mat-option [value]="option">{{ option }}</mat-option>
        }
      </mat-select>
    </mat-form-field>
  `,
})
export class InputSelectComponent {
  @Input() label = "";
  @Input() model: string = "";
  @Input() name = "";
  @Input() options: string[] = [];
  @Output() modelChange = new EventEmitter<string>();

  onModelChange(value: string) {
    this.modelChange.emit(value);
  }
}
