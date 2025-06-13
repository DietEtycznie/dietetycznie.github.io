import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import {
  Recipe,
  MEDICAL_CONDITIONS,
  DIET_TAGS,
  MEAL_TYPES,
} from "../../../models/recipe.model";
import { RecipeService } from "../../../services/recipe.service";

@Component({
  selector: "app-admin",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCheckboxModule,
  ],
  templateUrl: "./admin.component.html",
  styleUrls: ["./admin.component.scss"],
})
export class AdminComponent {
  recipe: Partial<Recipe> = {
    name: "",
    description: "",
    mealType: [],
    ingredients: [],
    instructions: [],
    prepTimeMinutes: 0,
    servings: 0,
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    sodium: 0,
    fiber: 0,
    imageUrl: "",
    suitableForConditions: [],
    dietTags: [],
  };

  allConditions = MEDICAL_CONDITIONS;
  allDietTags = DIET_TAGS;
  allMealTypes = MEAL_TYPES;

  private recipeService = inject(RecipeService);

  async addRecipe() {
    const recipeToAdd = {
      ...this.recipe,
      ingredients:
        typeof this.recipe.ingredients === "string"
          ? (this.recipe.ingredients as string).split(",").map((i) => i.trim())
          : (this.recipe.ingredients ?? []),
      instructions:
        typeof this.recipe.instructions === "string"
          ? (this.recipe.instructions as string).split(",").map((i) => i.trim())
          : (this.recipe.instructions ?? []),
    };
    await this.recipeService
      .addRecipe(recipeToAdd as Omit<Recipe, "uid" | "createdAt" | "updatedAt">)
      .toPromise();
    alert("Przepis dodany!");
    this.recipe = {
      name: "",
      description: "",
      mealType: [],
      ingredients: [],
      instructions: [],
      prepTimeMinutes: 0,
      servings: 0,
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      sodium: 0,
      fiber: 0,
      imageUrl: "",
      suitableForConditions: [],
      dietTags: [],
    };
  }

  async fillAndAddMultipleRecipes() {
    const payload = `[{}]`;
    try {
      const recipes: any[] = JSON.parse(payload);

      for (const parsed of recipes) {
        this.recipe = {
          name: parsed.name ?? "",
          description: parsed.description ?? "",
          mealType: parsed.mealType ?? [],
          ingredients:
            parsed.ingredients?.split(",").map((i: string) => i.trim()) ?? [],
          instructions:
            parsed.instructions?.split(",").map((i: string) => i.trim()) ?? [],
          prepTimeMinutes: parsed.prepTimeMinutes ?? 0,
          servings: parsed.servings ?? 0,
          calories: parsed.calories ?? 0,
          protein: parsed.protein ?? 0,
          carbs: parsed.carbs ?? 0,
          fat: parsed.fat ?? 0,
          imageUrl: parsed.imageUrl ?? "",
          suitableForConditions: parsed.suitableForConditions ?? [],
          dietTags: parsed.dietTags ?? [],
        };

        await this.addRecipe();
      }

      alert("Wszystkie przepisy zostały dodane!");
    } catch (error) {
      alert("Błąd podczas wczytywania listy przepisów.");
      console.error(error);
    }
  }
}
