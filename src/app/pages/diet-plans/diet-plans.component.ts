import { Component, OnInit, OnDestroy, inject } from "@angular/core";
import { DietPlan } from "../../../models/diet-plan.model";
import { Recipe } from "../../../models/recipe.model";
import { DietPlanService } from "../../../services/diet-plan.service";
import { RecipeService } from "../../../services/recipe.service";
import { MedicalConditionService } from "../../../services/medical-condition.service";
import { AuthService } from "../../../services/auth.service";
import { FormsModule } from "@angular/forms";
import { NgForOf, NgIf } from "@angular/common";
import { RecipeCardComponent } from "../../components/ui/recipe-card/recipe-card.component";
import { Router } from "@angular/router";
import { Subscription, take, shareReplay } from "rxjs";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule, MatDialog } from "@angular/material/dialog";
import { AddDietPlanDialogComponent } from "./add-diet-plan-dialog/add-diet-plan-dialog.component";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatIconModule } from "@angular/material/icon";
import { FiltersComponent } from "../../components/ui/filters/filters.component";
import { RecipeListElementComponent } from "../../components/ui/recipe-list-element/recipe-list-element.component";

export const MEAL_TYPES = [
  "Śniadanie",
  "Obiad",
  "Podwieczorek",
  "Kolacja",
  "Przekąska",
];

@Component({
  selector: "app-diet-plans",
  templateUrl: "./diet-plans.component.html",
  styleUrls: ["./diet-plans.component.scss"],
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    NgIf,
    RecipeCardComponent,
    MatButtonToggleModule,
    MatButtonModule,
    MatDialogModule,
    MatExpansionModule,
    MatIconModule,
    FiltersComponent,
    RecipeListElementComponent,
  ],
})
export class DietPlansComponent implements OnInit, OnDestroy {
  readyPlans: DietPlan[] = [];
  myPlans: DietPlan[] = [];
  allRecipes: Recipe[] = [];
  availableConditions: string[] = [];
  selectedConditions: string[] = [];
  currentUserId: string | null = null;
  activeSection = "readyPlans";
  editModes: { [key: string]: boolean } = {};
  private subscriptions = new Subscription();
  private originalPlans: { [key: string]: DietPlan } = {};

  weekDays = [
    { key: "monday", label: "Poniedziałek" },
    { key: "tuesday", label: "Wtorek" },
    { key: "wednesday", label: "Środa" },
    { key: "thursday", label: "Czwartek" },
    { key: "friday", label: "Piątek" },
    { key: "saturday", label: "Sobota" },
    { key: "sunday", label: "Niedziela" },
  ];

  meals = MEAL_TYPES;

  pickerOpen = false;
  pickerFilter = "";
  filteredRecipes: Recipe[] = [];
  pickerPlanIdx = 0;
  pickerDay = "";
  pickerMealIdx = 0;

  pickerFilterType: string[] = [];
  pickerFilterLiked: boolean = false;
  pickerFilterMaxKcal: number | null = null;
  pickerFilterCondition: string[] = [];

  dietPlanService = inject(DietPlanService);
  recipeService = inject(RecipeService);
  medicalConditionService = inject(MedicalConditionService);
  authService = inject(AuthService);
  router = inject(Router);
  dialog = inject(MatDialog);

  user$ = this.authService.user$.pipe(take(1), shareReplay(1));

  ngOnInit() {
    this.loadRecipes();
    this.loadConditions();

    this.subscriptions.add(
      this.user$.subscribe((user) => {
        this.currentUserId = user?.uid || null;
        this.loadReadyPlans();
        this.loadMyPlans();
      }),
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  loadReadyPlans() {
    this.subscriptions.add(
      this.dietPlanService.getPublicDietPlans().subscribe((plans) => {
        this.readyPlans = plans;
      }),
    );
  }

  loadMyPlans() {
    if (this.currentUserId) {
      this.subscriptions.add(
        this.dietPlanService
          .getUserDietPlans(this.currentUserId)
          .subscribe((plans) => {
            this.myPlans = plans;
          }),
      );
    } else {
      this.myPlans = [];
    }
  }

  loadRecipes() {
    this.subscriptions.add(
      this.recipeService.getRecipes().subscribe((recipes) => {
        this.allRecipes = recipes;
      }),
    );
  }

  loadConditions() {
    this.subscriptions.add(
      this.medicalConditionService
        .getMedicalConditions()
        .subscribe((conditions) => {
          this.availableConditions = conditions.map(
            (condition) => condition.name,
          );
        }),
    );
  }

  getRecipeName(id: string): string {
    if (!id) return "";
    const recipe = this.allRecipes.find((r) => r.uid === id);
    return recipe ? recipe.name : "Przepis niedostępny";
  }

  getRecipeById(id: string): Recipe | null {
    if (!id) return null;
    const recipe = this.allRecipes.find((r) => r.uid === id);
    return recipe || null;
  }

  toggleEditMode(planKey: string | number) {
    const planIndex =
      typeof planKey === "number"
        ? planKey
        : this.myPlans.findIndex((p) => p.id === planKey);
    if (planIndex !== -1) {
      this.originalPlans[planKey] = JSON.parse(
        JSON.stringify(this.myPlans[planIndex]),
      );
    }
    this.editModes[planKey] = true;
  }

  savePlanAndExitEditMode(plan: DietPlan, planIndex: number) {
    this.savePlan(plan);
    const planKey = plan.id || planIndex;
    delete this.originalPlans[planKey];
    this.editModes[planKey] = false;
  }

  cancelEditMode(planKey: string | number) {
    const planIndex =
      typeof planKey === "number"
        ? planKey
        : this.myPlans.findIndex((p) => p.id === planKey);
    if (planIndex !== -1 && this.originalPlans[planKey]) {
      this.myPlans[planIndex] = this.originalPlans[planKey];
    }
    delete this.originalPlans[planKey];
    this.editModes[planKey] = false;
  }

  openAddDietPlanDialog(): void {
    const dialogRef = this.dialog.open(AddDietPlanDialogComponent, {
      width: "500px",
      panelClass: "diet-plan-dialog",
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const newPlan: DietPlan = {
          ...(result as DietPlan),
          id: "",
          userId: this.currentUserId,
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

        this.myPlans.push(newPlan);
        this.savePlan(newPlan);

        setTimeout(() => {
          const planIndex = this.myPlans.length - 1;
          this.toggleEditMode(planIndex);
        }, 100);
      }
    });
  }

  addNewPlan() {
    const emptyPlan: DietPlan = {
      id: "",
      name: "Nowy jadłospis",
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
      userId: this.currentUserId,
    };

    this.myPlans.push(emptyPlan);
  }

  openRecipePicker(planIdx: number, day: string, mealIdx: number) {
    this.pickerOpen = true;
    this.pickerPlanIdx = planIdx;
    this.pickerDay = day;
    this.pickerMealIdx = mealIdx;
    this.pickerFilter = "";
    this.pickerFilterType = [this.meals[mealIdx]];
    this.pickerFilterLiked = false;
    this.pickerFilterMaxKcal = null;
    this.pickerFilterCondition = [];

    const mealName = this.meals[mealIdx];
    this.filteredRecipes = this.allRecipes.filter((recipe) => {
      if (!recipe || !recipe.mealType) return false;
      if (Array.isArray(recipe.mealType)) {
        return (
          recipe.mealType.includes(mealName) || recipe.mealType.includes("any")
        );
      } else if (typeof recipe.mealType === "string") {
        return recipe.mealType === mealName || recipe.mealType === "any";
      }
      return false;
    });
  }

  onPickerFilterChange(type: string, value: any) {
    switch (type) {
      case "name":
        this.pickerFilter = value;
        break;
      case "type":
        this.pickerFilterType = value;
        break;
      case "liked":
        this.pickerFilterLiked = value;
        break;
      case "maxKcal":
        this.pickerFilterMaxKcal = value;
        break;
      case "condition":
        this.pickerFilterCondition = value;
        break;
    }
    this.applyPickerFilters();
  }

  applyPickerFilters() {
    let results = this.allRecipes;
    if (this.pickerFilterType && this.pickerFilterType.length > 0) {
      results = results.filter((recipe) => {
        if (!recipe.mealType) return false;
        if (Array.isArray(recipe.mealType)) {
          return this.pickerFilterType.some(
            (type) =>
              recipe.mealType.includes(type) || recipe.mealType.includes("any"),
          );
        } else {
          return (
            this.pickerFilterType.includes(recipe.mealType) ||
            recipe.mealType === "any"
          );
        }
      });
    }
    if (this.pickerFilter) {
      results = results.filter((recipe) =>
        recipe.name.toLowerCase().includes(this.pickerFilter.toLowerCase()),
      );
    }
    if (this.pickerFilterLiked) {
    }
    if (this.pickerFilterMaxKcal !== null) {
      results = results.filter(
        (recipe) => recipe.calories <= this.pickerFilterMaxKcal!,
      );
    }
    if (this.pickerFilterCondition && this.pickerFilterCondition.length > 0) {
      results = results.filter((recipe) =>
        this.pickerFilterCondition.every((condition) =>
          recipe.suitableForConditions?.includes(condition),
        ),
      );
    }
    this.filteredRecipes = results;
  }

  previewRecipe(recipe: Recipe) {
    const url = this.router.createUrlTree(["/recipes", recipe.uid]);
    window.open(url.toString(), "_blank");
  }

  selectRecipe(recipe: Recipe) {
    if (!this.myPlans[this.pickerPlanIdx].mealPlan) {
      this.myPlans[this.pickerPlanIdx].mealPlan = {
        monday: ["", "", "", ""],
        tuesday: ["", "", "", ""],
        wednesday: ["", "", "", ""],
        thursday: ["", "", "", ""],
        friday: ["", "", "", ""],
        saturday: ["", "", "", ""],
        sunday: ["", "", "", ""],
      };
    }

    if (!this.myPlans[this.pickerPlanIdx].mealPlan[this.pickerDay]) {
      this.myPlans[this.pickerPlanIdx].mealPlan[this.pickerDay] = [
        "",
        "",
        "",
        "",
      ];
    }

    this.myPlans[this.pickerPlanIdx].mealPlan[this.pickerDay][
      this.pickerMealIdx
    ] = recipe.uid;
    this.closePicker();
  }

  closePicker() {
    this.pickerOpen = false;
    this.selectedConditions = [];
  }

  getDayLabel(dayKey: string): string {
    const day = this.weekDays.find((d) => d.key === dayKey);
    return day ? day.label : "";
  }

  removeMeal(planIdx: number, day: string, mealIdx: number) {
    if (this.myPlans[planIdx]?.mealPlan?.[day]) {
      this.myPlans[planIdx].mealPlan[day][mealIdx] = "";
    }
  }

  savePlan(plan: DietPlan) {
    plan.userId = this.currentUserId;

    if (plan.id) {
      this.dietPlanService.updateDietPlan(plan.id, plan).subscribe(() => {
        console.log("Plan zaktualizowany");
      });
    } else {
      const { id, ...planToSave } = plan;
      this.dietPlanService.addDietPlan(planToSave).subscribe((id) => {
        plan.id = id;
        console.log("Plan zapisany");
      });
    }
  }

  removePlan(idx: number) {
    const plan = this.myPlans[idx];
    if (plan.id) {
      this.dietPlanService.deleteDietPlan(plan.id).subscribe(() => {
        this.myPlans.splice(idx, 1);
        console.log("Plan usunięty");
      });
    } else {
      this.myPlans.splice(idx, 1);
    }
  }

  getDayCalories(plan: DietPlan, day: string): number {
    if (!plan?.mealPlan?.[day]) return 0;

    return plan.mealPlan[day].reduce((sum: number, recipeId: string) => {
      if (!recipeId) return sum;
      const recipe = this.allRecipes.find((r) => r.uid === recipeId);
      return sum + (recipe?.calories || 0);
    }, 0);
  }

  getTotalCalories(plan: DietPlan): number {
    if (!plan?.mealPlan) return 0;

    return this.weekDays.reduce(
      (sum: number, day: { key: string; label: string }) => {
        return sum + this.getDayCalories(plan, day.key);
      },
      0,
    );
  }
}
