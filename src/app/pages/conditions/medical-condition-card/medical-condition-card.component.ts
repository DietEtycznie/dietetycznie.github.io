import { Component, Input } from "@angular/core";
import { MedicalCondition } from "../../../../models/medical-condition.model";
import { CommonModule } from "@angular/common";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatIconModule } from "@angular/material/icon";
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
  MatCardTitle,
} from "@angular/material/card";
import { Router, RouterLink } from "@angular/router";

@Component({
  selector: "app-medical-condition-card",
  standalone: true,
  imports: [
    CommonModule,
    MatExpansionModule,
    MatIconModule,
    MatCardContent,
    MatCardTitle,
    MatCardHeader,
    MatCard,
    MatCardActions,
    RouterLink,
  ],
  templateUrl: "./medical-condition-card.component.html",
  styleUrls: ["./medical-condition-card.component.scss"],
})
export class MedicalConditionCardComponent {
  @Input() condition!: MedicalCondition;
  constructor(private router: Router) {}

  goToRecipesWithCondition() {
    this.router.navigate(["/recipes"], {
      queryParams: { condition: this.condition.name },
    });
  }
}
