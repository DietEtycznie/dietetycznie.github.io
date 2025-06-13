import { Component, Input, Output, EventEmitter } from "@angular/core";
import { InputNumberComponent } from "../input-number/input-number.component";
import { CheckboxGroupComponent } from "../checkbox-group/checkbox-group.component";
import { InputTextComponent } from "../input-text/input-text.component";
import { MatSlideToggle } from "@angular/material/slide-toggle";
import { FormsModule } from "@angular/forms";

@Component({
  selector: "app-filters",
  templateUrl: "./filters.component.html",
  styleUrls: ["./filters.component.scss"],
  standalone: true,
  imports: [
    FormsModule,
    InputNumberComponent,
    CheckboxGroupComponent,
    InputTextComponent,
    MatSlideToggle,
  ],
})
export class FiltersComponent {
  @Input() filterName: string = "";
  @Input() filterLiked: boolean = false;
  @Input() filterType: string[] = [];
  @Input() mealTypes: string[] = [];
  @Input() filterMaxKcal: number | null = null;
  @Input() filterCondition: string[] = [];
  @Input() medicalConditions: string[] = [];
  @Input() activeMealType: string = "";

  @Output() filterNameChange = new EventEmitter<string>();
  @Output() filterLikedChange = new EventEmitter<boolean>();
  @Output() filterTypeChange = new EventEmitter<string[]>();
  @Output() filterMaxKcalChange = new EventEmitter<number | null>();
  @Output() filterConditionChange = new EventEmitter<string[]>();

  onFilterNameChange(value: string) {
    this.filterNameChange.emit(value);
  }
  onFilterLikedChange(value: boolean) {
    this.filterLikedChange.emit(value);
  }
  onFilterTypeChange(value: string[]) {
    this.filterTypeChange.emit(value);
  }
  onFilterMaxKcalChange(value: number | null) {
    this.filterMaxKcalChange.emit(value);
  }
  onFilterConditionChange(value: string[]) {
    this.filterConditionChange.emit(value);
  }
}
