export interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  medicalConditions?: string[];
  savedRecipes?: string[];
  dietPlans?: string[];
}