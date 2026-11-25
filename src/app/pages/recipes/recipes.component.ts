import { CommonModule } from "@angular/common";
import { Component, inject, OnDestroy, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatIconModule } from "@angular/material/icon";
import { MatSelectModule } from "@angular/material/select";
import { ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs";
import {
  DIET_TAGS,
  MEAL_TYPES,
  MEDICAL_CONDITIONS,
  Recipe,
} from "../../../models/recipe.model";
import { AuthService } from "../../../services/auth.service";
import { RecipeService } from "../../../services/recipe.service";
import {
  PresentationHeaderComponent,
  RecipeCardComponent,
} from "../../components/ui";

type SortMode = "rating" | "kcalAsc" | "proteinDesc" | "timeAsc" | "nameAsc";

@Component({
  selector: "app-recipes",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatSelectModule,
    RecipeCardComponent,
    PresentationHeaderComponent,
  ],
  templateUrl: "./recipes.component.html",
  styleUrls: ["./recipes.component.scss"],
})
export class RecipesComponent implements OnInit, OnDestroy {
  private recipeService = inject(RecipeService);
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private sub = new Subscription();

  recipes: Recipe[] = [];
  savedRecipes: string[] = [];
  isLoggedIn = false;

  filterName = "";
  filterCondition: string[] = [];
  filterDiet: string[] = [];
  filterType: string[] = [];
  filterLiked = false;
  filterMaxKcal: number | null = null;
  filterMinProtein: number | null = null;
  filterMaxTime: number | null = null;
  filterMaxSodium: number | null = null;
  sortBy: SortMode = "rating";
  viewMode: "grid" | "list" = "grid";

  conditions = MEDICAL_CONDITIONS;
  diets = DIET_TAGS;
  mealTypes = MEAL_TYPES;

  mobileFiltersOpen = false;

  ngOnInit(): void {
    this.sub.add(
      this.recipeService.getRecipes().subscribe((recipes) => {
        this.recipes = recipes;
      }),
    );

    this.sub.add(
      this.authService.user$.subscribe((user) => {
        this.isLoggedIn = Boolean(user);
        this.savedRecipes = user?.savedRecipes ?? [];
      }),
    );

    this.sub.add(
      this.route.queryParamMap.subscribe((params) => {
        const q = params.get("q");
        if (q) this.filterName = q;

        if (params.get("liked") === "1") {
          this.filterLiked = true;
        }
        const condition = params.get("condition");
        if (condition) {
          this.filterCondition = [condition];
        }
        const diet = params.get("diet");
        if (diet) {
          this.filterDiet = [diet];
        }
        const meal = params.get("meal");
        if (meal) {
          this.filterType = [meal];
        }
      }),
    );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  get activeFiltersCount(): number {
    let count = 0;
    if (this.filterName.trim()) count++;
    if (this.filterLiked) count++;
    count += this.filterCondition.length;
    count += this.filterDiet.length;
    count += this.filterType.length;
    if (this.filterMaxKcal != null) count++;
    if (this.filterMinProtein != null) count++;
    if (this.filterMaxTime != null) count++;
    if (this.filterMaxSodium != null) count++;
    return count;
  }

  private normalizePL(text: string): string {
    return text
      .toLowerCase()
      .replace(/ł/g, "l")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  private matchesPolishQuery(haystack: string, rawQuery: string): boolean {
    const normHay = this.normalizePL(haystack);
    const tokens = this.normalizePL(rawQuery).split(/\s+/).filter(Boolean);
    return tokens.every((token) => {
      if (normHay.includes(token)) return true;
      if (token.length >= 5) {
        const stem = token.slice(0, Math.max(4, token.length - 2));
        return normHay.includes(stem);
      }
      return false;
    });
  }

  get filteredRecipes(): Recipe[] {
    const search = this.filterName.trim();

    let list = this.recipes.filter((recipe) => {
      if (search) {
        const combined = [
          recipe.name,
          recipe.description ?? "",
          ...(recipe.ingredients ?? []),
          ...(recipe.dietTags ?? []),
          ...(recipe.suitableForConditions ?? []),
        ].join(" ");
        if (!this.matchesPolishQuery(combined, search)) return false;
      }

      if (this.filterLiked && !this.savedRecipes.includes(recipe.uid)) {
        return false;
      }

      if (
        this.filterType.length > 0 &&
        !this.filterType.some((t) => recipe.mealType?.includes(t))
      ) {
        return false;
      }

      if (
        this.filterCondition.length > 0 &&
        !this.filterCondition.some((c) =>
          recipe.suitableForConditions?.includes(c),
        )
      ) {
        return false;
      }

      if (
        this.filterDiet.length > 0 &&
        !this.filterDiet.every((d) => recipe.dietTags?.includes(d))
      ) {
        return false;
      }

      if (
        this.filterMaxKcal != null &&
        recipe.calories > this.filterMaxKcal
      ) {
        return false;
      }

      if (
        this.filterMinProtein != null &&
        recipe.protein < this.filterMinProtein
      ) {
        return false;
      }

      if (
        this.filterMaxTime != null &&
        recipe.prepTimeMinutes > this.filterMaxTime
      ) {
        return false;
      }

      if (
        this.filterMaxSodium != null &&
        recipe.sodium > this.filterMaxSodium
      ) {
        return false;
      }

      return true;
    });

    list = [...list].sort((a, b) => {
      switch (this.sortBy) {
        case "kcalAsc":
          return a.calories - b.calories;
        case "proteinDesc":
          return b.protein - a.protein;
        case "timeAsc":
          return a.prepTimeMinutes - b.prepTimeMinutes;
        case "nameAsc":
          return a.name.localeCompare(b.name, "pl");
        case "rating":
        default:
          return (b.stars ?? 0) - (a.stars ?? 0);
      }
    });

    return list;
  }

  toggleItem(arr: string[], item: string): void {
    const idx = arr.indexOf(item);
    if (idx >= 0) {
      arr.splice(idx, 1);
    } else {
      arr.push(item);
    }
  }

  selectQuickMeal(meal: string | null): void {
    this.filterType = meal ? [meal] : [];
  }

  clearFilters(): void {
    this.filterName = "";
    this.filterCondition = [];
    this.filterDiet = [];
    this.filterType = [];
    this.filterLiked = false;
    this.filterMaxKcal = null;
    this.filterMinProtein = null;
    this.filterMaxTime = null;
    this.filterMaxSodium = null;
  }
}
