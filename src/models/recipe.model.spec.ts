import { describe, expect, it } from "vitest";
import {
  FALLBACK_RECIPE_IMAGE,
  formatDatePL,
  RecipeModel,
  resolveRecipeImageUrl,
} from "./recipe.model";

describe("resolveRecipeImageUrl", () => {
  it("returns fallback plate when url is missing or blank", () => {
    expect(resolveRecipeImageUrl(undefined)).toBe(FALLBACK_RECIPE_IMAGE);
    expect(resolveRecipeImageUrl("")).toBe(FALLBACK_RECIPE_IMAGE);
    expect(resolveRecipeImageUrl("   ")).toBe(FALLBACK_RECIPE_IMAGE);
  });

  it("keeps external URLs and base64 data URIs untouched", () => {
    expect(resolveRecipeImageUrl("https://cdn.example.com/dish.webp")).toBe(
      "https://cdn.example.com/dish.webp",
    );
    expect(resolveRecipeImageUrl("data:image/webp;base64,abc123")).toBe(
      "data:image/webp;base64,abc123",
    );
  });

  it("normalizes asset paths and bare filenames into assets/recipes/", () => {
    expect(resolveRecipeImageUrl("szakszuka.png")).toBe("assets/recipes/szakszuka.png");
    expect(resolveRecipeImageUrl("assets/recipes/szakszuka.png")).toBe(
      "assets/recipes/szakszuka.png",
    );
    expect(resolveRecipeImageUrl("/assets/recipes/szakszuka.png")).toBe(
      "assets/recipes/szakszuka.png",
    );
    expect(resolveRecipeImageUrl("foo/bar/assets/recipes/szakszuka.png")).toBe(
      "assets/recipes/szakszuka.png",
    );
  });
});

describe("RecipeModel.toRecipe", () => {
  it("hydrates Firestore documents with safe defaults and Timestamp dates", () => {
    const mockDate = new Date("2026-02-17T10:00:00Z");
    const recipe = RecipeModel.toRecipe(
      {
        name: "Omlet z łososiem",
        calories: "435",
        protein: "32",
        servings: 0,
        mealType: "Śniadanie",
        imageUrl: "omlet-losos-szpinak.png",
        createdAt: { toDate: () => mockDate },
        updatedAt: { toDate: () => mockDate },
      },
      "rec-1",
    );

    expect(recipe.uid).toBe("rec-1");
    expect(recipe.name).toBe("Omlet z łososiem");
    expect(recipe.calories).toBe(435);
    expect(recipe.protein).toBe(32);
    expect(recipe.servings).toBe(1);
    expect(recipe.mealType).toEqual(["Śniadanie"]);
    expect(recipe.imageUrl).toBe("assets/recipes/omlet-losos-szpinak.png");
    expect(recipe.createdAt).toBe(mockDate);
    expect(recipe.ingredients).toEqual([]);
  });

  it("handles undefined document data gracefully", () => {
    const recipe = RecipeModel.toRecipe(undefined, "empty-id");
    expect(recipe.uid).toBe("empty-id");
    expect(recipe.name).toBe("");
    expect(recipe.servings).toBe(1);
    expect(recipe.imageUrl).toBe(FALLBACK_RECIPE_IMAGE);
  });
});

describe("formatDatePL", () => {
  it("formats Date in Polish locale", () => {
    const formatted = formatDatePL(new Date(2026, 1, 17));
    expect(formatted).toContain("2026");
    expect(formatted).toContain("17");
  });
});
