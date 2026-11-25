import { CommonModule } from "@angular/common";
import { Component, inject, OnDestroy, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatIconModule } from "@angular/material/icon";
import { MatSelectModule } from "@angular/material/select";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { combineLatest, Subscription, switchMap } from "rxjs";
import { DietPlan, WEEK_DAYS } from "../../../models/diet-plan.model";
import {
  FALLBACK_RECIPE_IMAGE,
  formatDatePL,
  MEAL_TYPES,
  Recipe,
  resolveRecipeImageUrl,
} from "../../../models/recipe.model";
import { AuthService } from "../../../services/auth.service";
import { DietPlanService } from "../../../services/diet-plan.service";
import { RecipeService } from "../../../services/recipe.service";
import { UserService } from "../../../services/user.service";
import {
  LoadingStateComponent,
  PrintHeaderComponent,
  RecipeCardComponent,
} from "../../components/ui";

@Component({
  selector: "app-recipe-details",
  templateUrl: "./recipe-details.component.html",
  styleUrls: ["./recipe-details.component.scss"],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    MatIconModule,
    MatSelectModule,
    RecipeCardComponent,
    PrintHeaderComponent,
    LoadingStateComponent,
  ],
})
export class RecipeDetailsComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private recipeService = inject(RecipeService);
  private userService = inject(UserService);
  private authService = inject(AuthService);
  private dietPlanService = inject(DietPlanService);

  private sub = new Subscription();

  recipe: Recipe | null = null;
  similarRecipes: Recipe[] = [];
  loading = true;
  notFound = false;
  like = false;
  currentUserId: string | null = null;

  servings = 1;
  checkedIngredients = new Set<number>();
  checkedSteps = new Set<number>();

  // Add to plan drawer state
  addPlanOpen = false;
  userPlans: DietPlan[] = [];
  selectedPlanId = "";
  selectedDay = "monday";
  selectedMealIndex = 0;
  addedToPlanMessage = "";

  weekDays = WEEK_DAYS;
  mealTypes = MEAL_TYPES;
  user$ = this.authService.user$;

  ngOnInit(): void {
    this.sub.add(
      combineLatest([
        this.route.paramMap.pipe(
          switchMap((params) => {
            this.loading = true;
            return this.recipeService.getRecipeById(params.get("uid") || "");
          }),
        ),
        this.authService.user$,
      ]).subscribe(([recipe, user]) => {
        this.recipe = recipe;
        this.loading = false;
        this.notFound = !recipe;
        this.currentUserId = user?.uid ?? null;

        if (recipe) {
          this.servings = recipe.servings || 1;
          this.checkedIngredients.clear();
          this.checkedSteps.clear();
          this.like = Boolean(user?.savedRecipes?.includes(recipe.uid));
          this.loadSimilarRecipes(recipe);
          const defaultMealIdx = this.mealTypes.findIndex((m) => recipe.mealType?.includes(m));
          this.selectedMealIndex = defaultMealIdx >= 0 ? defaultMealIdx : 0;
        }

        if (user?.uid) {
          this.dietPlanService.getUserDietPlans(user.uid).subscribe((plans) => {
            this.userPlans = plans;
            if (plans.length && !this.selectedPlanId) {
              this.selectedPlanId = plans[0].id;
            }
          });
        }
      }),
    );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  get resolvedImageUrl(): string {
    return resolveRecipeImageUrl(this.recipe?.imageUrl);
  }

  get scaleFactor(): number {
    const base = this.recipe?.servings || 1;
    return this.servings / base;
  }

  scaledValue(val: number | undefined): number {
    return Math.round((val ?? 0) * this.scaleFactor);
  }

  scaleIngredient(text: string): string {
    const factor = this.scaleFactor;
    if (Math.abs(factor - 1) < 0.001) return text;
    return text.replace(
      /(^|\s)(\d+(?:[.,]\d+)?)(?=\s?(?:g|kg|ml|l|szt|łyż|szkl|krom|plastr|ząb|szczypt|\b))/gi,
      (_match, prefix: string, numStr: string) => {
        const parsed = parseFloat(numStr.replace(",", "."));
        if (Number.isNaN(parsed)) return `${prefix}${numStr}`;
        const scaled = Math.round(parsed * factor * 10) / 10;
        const formatted = Number.isInteger(scaled)
          ? String(scaled)
          : String(scaled).replace(".", ",");
        return `${prefix}${formatted}`;
      },
    );
  }

  get macroPercentages(): { protein: number; carbs: number; fat: number } {
    if (!this.recipe) return { protein: 33, carbs: 34, fat: 33 };
    const pCal = this.recipe.protein * 4;
    const cCal = this.recipe.carbs * 4;
    const fCal = this.recipe.fat * 9;
    const total = pCal + cCal + fCal || 1;
    const protein = Math.round((pCal / total) * 100);
    const carbs = Math.round((cCal / total) * 100);
    const fat = Math.max(0, 100 - protein - carbs);
    return { protein, carbs, fat };
  }

  changeServings(delta: number): void {
    this.servings = Math.max(1, Math.min(10, this.servings + delta));
  }

  toggleIngredient(idx: number): void {
    if (this.checkedIngredients.has(idx)) {
      this.checkedIngredients.delete(idx);
    } else {
      this.checkedIngredients.add(idx);
    }
  }

  toggleStep(idx: number): void {
    if (this.checkedSteps.has(idx)) {
      this.checkedSteps.delete(idx);
    } else {
      this.checkedSteps.add(idx);
    }
  }

  toggleLike(): void {
    if (!this.currentUserId || !this.recipe) return;
    this.like = !this.like;
    if (this.like) {
      this.userService.addSavedRecipe(this.currentUserId, this.recipe.uid).subscribe();
    } else {
      this.userService.removeSavedRecipe(this.currentUserId, this.recipe.uid).subscribe();
    }
  }

  openAddToPlan(): void {
    if (!this.currentUserId) {
      this.router.navigate(["/logowanie"], {
        queryParams: { returnUrl: `/przepisy/${this.recipe?.uid}` },
      });
      return;
    }
    this.addedToPlanMessage = "";
    this.addPlanOpen = !this.addPlanOpen;
  }

  confirmAddToPlan(): void {
    if (!this.recipe || !this.selectedPlanId) return;
    const targetPlan = this.userPlans.find((p) => p.id === this.selectedPlanId);
    if (!targetPlan) return;

    const updatedMealPlan = {
      ...targetPlan.mealPlan,
      [this.selectedDay]: [...(targetPlan.mealPlan[this.selectedDay] ?? ["", "", "", "", ""])],
    };
    updatedMealPlan[this.selectedDay][this.selectedMealIndex] = this.recipe.uid;

    this.dietPlanService
      .updateDietPlan(targetPlan.id, { mealPlan: updatedMealPlan })
      .subscribe(() => {
        const dayLabel = this.weekDays.find((d) => d.key === this.selectedDay)?.label ?? "";
        this.addedToPlanMessage = `Dodano do planu „${targetPlan.name}” (${dayLabel} — ${this.mealTypes[this.selectedMealIndex]})!`;
      });
  }

  printRecipe(): void {
    window.print();
  }

  formatDate(date?: Date): string {
    return date ? formatDatePL(date) : "";
  }

  getPortionText(count: number): string {
    if (count >= 11 && count <= 19) return "porcji";
    const last = count % 10;
    if (last === 1) return "porcja";
    if (last >= 2 && last <= 4) return "porcje";
    return "porcji";
  }

  getPortionGenitive(): string {
    return "porcji";
  }

  handleImageError(event: Event): void {
    (event.target as HTMLImageElement).src = FALLBACK_RECIPE_IMAGE;
  }

  private loadSimilarRecipes(current: Recipe): void {
    this.recipeService.getRecipes().subscribe((all) => {
      this.similarRecipes = all
        .filter((r) => r.uid !== current.uid)
        .map((r) => {
          let score = 0;
          if (r.mealType?.some((m) => current.mealType?.includes(m))) score += 2;
          if (r.suitableForConditions?.some((c) => current.suitableForConditions?.includes(c))) {
            score += 2;
          }
          return { r, score };
        })
        .sort((a, b) => b.score - a.score)
        .slice(0, 3)
        .map((x) => x.r);
    });
  }
}
