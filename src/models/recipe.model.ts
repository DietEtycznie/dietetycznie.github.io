export interface Recipe {
  uid: string;
  name: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  prepTimeMinutes: number;
  servings: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  sodium: number;
  fiber: number;
  imageUrl?: string;
  suitableForConditions: string[];
  dietTags: string[];
  mealType: string[];
  createdAt: Date;
  updatedAt: Date;
  stars?: number;
}

export const MEDICAL_CONDITIONS = [
  "Cukrzyca typu II",
  "Nadciśnienie tętnicze",
  "Celiakia",
  "Choroba wrzodowa",
  "Hashimoto",
  "Insulinooporność",
  "Refluks (GERD)",
  "Hipercholesterolemia",
];

export const DIET_TAGS = [
  "Wegańska",
  "Wegetariańska",
  "Bezglutenowa",
  "Bezlaktozowa",
  "Niski IG",
  "Wysokobiałkowa",
  "DASH",
];

export const MEAL_TYPES = ["Śniadanie", "Obiad", "Podwieczorek", "Kolacja", "Przekąska"];

export const RECIPE_IMAGE_ASSETS = [
  "gnocchi-kurczak-szpinak.png",
  "jajecznica-pomidory.png",
  "jajko-na-twardo-z-ogorkiem.png",
  "jogurt-chia-maliny.png",
  "jogurt-kokos-maliny.png",
  "kanapka-fasola.png",
  "kanapki-hummus-ogorek.png",
  "kanapki-pasta-jajeczna.png",
  "kasza-feta-burak.png",
  "kasza-gryczana-pieczarki.png",
  "kasza-z-cieciorka-i-warzywami.png",
  "koktajl-antyoksydanty.png",
  "koktajl-truskawkowy.png",
  "kurczak-grecki-ryz.png",
  "makaron-kurczak-warzywa.png",
  "makaron-pesto-pomidorki.png",
  "makaron-ryzowy-z-indykiem.png",
  "nachosy-tortilla.png",
  "omlet-losos-szpinak.png",
  "omlet-warzywa-ser.png",
  "orzechy-czekolada.png",
  "owsianka-nektarynka.png",
  "owsianka-truskawki.png",
  "owsianka-z-jablkiem-i-cynamonem.png",
  "salatka-feta-oliwki.png",
  "salatka-kasza-awokado.png",
  "salatka-tunczyk.png",
  "salatka-z-rukola-i-winogronem.png",
  "serek-pomarancza.png",
  "serek-wiejski-z-pomidorem.png",
  "szakszuka.png",
  "tarta-cukinia-ser.png",
  "tortilla-szynka-warzywa.png",
  "tosty-jajko-guacamole.png",
  "tosty-z-serem-i-szynka.png",
  "twarozek-papryka-slonecznik.png",
  "wafle-banan-maslo.png",
  "wafle-z-hummusem-i-rzodkiewka.png",
  "zupa-krem-z-brokulow.png",
];

export const FALLBACK_RECIPE_IMAGE = "assets/recipes/fallback-plate.png";

export function resolveRecipeImageUrl(imageUrl?: string): string {
  if (!imageUrl || !imageUrl.trim()) {
    return FALLBACK_RECIPE_IMAGE;
  }
  const trimmed = imageUrl.trim();
  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("data:")
  ) {
    return trimmed;
  }
  if (trimmed.startsWith("assets/")) {
    return trimmed;
  }
  if (trimmed.startsWith("/assets/")) {
    return trimmed.slice(1);
  }
  if (trimmed.includes("assets/recipes/")) {
    return "assets/recipes/" + trimmed.split("assets/recipes/").pop();
  }
  return `assets/recipes/${trimmed}`;
}

export const formatDatePL = (date: Date): string => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return date.toLocaleDateString("pl-PL", options);
};

export class RecipeModel {
  static toRecipe(data: Record<string, any> | undefined, id: string): Recipe {
    const safe = data ?? {};
    const createdDate =
      safe["createdAt"]?.toDate?.() ??
      (safe["createdAt"] ? new Date(safe["createdAt"]) : new Date());
    const updatedDate =
      safe["updatedAt"]?.toDate?.() ??
      (safe["updatedAt"] ? new Date(safe["updatedAt"]) : new Date());

    return {
      uid: id,
      name: safe["name"] ?? "",
      description: safe["description"] ?? "",
      ingredients: Array.isArray(safe["ingredients"]) ? safe["ingredients"] : [],
      instructions: Array.isArray(safe["instructions"]) ? safe["instructions"] : [],
      prepTimeMinutes: Number(safe["prepTimeMinutes"] ?? 0),
      servings: Number(safe["servings"] ?? 1) || 1,
      calories: Number(safe["calories"] ?? 0),
      protein: Number(safe["protein"] ?? 0),
      carbs: Number(safe["carbs"] ?? 0),
      fat: Number(safe["fat"] ?? 0),
      sodium: Number(safe["sodium"] ?? 0),
      fiber: Number(safe["fiber"] ?? 0),
      imageUrl: resolveRecipeImageUrl(safe["imageUrl"]),
      suitableForConditions: Array.isArray(safe["suitableForConditions"])
        ? safe["suitableForConditions"]
        : [],
      dietTags: Array.isArray(safe["dietTags"]) ? safe["dietTags"] : [],
      createdAt: createdDate,
      updatedAt: updatedDate,
      stars: Number(safe["stars"] ?? 4.5),
      mealType: Array.isArray(safe["mealType"])
        ? safe["mealType"]
        : safe["mealType"]
          ? [safe["mealType"]]
          : [],
    };
  }
}
