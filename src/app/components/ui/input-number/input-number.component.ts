import { Component, Input, Output, EventEmitter } from "@angular/core";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { FormsModule } from "@angular/forms";

@Component({
  selector: "app-input-number",
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, FormsModule],
  template: `
    <mat-form-field appearance="outline" class="form-group">
      <mat-label>{{ label }}</mat-label>
      <input
        matInput
        type="number"
        [ngModel]="model"
        (ngModelChange)="onModelChange($event)"
        [name]="name"
        [placeholder]="placeholder"
      />
    </mat-form-field>
  `,
})
export class InputNumberComponent {
  @Input() label = "";
  @Input() model: number | null = null;
  @Input() name = "";
  @Input() placeholder = "";
  @Output() modelChange = new EventEmitter<number | null>();

  onModelChange(value: number | null) {
    this.modelChange.emit(value);
  }
}

