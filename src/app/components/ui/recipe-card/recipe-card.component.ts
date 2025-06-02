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
import { NgClass, NgIf, NgFor } from "@angular/common";

@Component({
  selector: "app-recipe-card",
  templateUrl: "./recipe-card.component.html",
  styleUrls: ["./recipe-card.component.scss"],
  standalone: true,
  imports: [NgClass, NgIf, NgFor],
})
export class RecipeCardComponent implements AfterViewInit {
  @Input() recipe!: Recipe;
  @Input() cardStyle: "normal" | "wide" = "normal";
  @ViewChildren("starsContainer") starsContainer!: QueryList<ElementRef>;
  like = false;
  starsVisible: boolean = false;

  private cdr: ChangeDetectorRef = inject(ChangeDetectorRef);

  toggleLike(): void {
    this.like = !this.like;
  }

  ngAfterViewInit(): void {
    const starContainersArray = this.starsContainer.toArray();
    this.starsVisible = starContainersArray.length > 0;
    this.starsVisible =
      this.starsVisible &&
      starContainersArray.some(
        (container) => container.nativeElement.children.length > 0,
      );
    this.cdr.detectChanges();
  }
}
