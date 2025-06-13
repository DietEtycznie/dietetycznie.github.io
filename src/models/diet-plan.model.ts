export interface DietPlan {
  id: string;
  name: string;
  description: string;
  suitableForConditions: string[];
  mealPlan: {
    monday: string[];
    tuesday: string[];
    wednesday: string[];
    thursday: string[];
    friday: string[];
    saturday: string[];
    sunday: string[];
    [key: string]: string[];
  };
  userId: string | null;
}
