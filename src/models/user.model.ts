export interface UserSubscription {
  tier: "free" | "pro" | "private";
  active: boolean;
  activatedAt?: string;
  expiresAt?: string;
}

export interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  role?: "user" | "admin";
  medicalConditions?: string[];
  savedRecipes?: string[];
  dietPlans?: string[];
  subscription?: UserSubscription;
}
