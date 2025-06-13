import { Component, inject } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatButtonModule } from "@angular/material/button";
import { FormsModule } from "@angular/forms";
import { NgForOf } from "@angular/common";
import { DietPlan } from "../../../../models/diet-plan.model";

@Component({
  selector: "app-add-diet-plan-dialog",
  templateUrl: "./add-diet-plan-dialog.component.html",
  styleUrls: ["./add-diet-plan-dialog.component.scss"],
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule, FormsModule],
})
export class AddDietPlanDialogComponent {
  newDietPlan: Partial<DietPlan> = {
    name: "",
    description: "",
    suitableForConditions: [],
    mealPlan: {
      monday: ["", "", "", ""],
      tuesday: ["", "", "", ""],
      wednesday: ["", "", "", ""],
      thursday: ["", "", "", ""],
      friday: ["", "", "", ""],
      saturday: ["", "", "", ""],
      sunday: ["", "", "", ""],
    },
  };

  dialogRef = inject(MatDialogRef<AddDietPlanDialogComponent>);

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    this.dialogRef.close(this.newDietPlan);
  }
}
