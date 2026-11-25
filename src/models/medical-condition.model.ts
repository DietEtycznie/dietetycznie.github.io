export interface MedicalCondition {
  id: string;
  name: string;
  description: string;
  shortSummary?: string;
  icon?: string;
  dietaryRecommendations: string[];
  lifestyleRecommendations: string[];
  foodsToEat: string[];
  foodsToAvoid: string[];
  warnings?: string[];
  pdfURL?: string;
}
