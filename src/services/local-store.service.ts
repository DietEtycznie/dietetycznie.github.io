import { Injectable } from "@angular/core";
import { SEED_MEDICAL_CONDITIONS } from "../data/seed-conditions";
import { SEED_DIET_PLANS } from "../data/seed-diet-plans";
import { SEED_RECIPES } from "../data/seed-recipes";
import { DietPlan, normalizeMealPlan } from "../models/diet-plan.model";
import { MedicalCondition } from "../models/medical-condition.model";
import { Recipe, resolveRecipeImageUrl } from "../models/recipe.model";
import { User } from "../models/user.model";

const STORAGE_KEYS = {
  recipes: "dietetycznie_v2_recipes",
  conditions: "dietetycznie_v2_conditions",
  plans: "dietetycznie_v2_plans",
  users: "dietetycznie_v2_users",
  demoUser: "dietetycznie_v2_demo_user",
};

const SEED_DEMO_USERS: User[] = [
  {
    uid: "demo-admin",
    email: "admin@dietetycznie.pl",
    displayName: "Admin DietEtycznie",
    role: "admin",
    medicalConditions: ["Hashimoto"],
    savedRecipes: ["rec-omlet-losos-szpinak", "rec-kurczak-grecki-ryz"],
    dietPlans: [],
    subscription: { tier: "pro", active: true },
  },
  {
    uid: "demo-user",
    email: "demo@dietetycznie.pl",
    displayName: "Konto Demo",
    role: "user",
    medicalConditions: ["Hashimoto"],
    savedRecipes: ["rec-omlet-losos-szpinak", "rec-kurczak-grecki-ryz"],
    dietPlans: [],
    subscription: { tier: "free", active: false },
  },
  {
    uid: "demo-anna",
    email: "anna.kowalska@example.com",
    displayName: "Anna Kowalska",
    role: "user",
    medicalConditions: ["Insulinooporność", "Hashimoto"],
    savedRecipes: ["rec-szakszuka"],
    dietPlans: [],
    subscription: { tier: "private", active: true },
  },
];

export interface BackupPayload {
  version: number;
  exportedAt: string;
  recipes: Recipe[];
  medicalConditions: MedicalCondition[];
  dietPlans: DietPlan[];
  users?: User[];
}

@Injectable({
  providedIn: "root",
})
export class LocalStoreService {
  getRecipes(): Recipe[] {
    const raw = this.readJson<any[]>(STORAGE_KEYS.recipes);
    if (!raw || raw.length === 0) {
      const seeded = SEED_RECIPES.map((r) => ({ ...r }));
      this.saveRecipes(seeded);
      return seeded;
    }
    return raw.map((r) => ({
      ...r,
      imageUrl: resolveRecipeImageUrl(r.imageUrl),
      createdAt: r.createdAt ? new Date(r.createdAt) : new Date(),
      updatedAt: r.updatedAt ? new Date(r.updatedAt) : new Date(),
    }));
  }

  saveRecipes(recipes: Recipe[]): void {
    this.writeJson(STORAGE_KEYS.recipes, recipes);
  }

  getConditions(): MedicalCondition[] {
    const raw = this.readJson<MedicalCondition[]>(STORAGE_KEYS.conditions);
    if (!raw || raw.length === 0) {
      const seeded = SEED_MEDICAL_CONDITIONS.map((c) => ({ ...c }));
      this.saveConditions(seeded);
      return seeded;
    }
    return raw;
  }

  saveConditions(conditions: MedicalCondition[]): void {
    this.writeJson(STORAGE_KEYS.conditions, conditions);
  }

  getDietPlans(): DietPlan[] {
    const raw = this.readJson<DietPlan[]>(STORAGE_KEYS.plans);
    if (!raw || raw.length === 0) {
      const seeded = SEED_DIET_PLANS.map((p) => ({
        ...p,
        mealPlan: normalizeMealPlan(p.mealPlan),
      }));
      this.saveDietPlans(seeded);
      return seeded;
    }
    return raw.map((p) => ({
      ...p,
      mealPlan: normalizeMealPlan(p.mealPlan),
    }));
  }

  saveDietPlans(plans: DietPlan[]): void {
    this.writeJson(STORAGE_KEYS.plans, plans);
  }

  getUsers(): User[] {
    const raw = this.readJson<User[]>(STORAGE_KEYS.users);
    if (!raw || raw.length === 0) {
      const seeded = SEED_DEMO_USERS.map((u) => ({
        ...u,
        medicalConditions: [...(u.medicalConditions ?? [])],
        savedRecipes: [...(u.savedRecipes ?? [])],
        dietPlans: [...(u.dietPlans ?? [])],
        subscription: u.subscription ? { ...u.subscription } : undefined,
      }));
      this.saveUsers(seeded);
      return seeded;
    }
    return raw;
  }

  saveUsers(users: User[]): void {
    this.writeJson(STORAGE_KEYS.users, users);
  }

  upsertUser(user: User): void {
    const list = this.getUsers();
    const idx = list.findIndex(
      (u) => u.uid === user.uid || u.email.toLowerCase() === user.email.toLowerCase(),
    );
    if (idx >= 0) {
      list[idx] = { ...list[idx], ...user };
    } else {
      list.push(user);
    }
    this.saveUsers(list);
  }

  deleteUser(uid: string): void {
    const filtered = this.getUsers().filter((u) => u.uid !== uid);
    this.saveUsers(filtered);
  }

  getDemoUser(): User | null {
    return this.readJson<User | null>(STORAGE_KEYS.demoUser);
  }

  saveDemoUser(user: User | null): void {
    if (!user) {
      try {
        localStorage.removeItem(STORAGE_KEYS.demoUser);
      } catch {
        // Ignore storage errors in restricted environments
      }
      return;
    }
    this.writeJson(STORAGE_KEYS.demoUser, user);
  }

  resetAllToSeed(): void {
    this.saveRecipes(SEED_RECIPES.map((r) => ({ ...r })));
    this.saveConditions(SEED_MEDICAL_CONDITIONS.map((c) => ({ ...c })));
    this.saveDietPlans(
      SEED_DIET_PLANS.map((p) => ({
        ...p,
        mealPlan: normalizeMealPlan(p.mealPlan),
      })),
    );
  }

  exportBackup(): BackupPayload {
    return {
      version: 2,
      exportedAt: new Date().toISOString(),
      recipes: this.getRecipes(),
      medicalConditions: this.getConditions(),
      dietPlans: this.getDietPlans(),
    };
  }

  importBackup(payload: Partial<BackupPayload>): void {
    if (Array.isArray(payload.recipes) && payload.recipes.length) {
      this.saveRecipes(
        payload.recipes.map((r) => ({
          ...r,
          imageUrl: resolveRecipeImageUrl(r.imageUrl),
          createdAt: r.createdAt ? new Date(r.createdAt) : new Date(),
          updatedAt: r.updatedAt ? new Date(r.updatedAt) : new Date(),
        })),
      );
    }
    if (Array.isArray(payload.medicalConditions) && payload.medicalConditions.length) {
      this.saveConditions(payload.medicalConditions);
    }
    if (Array.isArray(payload.dietPlans) && payload.dietPlans.length) {
      this.saveDietPlans(
        payload.dietPlans.map((p) => ({
          ...p,
          mealPlan: normalizeMealPlan(p.mealPlan),
        })),
      );
    }
  }

  private readJson<T>(key: string): T | null {
    try {
      const val = localStorage.getItem(key);
      return val ? (JSON.parse(val) as T) : null;
    } catch {
      return null;
    }
  }

  private writeJson(key: string, value: unknown): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Ignore quota / SSR errors
    }
  }
}
