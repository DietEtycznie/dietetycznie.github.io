export interface MedicalCondition {
  id: string;
  name: string;
  description: string;
  dietaryRecommendations: string[];
  foodsToAvoid: string[];
  foodsToEat: string[];
}