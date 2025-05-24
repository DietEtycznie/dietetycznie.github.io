export interface Recipe {
  id: string;
  name: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servings: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  imageUrl?: string;
  suitableForConditions: string[];
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}