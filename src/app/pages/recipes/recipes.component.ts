import { Component, inject, OnInit } from "@angular/core";
import {
  MEDICAL_CONDITIONS,
  DIET_TAGS,
  MEAL_TYPES,
  Recipe,
} from "../../../models/recipe.model";
import { RecipeCardComponent } from "../../components/ui/recipe-card/recipe-card.component";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { InputTextComponent } from "../../components/ui/input-text/input-text.component";
import { InputNumberComponent } from "../../components/ui/input-number/input-number.component";
import { CheckboxGroupComponent } from "../../components/ui/checkbox-group/checkbox-group.component";
import { RecipeService } from "../../../services/recipe.service";
import { AuthService } from "../../../services/auth.service";
import { user } from "@angular/fire/auth";
import { MatIcon } from "@angular/material/icon";
import { MatSlideToggle } from "@angular/material/slide-toggle";

@Component({
  selector: "app-recipes",
  standalone: true,
  imports: [
    RecipeCardComponent,
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    InputTextComponent,
    InputNumberComponent,
    CheckboxGroupComponent,
    MatIcon,
    MatSlideToggle,
  ],
  templateUrl: "./recipes.component.html",
  styleUrls: ["./recipes.component.scss"],
})
export class RecipesComponent implements OnInit {
  private recipeService = inject(RecipeService);
  private authService = inject(AuthService);

  recipes: Recipe[] = [];
  savedRecipes: string[] = [];

  filterName = "";
  filterCondition: string[] = [];
  filterDiet: string[] = [];
  filterMaxKcal: number | null = null;
  filterType: string[] = [];
  filterLiked: boolean = false;

  conditions = MEDICAL_CONDITIONS;
  diets = DIET_TAGS;
  mealTypes = MEAL_TYPES;

  showFilters = false;
  isMobile = false;

  ngOnInit() {
    this.recipeService.getRecipes().subscribe((recipes) => {
      this.recipes = recipes;
    });

    this.authService.user$.subscribe((user) => {
      if (user) {
        this.savedRecipes = user.savedRecipes || [];
      }
    });

    this.checkMobile();
    window.addEventListener("resize", this.checkMobile.bind(this));

    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("liked") === "1") {
      this.filterLiked = true;
    }
  }

  ngOnDestroy() {
    window.removeEventListener("resize", this.checkMobile.bind(this));
  }

  checkMobile() {
    this.isMobile = window.innerWidth <= 900;
    if (!this.isMobile) {
      this.showFilters = false;
    }
  }

  get filteredRecipes(): Recipe[] {
    let filtered = this.recipes;
    if (this.filterName) {
      filtered = filtered.filter((recipe) =>
        recipe.name.toLowerCase().includes(this.filterName.toLowerCase()),
      );
    }
    if (this.filterCondition.length > 0) {
      filtered = filtered.filter((recipe) =>
        this.filterCondition.some((cond) =>
          recipe.suitableForConditions.includes(cond),
        ),
      );
    }
    if (this.filterDiet.length > 0) {
      filtered = filtered.filter((recipe) =>
        this.filterDiet.some((diet) => recipe.dietTags.includes(diet)),
      );
    }
    if (typeof this.filterMaxKcal === "number") {
      filtered = filtered.filter(
        (recipe) =>
          this.filterMaxKcal != null && recipe.calories <= this.filterMaxKcal,
      );
    }
    if (this.filterType.length > 0) {
      filtered = filtered.filter((recipe) =>
        this.filterType.some((type) => recipe.mealType.includes(type)),
      );
    }
    if (this.filterLiked) {
      filtered = filtered.filter((recipe) =>
        this.savedRecipes.includes(recipe.uid),
      );
    }
    return filtered;
  }

  onTypeChange(type: string, checked: boolean) {
    if (checked) {
      this.filterType.push(type);
    } else {
      this.filterType = this.filterType.filter((t) => t !== type);
    }
  }

  protected readonly user = user;
}
