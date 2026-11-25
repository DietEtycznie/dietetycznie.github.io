import { CommonModule } from "@angular/common";
import { Component, inject, OnDestroy, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatIconModule } from "@angular/material/icon";
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription } from "rxjs";
import { MedicalCondition } from "../../../models/medical-condition.model";
import { MedicalConditionService } from "../../../services/medical-condition.service";
import {
  FilterStripComponent,
  FilterStripItem,
  LoadingStateComponent,
  PresentationHeaderComponent,
  SearchInputComponent,
} from "../../components/ui";
import { MedicalConditionCardComponent } from "./medical-condition-card/medical-condition-card.component";

@Component({
  selector: "app-conditions",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MedicalConditionCardComponent,
    PresentationHeaderComponent,
    FilterStripComponent,
    SearchInputComponent,
    LoadingStateComponent,
  ],
  templateUrl: "./conditions.component.html",
  styleUrls: ["./conditions.component.scss"],
})
export class ConditionsComponent implements OnInit, OnDestroy {
  private medicalConditionService = inject(MedicalConditionService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private sub = new Subscription();

  allConditions: MedicalCondition[] = [];
  selectedConditionId: string | null = null;
  searchQuery = "";
  loading = true;

  ngOnInit(): void {
    this.sub.add(
      this.medicalConditionService.getMedicalConditions().subscribe((list) => {
        this.allConditions = list;
        this.loading = false;
      }),
    );

    this.sub.add(
      this.route.paramMap.subscribe((params) => {
        this.selectedConditionId = params.get("id");
      }),
    );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  get conditionFilterItems(): FilterStripItem[] {
    return [
      { value: "", label: "Wszystkie", count: this.allConditions.length },
      ...this.allConditions.map((c) => ({ value: c.id, label: c.name })),
    ];
  }

  get visibleConditions(): MedicalCondition[] {
    let list = this.allConditions;

    if (this.selectedConditionId) {
      const exact = list.find((c) => c.id === this.selectedConditionId);
      if (exact) {
        return [exact];
      }
    }

    const q = this.searchQuery.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (c) => c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q),
      );
    }
    return list;
  }

  selectCondition(id: string | null): void {
    if (id) {
      this.router.navigate(["/choroby", id]);
    } else {
      this.router.navigate(["/choroby"]);
    }
  }
}
