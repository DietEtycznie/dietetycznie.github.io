/**
 * Normalizes Polish text for accent-insensitive search (including `ł` -> `l`).
 */
export function normalizePolish(text: string): string {
  return text
    .toLowerCase()
    .replace(/ł/g, "l")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

/**
 * Multi-token Polish search matcher with lightweight inflection stemming
 * (e.g. "łosoś" matches "łososiem", "owsianka" matches "owsianki").
 */
export function matchesPolishQuery(haystack: string, rawQuery: string): boolean {
  const normHay = normalizePolish(haystack);
  const tokens = normalizePolish(rawQuery).split(/\s+/).filter(Boolean);
  return tokens.every((token) => {
    if (normHay.includes(token)) return true;
    if (token.length >= 5) {
      const stem = token.slice(0, Math.max(4, token.length - 2));
      return normHay.includes(stem);
    }
    return false;
  });
}

/**
 * Scales numeric ingredient amounts (e.g. "120 g łososia", "1,5 łyżki oliwy")
 * by the selected portion factor, formatting decimals with a Polish comma.
 */
export function scaleIngredientText(text: string, factor: number): string {
  if (Math.abs(factor - 1) < 0.001) return text;
  return text.replace(
    /(^|\s)(\d+(?:[.,]\d+)?)(?=\s?(?:g|kg|ml|l|szt|łyż|szkl|krom|plastr|ząb|szczypt|\b))/gi,
    (_match, prefix: string, numStr: string) => {
      const parsed = parseFloat(numStr.replace(",", "."));
      if (Number.isNaN(parsed)) return `${prefix}${numStr}`;
      const scaled = Math.round(parsed * factor * 10) / 10;
      const formatted = Number.isInteger(scaled)
        ? String(scaled)
        : String(scaled).replace(".", ",");
      return `${prefix}${formatted}`;
    },
  );
}

/**
 * Returns the grammatically correct Polish noun form for a portion count.
 */
export function getPolishPortionLabel(count: number): string {
  const mod100 = Math.abs(count) % 100;
  if (mod100 >= 11 && mod100 <= 19) return "porcji";
  const last = Math.abs(count) % 10;
  if (last === 1) return "porcja";
  if (last >= 2 && last <= 4) return "porcje";
  return "porcji";
}

/**
 * Calculates calorie-weighted macronutrient percentages summing cleanly to 100%.
 */
export function calculateMacroPercentages(
  protein: number,
  carbs: number,
  fat: number,
): { protein: number; carbs: number; fat: number } {
  const pCal = Math.max(0, protein) * 4;
  const cCal = Math.max(0, carbs) * 4;
  const fCal = Math.max(0, fat) * 9;
  const total = pCal + cCal + fCal;
  if (total <= 0) {
    return { protein: 33, carbs: 34, fat: 33 };
  }
  const proteinPct = Math.round((pCal / total) * 100);
  const carbsPct = Math.round((cCal / total) * 100);
  const fatPct = Math.max(0, 100 - proteinPct - carbsPct);
  return { protein: proteinPct, carbs: carbsPct, fat: fatPct };
}
