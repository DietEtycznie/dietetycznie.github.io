import { CommonModule } from "@angular/common";
import { Component, inject, Input, OnDestroy, OnInit } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";
import {
  FALLBACK_RECIPE_IMAGE,
  Recipe,
  resolveRecipeImageUrl,
} from "../../../../models/recipe.model";
import { AuthService } from "../../../../services/auth.service";
import { UserService } from "../../../../services/user.service";

@Component({
  selector: "app-recipe-card",
  templateUrl: "./recipe-card.component.html",
  styleUrls: ["./recipe-card.component.scss"],
  standalone: true,
  imports: [CommonModule, MatIconModule],
})
export class RecipeCardComponent implements OnInit, OnDestroy {
  @Input({ required: true }) recipe!: Recipe;
  @Input() cardStyle: "normal" | "wide" | "compact" = "normal";
  @Input() withOpen = true;
  @Input() withLike = true;

  like = false;
  private currentUserId: string | null = null;
  private sub = new Subscription();

  private router = inject(Router);
  private authService = inject(AuthService);
  private userService = inject(UserService);

  user$ = this.authService.user$;

  ngOnInit(): void {
    this.sub.add(
      this.authService.user$.subscribe((user) => {
        this.currentUserId = user?.uid ?? null;
        this.like = Boolean(
          user?.savedRecipes?.includes(this.recipe?.uid ?? ""),
        );
      }),
    );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  get resolvedImageUrl(): string {
    return resolveRecipeImageUrl(this.recipe?.imageUrl);
  }

  toggleLike(event: Event): void {
    event.stopPropagation();
    event.preventDefault();
    if (!this.currentUserId || !this.recipe?.uid) return;

    this.like = !this.like;
    if (this.like) {
      this.userService
        .addSavedRecipe(this.currentUserId, this.recipe.uid)
        .subscribe();
    } else {
      this.userService
        .removeSavedRecipe(this.currentUserId, this.recipe.uid)
        .subscribe();
    }
  }

  open(): void {
    if (!this.withOpen || !this.recipe?.uid) return;
    this.router.navigate(["/przepisy", this.recipe.uid]);
  }

  handleImageError(event: Event): void {
    (event.target as HTMLImageElement).src = FALLBACK_RECIPE_IMAGE;
  }
}
