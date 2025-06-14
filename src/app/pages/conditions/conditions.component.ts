import { Component, OnInit, inject } from "@angular/core";
import { MedicalCondition } from "../../../models/medical-condition.model";
import { MedicalConditionService } from "../../../services/medical-condition.service";
import { Observable, of } from "rxjs";
import { CommonModule } from "@angular/common";
import { MedicalConditionCardComponent } from "./medical-condition-card/medical-condition-card.component";
import { PresentationHeaderComponent } from "../../components/ui/presentation-header/presentation-header.component";

@Component({
  selector: "app-conditions",
  standalone: true,
  imports: [
    CommonModule,
    MedicalConditionCardComponent,
    PresentationHeaderComponent,
  ],
  templateUrl: "./conditions.component.html",
  styleUrls: ["./conditions.component.scss"],
})
export class ConditionsComponent implements OnInit {
  private medicalConditionService = inject(MedicalConditionService);
  conditions$: Observable<MedicalCondition[]> = of([]);

  ngOnInit() {
    // Docelowo pobieranie z bazy:
    this.conditions$ = this.medicalConditionService.getMedicalConditions();
  }
}
