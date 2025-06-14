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
];
export const DIET_TAGS = ["Wegańska", "Wegetariańska", "Bezglutenowa"];
export const MEAL_TYPES = [
  "Śniadanie",
  "Obiad",
  "Podwieczorek",
  "Kolacja",
  "Przekąska",
];

export const formatDatePL = (date: Date): string => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  console.log(date.toLocaleDateString("pl-PL", options));
  return date.toLocaleDateString("pl-PL", options);
};

export class RecipeModel {
  static toRecipe(data: any, id: string): Recipe {
    const createdDate = data["createdAt"]?.toDate?.() ?? new Date();
    const updatedDate = data["updatedAt"]?.toDate?.() ?? new Date();

    return {
      uid: id,
      name: data["name"] ?? "",
      description: data["description"] ?? "",
      ingredients: data["ingredients"] ?? [],
      instructions: data["instructions"] ?? [],
      prepTimeMinutes: data["prepTimeMinutes"] ?? 0,
      servings: data["servings"] ?? 0,
      calories: data["calories"] ?? 0,
      protein: data["protein"] ?? 0,
      carbs: data["carbs"] ?? 0,
      fat: data["fat"] ?? 0,
      sodium: data["sodium"] ?? 0,
      fiber: data["fiber"] ?? 0,
      imageUrl: data["imageUrl"]
        ? "../../../assets/recipes/" + data["imageUrl"]
        : "",
      suitableForConditions: data["suitableForConditions"] ?? undefined,
      dietTags: data["dietTags"] ?? undefined,
      createdAt: createdDate,
      updatedAt: updatedDate,
      stars: data["stars"] ?? 0,
      mealType: data["mealType"] ?? [],
    };
  }
}
