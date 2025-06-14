import { Component, inject, OnInit } from "@angular/core";
import { CommonModule, NgOptimizedImage } from "@angular/common";
import { RouterLink } from "@angular/router";
import { RecipeService } from "../../../services/recipe.service";
import { MedicalConditionService } from "../../../services/medical-condition.service";
import { Recipe } from "../../../models/recipe.model";
import { MedicalCondition } from "../../../models/medical-condition.model";
import { HeaderComponent } from "../../components/ui/header/header.component";
import { FooterComponent } from "../../components/ui/footer/footer.component";
import { AuthService } from "../../../services/auth.service";

@Component({
  selector: "app-home",
  standalone: true,
  imports: [CommonModule, RouterLink, NgOptimizedImage],
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit {
  featuredRecipes: Recipe[] = [];
  medicalConditions: MedicalCondition[] = [];

  private recipeService = inject(RecipeService);
  private medicalConditionService = inject(MedicalConditionService);
  private authService = inject(AuthService);
  user$ = this.authService.user$;

  ngOnInit(): void {
    this.loadFeaturedRecipes();
    this.loadMedicalConditions();
  }

  loadFeaturedRecipes(): void {
    this.recipeService.getRecentRecipes(3).subscribe({
      next: (recipes) => {
        this.featuredRecipes = recipes;
      },
      error: (error) => {
        console.error("Error loading recipes:", error);
      },
    });
  }

  loadMedicalConditions(): void {
    this.medicalConditionService.getMedicalConditions().subscribe({
      next: (conditions) => {
        this.medicalConditions = conditions.slice(0, 4);
      },
      error: (error) => {
        console.error("Error loading medical conditions:", error);
      },
    });
  }

  getRecipeImageUrl(recipe: Recipe): string {
    if (!recipe.imageUrl) {
      return "../../../assets/recipes/fallback-plate.png";
    }
    return recipe.imageUrl;
  }

  handleImageError(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = "../../../assets/recipes/fallback-plate.png";
  }
}
