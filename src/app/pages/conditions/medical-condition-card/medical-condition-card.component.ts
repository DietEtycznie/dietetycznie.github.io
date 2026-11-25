import { CommonModule } from "@angular/common";
import { Component, inject, Input } from "@angular/core";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatIconModule } from "@angular/material/icon";
import { Router } from "@angular/router";
import { MedicalCondition } from "../../../../models/medical-condition.model";

@Component({
  selector: "app-medical-condition-card",
  standalone: true,
  imports: [CommonModule, MatExpansionModule, MatIconModule],
  templateUrl: "./medical-condition-card.component.html",
  styleUrls: ["./medical-condition-card.component.scss"],
})
export class MedicalConditionCardComponent {
  @Input({ required: true }) condition!: MedicalCondition;
  @Input() expandedByDefault = false;

  private router = inject(Router);

  goToRecipesWithCondition(): void {
    this.router.navigate(["/przepisy"], {
      queryParams: { condition: this.condition.name },
    });
  }

  goToDietPlans(): void {
    this.router.navigate(["/jadlospisy"], {
      queryParams: { condition: this.condition.name },
    });
  }
}
