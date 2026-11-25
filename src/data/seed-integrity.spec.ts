import { describe, expect, it } from "vitest";
import { WEEK_DAYS } from "../models/diet-plan.model";
import { MEDICAL_CONDITIONS, RECIPE_IMAGE_ASSETS } from "../models/recipe.model";
import { SEED_MEDICAL_CONDITIONS } from "./seed-conditions";
import { SEED_DIET_PLANS } from "./seed-diet-plans";
import { SEED_RECIPES } from "./seed-recipes";

describe("Seed dataset integrity", () => {
  it("contains unique, valid recipes with positive macros and known assets", () => {
    const uids = new Set<string>();
    const assetSet = new Set(RECIPE_IMAGE_ASSETS);

    expect(SEED_RECIPES.length).toBeGreaterThanOrEqual(30);

    for (const recipe of SEED_RECIPES) {
      expect(recipe.uid).toBeTruthy();
      expect(uids.has(recipe.uid)).toBe(false);
      uids.add(recipe.uid);

      expect(recipe.name.trim().length).toBeGreaterThan(2);
      expect(recipe.calories).toBeGreaterThan(0);
      expect(recipe.servings).toBeGreaterThan(0);
      expect(recipe.ingredients.length).toBeGreaterThan(0);
      expect(recipe.instructions.length).toBeGreaterThan(0);
      expect(recipe.mealType.length).toBeGreaterThan(0);

      if (recipe.imageUrl && !recipe.imageUrl.startsWith("http")) {
        const filename = recipe.imageUrl.split("/").pop() ?? "";
        expect(assetSet.has(filename)).toBe(true);
      }
    }
  });

  it("contains unique medical conditions matching the domain catalog", () => {
    const ids = new Set<string>();
    const names = new Set(SEED_MEDICAL_CONDITIONS.map((c) => c.name));

    for (const cond of SEED_MEDICAL_CONDITIONS) {
      expect(cond.id).toBeTruthy();
      expect(ids.has(cond.id)).toBe(false);
      ids.add(cond.id);
      expect(cond.foodsToEat.length).toBeGreaterThan(0);
      expect(cond.foodsToAvoid.length).toBeGreaterThan(0);
    }

    for (const expected of MEDICAL_CONDITIONS) {
      expect(names.has(expected)).toBe(true);
    }
  });

  it("references only existing seed recipe IDs in every 7-day seed diet plan", () => {
    const recipeIds = new Set(SEED_RECIPES.map((r) => r.uid));

    expect(SEED_DIET_PLANS.length).toBeGreaterThanOrEqual(5);

    for (const plan of SEED_DIET_PLANS) {
      expect(plan.id).toBeTruthy();
      expect(plan.userId).toBeNull();
      for (const day of WEEK_DAYS) {
        const slots = plan.mealPlan[day.key];
        expect(slots).toHaveLength(5);
        for (const slotId of slots) {
          if (slotId) {
            expect(recipeIds.has(slotId)).toBe(true);
          }
        }
      }
    }
  });
});
