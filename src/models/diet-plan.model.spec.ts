import { describe, expect, it } from "vitest";
import { createEmptyMealPlan, normalizeMealPlan, WEEK_DAYS } from "./diet-plan.model";

describe("diet-plan.model helpers", () => {
  it("creates an empty 7-day meal plan with 5 slots per day", () => {
    const empty = createEmptyMealPlan();
    expect(WEEK_DAYS).toHaveLength(7);
    for (const day of WEEK_DAYS) {
      expect(empty[day.key]).toEqual(["", "", "", "", ""]);
    }
  });

  it("normalizes partial, short, and oversized meal arrays to exactly 5 slots", () => {
    const normalized = normalizeMealPlan({
      monday: ["rec-1", "rec-2"],
      tuesday: ["a", "b", "c", "d", "e", "extra"],
    });

    expect(normalized.monday).toEqual(["rec-1", "rec-2", "", "", ""]);
    expect(normalized.tuesday).toEqual(["a", "b", "c", "d", "e"]);
    expect(normalized.sunday).toEqual(["", "", "", "", ""]);
  });

  it("handles undefined mealPlan safely", () => {
    const normalized = normalizeMealPlan(undefined);
    expect(normalized.friday).toEqual(["", "", "", "", ""]);
  });
});
