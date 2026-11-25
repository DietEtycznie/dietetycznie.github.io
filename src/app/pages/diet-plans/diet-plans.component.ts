import { CommonModule } from "@angular/common";
import { Component, inject, OnDestroy, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { MatSelectModule } from "@angular/material/select";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { Subscription } from "rxjs";
import {
  createEmptyMealPlan,
  DayKey,
  DietPlan,
  normalizeMealPlan,
  WEEK_DAYS,
} from "../../../models/diet-plan.model";
import {
  FALLBACK_RECIPE_IMAGE,
  MEAL_TYPES,
  MEDICAL_CONDITIONS,
  Recipe,
  resolveRecipeImageUrl,
} from "../../../models/recipe.model";
import { AuthService } from "../../../services/auth.service";
import { DietPlanService } from "../../../services/diet-plan.service";
import { RecipeService } from "../../../services/recipe.service";
import {
  FilterStripComponent,
  FilterStripItem,
  LoadingStateComponent,
  PresentationHeaderComponent,
  PrintHeaderComponent,
  RecipeCardComponent,
} from "../../components/ui";
import { AddDietPlanDialogComponent } from "./add-diet-plan-dialog/add-diet-plan-dialog.component";

export interface ShoppingItem {
  name: string;
  count: number;
  checked: boolean;
}

@Component({
  selector: "app-diet-plans",
  templateUrl: "./diet-plans.component.html",
  styleUrls: ["./diet-plans.component.scss"],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    MatDialogModule,
    MatIconModule,
    MatMenuModule,
    MatSelectModule,
    RecipeCardComponent,
    PresentationHeaderComponent,
    FilterStripComponent,
    PrintHeaderComponent,
    LoadingStateComponent,
  ],
})
export class DietPlansComponent implements OnInit, OnDestroy {
  private dietPlanService = inject(DietPlanService);
  private recipeService = inject(RecipeService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private dialog = inject(MatDialog);
  private sub = new Subscription();

  readyPlans: DietPlan[] = [];
  myPlans: DietPlan[] = [];
  personalizedPlans: DietPlan[] = [];
  allRecipes: Recipe[] = [];
  savedRecipeIds: string[] = [];
  loadingReady = true;
  loadingMy = false;

  currentUserId: string | null = null;
  activeSection: "readyPlans" | "myPlans" | "personalized" = "readyPlans";
  filterCondition = "";
  toastMessage = "";

  // Per-plan view state
  selectedDayByPlan: Record<string, DayKey> = {};
  showFullWeekByPlan: Record<string, boolean> = {};
  editModes: Record<string, boolean> = {};
  private originalPlans: Record<string, DietPlan> = {};

  weekDays = WEEK_DAYS;
  meals = MEAL_TYPES;
  allConditions = MEDICAL_CONDITIONS;

  // Picker modal state
  pickerOpen = false;
  pickerPlanIdx = 0;
  pickerDay: DayKey = "monday";
  pickerMealIdx = 0;
  pickerSearch = "";
  pickerMealFilter = "";
  pickerConditionFilter = "";
  pickerMaxKcal: number | null = null;
  pickerOnlyLiked = false;

  // Shopping list modal state
  shoppingModalOpen = false;
  shoppingPlan: DietPlan | null = null;
  shoppingScope: "week" | "day" = "week";
  shoppingDay: DayKey = "monday";
  shoppingItems: ShoppingItem[] = [];
  copiedShopping = false;

  // Dedicated single-plan print state
  printingPlan: DietPlan | null = null;

  user$ = this.authService.user$;

  ngOnInit(): void {
    this.sub.add(
      this.recipeService.getRecipes().subscribe((recipes) => {
        this.allRecipes = recipes;
      }),
    );

    this.sub.add(
      this.route.queryParamMap.subscribe((params) => {
        const sec = params.get("section");
        if (sec === "myPlans") {
          this.activeSection = "myPlans";
        } else if (sec === "personalized") {
          this.activeSection = "personalized";
        } else {
          this.activeSection = "readyPlans";
        }
        const cond = params.get("condition");
        if (cond) {
          this.filterCondition = cond;
        }
      }),
    );

    this.sub.add(
      this.authService.user$.subscribe((user) => {
        this.currentUserId = user?.uid ?? null;
        this.savedRecipeIds = user?.savedRecipes ?? [];
        this.loadReadyPlans();
        this.loadMyPlans();
      }),
    );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  get conditionFilterItems(): FilterStripItem[] {
    return [
      { value: "", label: "Wszystkie" },
      ...this.allConditions.map((c) => ({ value: c, label: c })),
    ];
  }

  get filteredReadyPlans(): DietPlan[] {
    if (!this.filterCondition) return this.readyPlans;
    return this.readyPlans.filter((p) => p.suitableForConditions?.includes(this.filterCondition));
  }

  get pickerFilteredRecipes(): Recipe[] {
    const q = this.pickerSearch.trim().toLowerCase();
    return this.allRecipes.filter((r) => {
      if (q) {
        const hit =
          r.name.toLowerCase().includes(q) ||
          r.ingredients?.some((i) => i.toLowerCase().includes(q));
        if (!hit) return false;
      }
      if (this.pickerMealFilter && !r.mealType?.includes(this.pickerMealFilter)) {
        return false;
      }
      if (
        this.pickerConditionFilter &&
        !r.suitableForConditions?.includes(this.pickerConditionFilter)
      ) {
        return false;
      }
      if (this.pickerMaxKcal != null && r.calories > this.pickerMaxKcal) {
        return false;
      }
      if (this.pickerOnlyLiked && !this.savedRecipeIds.includes(r.uid)) {
        return false;
      }
      return true;
    });
  }

  loadReadyPlans(): void {
    this.loadingReady = true;
    this.dietPlanService.getPublicDietPlans().subscribe((plans) => {
      this.readyPlans = plans.map((p) => ({
        ...p,
        mealPlan: normalizeMealPlan(p.mealPlan),
      }));
      this.loadingReady = false;
    });
  }

  loadMyPlans(): void {
    if (!this.currentUserId) {
      this.myPlans = [];
      this.personalizedPlans = [];
      this.loadingMy = false;
      if (this.activeSection === "personalized") {
        this.activeSection = "readyPlans";
      }
      return;
    }
    this.loadingMy = true;
    this.dietPlanService.getUserDietPlans(this.currentUserId).subscribe((plans) => {
      const normalized = plans.map((p) => ({
        ...p,
        mealPlan: normalizeMealPlan(p.mealPlan),
      }));
      this.personalizedPlans = normalized.filter((p) => Boolean(p.isPersonalized));
      this.myPlans = normalized.filter((p) => !p.isPersonalized);
      this.loadingMy = false;
      if (this.activeSection === "personalized" && this.personalizedPlans.length === 0) {
        this.activeSection = "readyPlans";
      }
    });
  }

  getPlanKey(plan: DietPlan, index: number): string {
    return plan.id || `plan-${index}`;
  }

  getSelectedDay(planKey: string): DayKey {
    return this.selectedDayByPlan[planKey] ?? "monday";
  }

  selectDay(planKey: string, day: DayKey): void {
    this.selectedDayByPlan[planKey] = day;
  }

  toggleFullWeek(planKey: string): void {
    this.showFullWeekByPlan[planKey] = !this.showFullWeekByPlan[planKey];
  }

  printPlan(plan: DietPlan): void {
    this.printingPlan = plan;
    const clearAfterPrint = () => {
      this.printingPlan = null;
      window.removeEventListener("afterprint", clearAfterPrint);
    };
    window.addEventListener("afterprint", clearAfterPrint);
    setTimeout(() => {
      window.print();
    }, 60);
  }

  getRecipeById(id: string): Recipe | null {
    if (!id) return null;
    return this.allRecipes.find((r) => r.uid === id) ?? null;
  }

  getRecipeImage(recipe: Recipe): string {
    return resolveRecipeImageUrl(recipe.imageUrl);
  }

  handleImageError(event: Event): void {
    (event.target as HTMLImageElement).src = FALLBACK_RECIPE_IMAGE;
  }

  getDayMacros(plan: DietPlan, day: DayKey) {
    const ids = plan.mealPlan?.[day] ?? [];
    return ids.reduce(
      (acc, id) => {
        const r = this.getRecipeById(id);
        if (!r) return acc;
        acc.calories += r.calories || 0;
        acc.protein += r.protein || 0;
        acc.carbs += r.carbs || 0;
        acc.fat += r.fat || 0;
        return acc;
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0 },
    );
  }

  getWeeklyAverageMacros(plan: DietPlan) {
    let calories = 0;
    let protein = 0;
    let carbs = 0;
    let fat = 0;
    let filledDays = 0;

    for (const d of this.weekDays) {
      const m = this.getDayMacros(plan, d.key);
      if (m.calories > 0) filledDays++;
      calories += m.calories;
      protein += m.protein;
      carbs += m.carbs;
      fat += m.fat;
    }

    const div = filledDays || 1;
    return {
      totalCalories: calories,
      avgCalories: Math.round(calories / div),
      avgProtein: Math.round(protein / div),
      avgCarbs: Math.round(carbs / div),
      avgFat: Math.round(fat / div),
    };
  }

  copyReadyPlanToMyPlans(plan: DietPlan): void {
    if (!this.currentUserId) {
      this.router.navigate(["/logowanie"], {
        queryParams: { returnUrl: "/jadlospisy" },
      });
      return;
    }

    const clone: Omit<DietPlan, "id"> = {
      name: `${plan.name} (Moja kopia)`,
      description: plan.description,
      suitableForConditions: [...(plan.suitableForConditions ?? [])],
      tags: [...(plan.tags ?? [])],
      targetCalories: plan.targetCalories,
      isPersonalized: false,
      mealPlan: normalizeMealPlan(JSON.parse(JSON.stringify(plan.mealPlan))),
      userId: this.currentUserId,
    };

    this.dietPlanService.addDietPlan(clone).subscribe((newId) => {
      this.myPlans.unshift({ ...clone, id: newId });
      this.activeSection = "myPlans";
      this.showToast(
        plan.isPersonalized
          ? `Skopiowano plan indywidualny do „Moje” — możesz go teraz edytować.`
          : `Zapisano „${plan.name}” w Twoich jadłospisach!`,
      );
    });
  }

  openAddDietPlanDialog(): void {
    if (!this.currentUserId) {
      this.router.navigate(["/logowanie"], {
        queryParams: { returnUrl: "/jadlospisy?section=myPlans" },
      });
      return;
    }

    const dialogRef = this.dialog.open(AddDietPlanDialogComponent, {
      width: "520px",
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;
      const newPlan: Omit<DietPlan, "id"> = {
        name: result.name,
        description: result.description || "",
        suitableForConditions: result.suitableForConditions || [],
        mealPlan: createEmptyMealPlan(),
        userId: this.currentUserId,
      };

      this.dietPlanService.addDietPlan(newPlan).subscribe((id) => {
        const created: DietPlan = { ...newPlan, id };
        this.myPlans.unshift(created);
        this.toggleEditMode(created.id);
        this.showToast(`Utworzono plan „${created.name}” — dodaj teraz posiłki.`);
      });
    });
  }

  toggleEditMode(planKey: string): void {
    const idx = this.myPlans.findIndex((p, i) => this.getPlanKey(p, i) === planKey);
    if (idx !== -1) {
      this.originalPlans[planKey] = JSON.parse(JSON.stringify(this.myPlans[idx]));
    }
    this.editModes[planKey] = true;
  }

  savePlanAndExitEditMode(plan: DietPlan, planIndex: number): void {
    const planKey = this.getPlanKey(plan, planIndex);
    plan.userId = this.currentUserId;
    plan.mealPlan = normalizeMealPlan(plan.mealPlan);

    if (plan.id) {
      this.dietPlanService.updateDietPlan(plan.id, plan).subscribe(() => {
        this.showToast("Zapisano zmiany w jadłospisie.");
      });
    } else {
      const { id: _id, ...payload } = plan;
      this.dietPlanService.addDietPlan(payload).subscribe((id) => {
        plan.id = id;
        this.showToast("Zapisano nowy jadłospis.");
      });
    }

    delete this.originalPlans[planKey];
    this.editModes[planKey] = false;
  }

  cancelEditMode(planKey: string): void {
    const idx = this.myPlans.findIndex((p, i) => this.getPlanKey(p, i) === planKey);
    if (idx !== -1 && this.originalPlans[planKey]) {
      this.myPlans[idx] = this.originalPlans[planKey];
    }
    delete this.originalPlans[planKey];
    this.editModes[planKey] = false;
  }

  removePlan(idx: number): void {
    const plan = this.myPlans[idx];
    if (!confirm(`Czy na pewno chcesz usunąć jadłospis „${plan.name}”?`)) {
      return;
    }
    if (plan.id) {
      this.dietPlanService.deleteDietPlan(plan.id).subscribe(() => {
        this.myPlans.splice(idx, 1);
        this.showToast("Usunięto jadłospis.");
      });
    } else {
      this.myPlans.splice(idx, 1);
    }
  }

  duplicateDayToNext(planIdx: number, day: DayKey): void {
    const dayPos = this.weekDays.findIndex((d) => d.key === day);
    const nextDay = this.weekDays[(dayPos + 1) % this.weekDays.length];
    const plan = this.myPlans[planIdx];
    plan.mealPlan[nextDay.key] = [...(plan.mealPlan[day] ?? ["", "", "", "", ""])];
    this.showToast(`Skopiowano posiłki na: ${nextDay.label}.`);
  }

  openRecipePicker(planIdx: number, day: DayKey, mealIdx: number): void {
    this.pickerOpen = true;
    this.pickerPlanIdx = planIdx;
    this.pickerDay = day;
    this.pickerMealIdx = mealIdx;
    this.pickerSearch = "";
    this.pickerMealFilter = this.meals[mealIdx] || "";
    this.pickerConditionFilter = "";
    this.pickerMaxKcal = null;
    this.pickerOnlyLiked = false;
  }

  selectRecipeForSlot(recipe: Recipe): void {
    const plan = this.myPlans[this.pickerPlanIdx];
    plan.mealPlan = normalizeMealPlan(plan.mealPlan);
    plan.mealPlan[this.pickerDay][this.pickerMealIdx] = recipe.uid;
    this.pickerOpen = false;
  }

  removeMeal(planIdx: number, day: DayKey, mealIdx: number): void {
    const plan = this.myPlans[planIdx];
    if (plan?.mealPlan?.[day]) {
      plan.mealPlan[day][mealIdx] = "";
    }
  }

  previewRecipe(recipe: Recipe): void {
    const url = this.router.createUrlTree(["/przepisy", recipe.uid]);
    window.open(url.toString(), "_blank");
  }

  // Shopping List Generator
  openShoppingList(plan: DietPlan, activeDay: DayKey): void {
    this.shoppingPlan = plan;
    this.shoppingDay = activeDay;
    this.shoppingScope = "week";
    this.copiedShopping = false;
    this.rebuildShoppingList();
    this.shoppingModalOpen = true;
  }

  rebuildShoppingList(): void {
    if (!this.shoppingPlan) return;
    const days =
      this.shoppingScope === "week" ? this.weekDays.map((d) => d.key) : [this.shoppingDay];

    const counts = new Map<string, { label: string; count: number }>();

    for (const dayKey of days) {
      const ids = this.shoppingPlan.mealPlan?.[dayKey] ?? [];
      for (const id of ids) {
        const recipe = this.getRecipeById(id);
        if (!recipe) continue;
        for (const ing of recipe.ingredients ?? []) {
          const clean = ing.trim();
          const key = clean.toLowerCase();
          const existing = counts.get(key);
          if (existing) {
            existing.count += 1;
          } else {
            counts.set(key, { label: clean, count: 1 });
          }
        }
      }
    }

    this.shoppingItems = Array.from(counts.values())
      .sort((a, b) => a.label.localeCompare(b.label, "pl"))
      .map((item) => ({
        name: item.label,
        count: item.count,
        checked: false,
      }));
  }

  copyShoppingListToClipboard(): void {
    const lines = this.shoppingItems.map((i) =>
      i.count > 1 ? `- ${i.name} (×${i.count})` : `- ${i.name}`,
    );
    const header = `Lista zakupów — ${this.shoppingPlan?.name ?? "DietEtycznie"}\n`;
    navigator.clipboard?.writeText(header + lines.join("\n"));
    this.copiedShopping = true;
    setTimeout(() => (this.copiedShopping = false), 2500);
  }

  getDayLabel(dayKey: DayKey): string {
    return this.weekDays.find((d) => d.key === dayKey)?.label ?? "";
  }

  private showToast(msg: string): void {
    this.toastMessage = msg;
    setTimeout(() => {
      if (this.toastMessage === msg) {
        this.toastMessage = "";
      }
    }, 4000);
  }
}
