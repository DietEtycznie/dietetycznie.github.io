import { Component, Input, Output, EventEmitter } from "@angular/core";
import { Recipe } from "../../../../models/recipe.model";
import { NgClass, NgIf, NgFor, SlicePipe } from "@angular/common";
import { MatTooltip } from "@angular/material/tooltip";
import { MatIcon } from "@angular/material/icon";
import { PillsComponent } from "../pills/pills.component";

@Component({
  selector: "app-recipe-list-element",
  templateUrl: "./recipe-list-element.component.html",
  styleUrls: ["./recipe-list-element.component.scss"],
  standalone: true,
  imports: [
    NgClass,
    NgIf,
    NgFor,
    MatTooltip,
    MatIcon,
    PillsComponent,
    SlicePipe,
  ],
})
export class RecipeListElementComponent {
  @Input() recipe!: Recipe;

  @Output() preview = new EventEmitter<void>();
  @Output() select = new EventEmitter<void>();

  handleImageError(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = "../../../assets/recipes/fallback-plate.png";
  }

  onPreview(): void {
    this.preview.emit();
  }

  onSelect(): void {
    this.select.emit();
  }
}
