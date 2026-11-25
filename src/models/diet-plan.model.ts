export type DayKey =
  "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";

export interface WeeklyMealPlan {
  monday: string[];
  tuesday: string[];
  wednesday: string[];
  thursday: string[];
  friday: string[];
  saturday: string[];
  sunday: string[];
  [key: string]: string[];
}

export interface DietPlan {
  id: string;
  name: string;
  description: string;
  suitableForConditions: string[];
  tags?: string[];
  targetCalories?: number;
  isPremium?: boolean;
  isPersonalized?: boolean;
  assignedBy?: string;
  dietitianNotes?: string;
  createdAt?: string;
  mealPlan: WeeklyMealPlan;
  userId: string | null;
}

export const WEEK_DAYS: { key: DayKey; label: string; shortLabel: string }[] = [
  { key: "monday", label: "Poniedziałek", shortLabel: "Pon" },
  { key: "tuesday", label: "Wtorek", shortLabel: "Wt" },
  { key: "wednesday", label: "Środa", shortLabel: "Śr" },
  { key: "thursday", label: "Czwartek", shortLabel: "Czw" },
  { key: "friday", label: "Piątek", shortLabel: "Pt" },
  { key: "saturday", label: "Sobota", shortLabel: "Sob" },
  { key: "sunday", label: "Niedziela", shortLabel: "Ndz" },
];

export function createEmptyMealPlan(): WeeklyMealPlan {
  return {
    monday: ["", "", "", "", ""],
    tuesday: ["", "", "", "", ""],
    wednesday: ["", "", "", "", ""],
    thursday: ["", "", "", "", ""],
    friday: ["", "", "", "", ""],
    saturday: ["", "", "", "", ""],
    sunday: ["", "", "", "", ""],
  };
}

export function normalizeMealPlan(plan: Partial<WeeklyMealPlan> | undefined): WeeklyMealPlan {
  const empty = createEmptyMealPlan();
  for (const day of WEEK_DAYS) {
    const existing = plan?.[day.key];
    if (Array.isArray(existing)) {
      empty[day.key] = Array.from({ length: 5 }, (_, i) => existing[i] ?? "");
    }
  }
  return empty;
}
