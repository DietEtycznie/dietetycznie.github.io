import { Component } from "@angular/core";
import { Recipe } from "../../../models/recipe.model";
import { RecipeCardComponent } from "../../components/ui/recipe-card/recipe-card.component";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { InputTextComponent } from "../../components/ui/input-text/input-text.component";
import { InputMultiComponent } from "../../components/ui/input-multi/input-multi.component";
import { InputNumberComponent } from "../../components/ui/input-number/input-number.component";

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
    InputMultiComponent,
    InputNumberComponent,
  ],
  templateUrl: "./recipes.component.html",
  styleUrls: ["./recipes.component.scss"],
})
export class RecipesComponent {
  recipes: Recipe[] = [
    {
      id: "1",
      name: "Kurczak z ryżem",
      description: "Pyszny kurczak z ryżem i warzywami.",
      ingredients: ["kurczak", "ryż", "warzywa"],
      instructions: ["Ugotuj ryż", "Usmaż kurczaka", "Dodaj warzywa"],
      prepTimeMinutes: 10,
      cookTimeMinutes: 20,
      servings: 2,
      calories: 500,
      protein: 30,
      carbs: 60,
      fat: 10,
      imageUrl: "'../../../assets/recipes/biryani.png'",
      suitableForConditions: [],
      tags: ["obiad"],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "2",
      name: "Sałatka grecka",
      description: "Lekka sałatka z warzywami i serem feta.",
      ingredients: ["sałata", "pomidor", "ogórek", "feta"],
      instructions: ["Pokrój warzywa", "Dodaj fetę", "Wymieszaj"],
      prepTimeMinutes: 10,
      cookTimeMinutes: 5,
      servings: 1,
      calories: 350,
      protein: 8,
      carbs: 25,
      fat: 20,
      imageUrl: "../../../assets/recipes/biryani.png",
      suitableForConditions: [],
      tags: ["sałatka", "wegetariańskie"],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  // Filtry
  filterName = "";
  filterCondition: string[] = [];
  filterDiet: string[] = [];
  filterMaxKcal: number | null = null;
  filterType: string[] = [];

  // Przykładowe opcje do selectów
  conditions = ["Cukrzyca", "Nadciśnienie", "Hashimoto"];
  diets = ["Wegańska", "Wegetariańska", "Bezglutenowa"];
  types = ["obiad", "kolacja", "śniadanie", "deser"];

  get filteredRecipes(): Recipe[] {
    return this.recipes.filter((recipe) => {
      const nameMatch =
        this.filterName === "" ||
        recipe.name.toLowerCase().includes(this.filterName.toLowerCase());
      const conditionMatch =
        this.filterCondition.length === 0 ||
        this.filterCondition.some((cond) =>
          recipe.suitableForConditions.includes(cond),
        );
      const dietMatch =
        this.filterDiet.length === 0 ||
        this.filterDiet.some((diet) => recipe.tags.includes(diet));
      const kcalMatch =
        this.filterMaxKcal == null || recipe.calories <= this.filterMaxKcal;
      const typeMatch =
        this.filterType.length === 0 ||
        this.filterType.some((type) => recipe.tags.includes(type));
      return nameMatch && conditionMatch && dietMatch && kcalMatch && typeMatch;
    });
  }

  onTypeChange(type: string, checked: boolean) {
    if (checked) {
      this.filterType.push(type);
    } else {
      this.filterType = this.filterType.filter((t) => t !== type);
    }
  }
}
