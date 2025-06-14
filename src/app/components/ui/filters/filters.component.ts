import { Component, Input, Output, EventEmitter } from "@angular/core";
import { InputNumberComponent } from "../input-number/input-number.component";
import { CheckboxGroupComponent } from "../checkbox-group/checkbox-group.component";
import { InputTextComponent } from "../input-text/input-text.component";
import { MatSlideToggle } from "@angular/material/slide-toggle";
import { FormsModule } from "@angular/forms";
import {
  DIET_TAGS,
  MEAL_TYPES,
  MEDICAL_CONDITIONS,
} from "../../../../models/recipe.model";

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
  @Input() filterMaxKcal: number | null = null;
  @Input() filterCondition: string[] = [];
  @Input() filterDiets: string[] = [];
  @Input() activeMealType: string = "";

  medicalConditions = MEDICAL_CONDITIONS;
  dietTags = DIET_TAGS;
  mealTypes = MEAL_TYPES;

  @Input() filterMaxProtein: number | null = null;
  @Input() filterMaxCarbs: number | null = null;
  @Input() filterMaxFat: number | null = null;
  @Input() filterMaxSodium: number | null = null;
  @Input() filterMaxFiber: number | null = null;

  @Output() filterNameChange = new EventEmitter<string>();
  @Output() filterLikedChange = new EventEmitter<boolean>();
  @Output() filterTypeChange = new EventEmitter<string[]>();
  @Output() filterMaxKcalChange = new EventEmitter<number | null>();
  @Output() filterConditionChange = new EventEmitter<string[]>();
  @Output() filterDietsChange = new EventEmitter<string[]>();

  @Output() filterMaxProteinChange = new EventEmitter<number | null>();
  @Output() filterMaxCarbsChange = new EventEmitter<number | null>();
  @Output() filterMaxFatChange = new EventEmitter<number | null>();
  @Output() filterMaxSodiumChange = new EventEmitter<number | null>();
  @Output() filterMaxFiberChange = new EventEmitter<number | null>();

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
  onFilterMaxProteinChange(value: number | null) {
    this.filterMaxProteinChange.emit(value);
  }
  onFilterMaxCarbsChange(value: number | null) {
    this.filterMaxCarbsChange.emit(value);
  }
  onFilterMaxFatChange(value: number | null) {
    this.filterMaxFatChange.emit(value);
  }
  onFilterMaxSodiumChange(value: number | null) {
    this.filterMaxSodiumChange.emit(value);
  }
  onFilterMaxFiberChange(value: number | null) {
    this.filterMaxFiberChange.emit(value);
  }
  onFilterDietsChange(value: string[]) {
    this.filterDietsChange.emit(value);
  }
}
