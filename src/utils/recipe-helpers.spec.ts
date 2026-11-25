import { describe, expect, it } from "vitest";
import {
  calculateMacroPercentages,
  getPolishPortionLabel,
  matchesPolishQuery,
  normalizePolish,
  scaleIngredientText,
} from "./recipe-helpers";

describe("normalizePolish & matchesPolishQuery", () => {
  it("strips Polish diacritics including ł -> l and lowercases", () => {
    expect(normalizePolish("Łosoś z Żółtą Papryką i Ćwikłą")).toBe(
      "losos z zolta papryka i cwikla",
    );
  });

  it("matches accented and unaccented queries across multiple tokens", () => {
    const haystack = "Omlet z łososiem wędzonym, szpinakiem i jajkiem";
    expect(matchesPolishQuery(haystack, "losos szpinak")).toBe(true);
    expect(matchesPolishQuery(haystack, "omlet jajko")).toBe(true);
    expect(matchesPolishQuery(haystack, "kurczak ryz")).toBe(false);
  });

  it("supports Polish inflection stemming for 5+ char words", () => {
    expect(matchesPolishQuery("Owsianka z malinami i nasionami chia", "owsianki")).toBe(true);
    expect(matchesPolishQuery("Zupa krem z brokułów", "brokuly")).toBe(true);
  });

  it("returns true for empty or whitespace-only queries", () => {
    expect(matchesPolishQuery("Dowolny przepis", "   ")).toBe(true);
  });
});

describe("scaleIngredientText", () => {
  it("returns original string when factor is 1", () => {
    expect(scaleIngredientText("120 g łososia", 1)).toBe("120 g łososia");
  });

  it("scales integer and decimal quantities with Polish comma formatting", () => {
    expect(scaleIngredientText("100 g kaszy gryczanej", 2)).toBe("200 g kaszy gryczanej");
    expect(scaleIngredientText("1,5 łyżki oliwy z oliwek", 2)).toBe("3 łyżki oliwy z oliwek");
    expect(scaleIngredientText("150 ml kefiru", 1.5)).toBe("225 ml kefiru");
    expect(scaleIngredientText("1 łyżka miodu", 1.5)).toBe("1,5 łyżka miodu");
  });

  it("scales multiple quantities in the same ingredient line", () => {
    expect(scaleIngredientText("2 jajka (ok. 110 g)", 3)).toBe("6 jajka (ok. 330 g)");
  });
});

describe("getPolishPortionLabel", () => {
  it("handles singular, paucal (2-4), and genitive plural Polish forms", () => {
    expect(getPolishPortionLabel(1)).toBe("porcja");
    expect(getPolishPortionLabel(2)).toBe("porcje");
    expect(getPolishPortionLabel(3)).toBe("porcje");
    expect(getPolishPortionLabel(4)).toBe("porcje");
    expect(getPolishPortionLabel(5)).toBe("porcji");
    expect(getPolishPortionLabel(10)).toBe("porcji");
    expect(getPolishPortionLabel(12)).toBe("porcji");
    expect(getPolishPortionLabel(14)).toBe("porcji");
    expect(getPolishPortionLabel(22)).toBe("porcje");
  });
});

describe("calculateMacroPercentages", () => {
  it("computes calorie-weighted macro split summing to 100%", () => {
    const res = calculateMacroPercentages(25, 50, 10);
    // 100 kcal P, 200 kcal C, 90 kcal F -> total 390
    expect(res.protein + res.carbs + res.fat).toBe(100);
    expect(res.protein).toBe(26);
    expect(res.carbs).toBe(51);
    expect(res.fat).toBe(23);
  });

  it("falls back to balanced split when all macros are zero", () => {
    expect(calculateMacroPercentages(0, 0, 0)).toEqual({
      protein: 33,
      carbs: 34,
      fat: 33,
    });
  });
});
