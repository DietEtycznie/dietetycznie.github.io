import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { createEmptyMealPlan, DietPlan } from "../../../../models/diet-plan.model";
import { MEDICAL_CONDITIONS } from "../../../../models/recipe.model";

@Component({
  selector: "app-add-diet-plan-dialog",
  templateUrl: "./add-diet-plan-dialog.component.html",
  styleUrls: ["./add-diet-plan-dialog.component.scss"],
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
})
export class AddDietPlanDialogComponent {
  dialogRef = inject(MatDialogRef<AddDietPlanDialogComponent>);
  allConditions = MEDICAL_CONDITIONS;

  newDietPlan: Partial<DietPlan> = {
    name: "",
    description: "",
    suitableForConditions: [],
    mealPlan: createEmptyMealPlan(),
  };

  toggleCondition(cond: string): void {
    const list = this.newDietPlan.suitableForConditions ?? [];
    const idx = list.indexOf(cond);
    if (idx >= 0) {
      list.splice(idx, 1);
    } else {
      list.push(cond);
    }
    this.newDietPlan.suitableForConditions = [...list];
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (!this.newDietPlan.name?.trim()) return;
    this.dialogRef.close({
      ...this.newDietPlan,
      name: this.newDietPlan.name.trim(),
      description: this.newDietPlan.description?.trim() ?? "",
      mealPlan: createEmptyMealPlan(),
    });
  }
}
