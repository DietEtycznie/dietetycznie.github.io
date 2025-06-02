import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { Recipe } from "../../../models/recipe.model";
import { Firestore, collection, addDoc } from "@angular/fire/firestore";

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
    suitableForConditions: [],
    tags: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  allConditions = ["Cukrzyca", "Nadciśnienie", "Hashimoto"];
  allTags = [
    "obiad",
    "kolacja",
    "śniadanie",
    "deser",
    "Wegańska",
    "Wegetariańska",
    "Bezglutenowa",
  ];

  private firestore = inject(Firestore);

  async addRecipe() {
    const recipeToAdd = {
      ...this.recipe,
      createdAt: new Date(),
      updatedAt: new Date(),
      ingredients:
        typeof this.recipe.ingredients === "string"
          ? (this.recipe.ingredients as string).split(",").map((i) => i.trim())
          : this.recipe.ingredients,
      instructions:
        typeof this.recipe.instructions === "string"
          ? (this.recipe.instructions as string).split(",").map((i) => i.trim())
          : this.recipe.instructions,
    };
    await addDoc(collection(this.firestore, "recipes"), recipeToAdd);
    alert("Przepis dodany!");
    this.recipe = {
      suitableForConditions: [],
      tags: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }
}
