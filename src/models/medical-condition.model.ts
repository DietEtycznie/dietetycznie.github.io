export interface MedicalCondition {
  id: string;
  name: string;
  description: string;
  dietaryRecommendations: string[];
  lifestyleRecommendations: string[];
  foodsToEat: string[];
  foodsToAvoid: string[];
  warnings?: string[];
}
