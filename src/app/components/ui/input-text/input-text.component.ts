import { Component, Input, Output, EventEmitter } from "@angular/core";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { FormsModule } from "@angular/forms";

@Component({
  selector: "app-input-text",
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, FormsModule],
  template: `
    <mat-form-field appearance="outline" class="form-group">
      <mat-label>{{ label }}</mat-label>
      <input
        matInput
        [ngModel]="model"
        (ngModelChange)="onModelChange($event)"
        [name]="name"
        [placeholder]="placeholder"
      />
    </mat-form-field>
  `,
})
export class InputTextComponent {
  @Input() label = "";
  @Input() model: string = "";
  @Input() name = "";
  @Input() placeholder = "";
  @Output() modelChange = new EventEmitter<string>();

  onModelChange(value: string) {
    this.modelChange.emit(value);
  }
}
