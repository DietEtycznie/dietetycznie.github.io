import { Component, OnInit, inject } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { RecipeService } from "../../../services/recipe.service";
import { Recipe } from "../../../models/recipe.model";
import { CommonModule } from "@angular/common";
import { PillsComponent } from "../../components/ui/pills/pills.component";
import { MatIcon } from "@angular/material/icon";
import { take } from "rxjs/operators";
import { UserService } from "../../../services/user.service";

@Component({
  selector: "app-recipe-details",
  templateUrl: "./recipe-details.component.html",
  styleUrls: ["./recipe-details.component.scss"],
  standalone: true,
  imports: [CommonModule, PillsComponent, MatIcon],
})
export class RecipeDetailsComponent implements OnInit {
  recipe: Recipe | null = null;
  like = false;
  tags: string[] = [];

  private route = inject(ActivatedRoute);
  private recipeService = inject(RecipeService);
  private userService = inject(UserService);

  user$ = this.userService.currentUser$.pipe();

  ngOnInit(): void {
    const uid = this.route.snapshot.paramMap.get("uid");
    if (uid) {
      this.recipeService.getRecipeById(uid).subscribe((recipe) => {
        this.tags = [
          ...(recipe.mealType || []),
          ...(recipe.suitableForConditions || []),
          ...(recipe.dietTags || []),
        ];
        this.recipe = recipe;
      });
    }
    this.user$.pipe(take(1)).subscribe((user) => {
      if (user && this.recipe?.uid) {
        this.like = !!user.savedRecipes?.includes(this.recipe.uid);
      }
    });
  }

  handleImageError(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = "../../../assets/recipes/fallback-plate.png";
  }

  toggleLike(): void {
    this.like = !this.like;

    this.user$.pipe(take(1)).subscribe((user) => {
      if (!user) return;
      if (!this.recipe || !this.recipe.uid) return;
      if (this.like) {
        this.userService.addSavedRecipe(user.uid, this.recipe.uid).subscribe();
      } else {
        this.userService
          .removeSavedRecipe(user.uid, this.recipe.uid)
          .subscribe();
      }
    });
  }

  getPortionText(count: number | undefined): string {
    if (!count) return "porcji";

    if (count >= 11 && count <= 19) {
      return "porcji";
    }
    const lastDigit = count % 10;

    if (lastDigit === 1) {
      return "porcja";
    } else if (lastDigit >= 2 && lastDigit <= 4) {
      return "porcje";
    } else {
      return "porcji";
    }
  }
}
