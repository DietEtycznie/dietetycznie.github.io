import {
  Component,
  Input,
  AfterViewInit,
  ViewChildren,
  QueryList,
  ElementRef,
  ChangeDetectorRef,
  inject,
} from "@angular/core";
import { Recipe } from "../../../../models/recipe.model";
import { NgClass, NgIf, NgFor, AsyncPipe } from "@angular/common";
import { Router } from "@angular/router";
import { MatIcon } from "@angular/material/icon";
import { UserService } from "../../../../services/user.service";
import { take } from "rxjs/operators";

@Component({
  selector: "app-recipe-card",
  templateUrl: "./recipe-card.component.html",
  styleUrls: ["./recipe-card.component.scss"],
  standalone: true,
  imports: [NgClass, NgIf, NgFor, MatIcon, AsyncPipe],
})
export class RecipeCardComponent implements AfterViewInit {
  @Input() recipe!: Recipe;
  @Input() cardStyle: "normal" | "wide" = "normal";
  @Input() withOpen = true;
  @Input() withLike = true;
  @ViewChildren("starsContainer") starsContainer!: QueryList<ElementRef>;
  like = false;
  starsVisible: boolean = false;

  private cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
  private router: Router = inject(Router);
  private userService = inject(UserService);

  user$ = this.userService.currentUser$.pipe(take(1));

  toggleLike(): void {
    this.like = !this.like;
    this.user$.pipe(take(1)).subscribe((user) => {
      if (!user) return;
      if (this.like) {
        this.userService.addSavedRecipe(user.uid, this.recipe.uid).subscribe();
      } else {
        this.userService
          .removeSavedRecipe(user.uid, this.recipe.uid)
          .subscribe();
      }
    });
  }

  open(): void {
    if (!this.withOpen) return;
    if (this.recipe && this.recipe.uid) {
      this.router.navigate(["/recipes", this.recipe.uid]);
    }
  }

  handleImageError(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = "../../../assets/recipes/fallback-plate.png";
  }

  ngAfterViewInit(): void {
    const starContainersArray = this.starsContainer.toArray();
    this.starsVisible = starContainersArray.length > 0;
    this.starsVisible =
      this.starsVisible &&
      starContainersArray.some(
        (container) => container.nativeElement.children.length > 0,
      );
    this.user$.pipe(take(1)).subscribe((user) => {
      this.like = !!user?.savedRecipes?.includes(this.recipe.uid);
      this.cdr.detectChanges();
    });
  }
}
