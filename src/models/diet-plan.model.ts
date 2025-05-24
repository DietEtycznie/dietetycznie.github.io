export interface DietPlan {
  id: string;
  name: string;
  description: string;
  suitableForConditions: string[];
  mealPlan: {
    breakfast: string[];
    lunch: string[];
    dinner: string[];
    snacks: string[];
  };
  recipeIds: string[];
}