import { CommonModule } from "@angular/common";
import { Component, OnInit, inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatIconModule } from "@angular/material/icon";
import { MatSelectModule } from "@angular/material/select";
import { RouterModule } from "@angular/router";
import { firstValueFrom } from "rxjs";
import {
  DIET_TAGS,
  FALLBACK_RECIPE_IMAGE,
  MEAL_TYPES,
  MEDICAL_CONDITIONS,
  RECIPE_IMAGE_ASSETS,
  Recipe,
  resolveRecipeImageUrl,
} from "../../../models/recipe.model";
import { MedicalCondition } from "../../../models/medical-condition.model";
import {
  DayKey,
  DietPlan,
  WEEK_DAYS,
  createEmptyMealPlan,
  normalizeMealPlan,
} from "../../../models/diet-plan.model";
import { RecipeService } from "../../../services/recipe.service";
import { MedicalConditionService } from "../../../services/medical-condition.service";
import { DietPlanService } from "../../../services/diet-plan.service";
import { FirebaseService } from "../../../services/firebase.service";
import { LocalStoreService } from "../../../services/local-store.service";
import { UserService } from "../../../services/user.service";
import { AuthService } from "../../../services/auth.service";
import { User } from "../../../models/user.model";
import {
  CroppedImageResult,
  ImageCropperDialogComponent,
  SearchInputComponent,
} from "../../components/ui";

type AdminTab = "overview" | "recipes" | "conditions" | "plans" | "users";

interface RecipeFormState {
  uid: string | null;
  name: string;
  description: string;
  prepTimeMinutes: number;
  servings: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sodium: number;
  stars: number;
  imageUrl: string;
  mealType: string[];
  suitableForConditions: string[];
  dietTags: string[];
  ingredients: string[];
  instructions: string[];
}

interface ConditionFormState {
  id: string | null;
  name: string;
  shortSummary: string;
  description: string;
  icon: string;
  pdfURL: string;
  dietaryRecommendations: string[];
  lifestyleRecommendations: string[];
  foodsToEat: string[];
  foodsToAvoid: string[];
  warnings: string[];
}

interface PlanFormState {
  id: string | null;
  name: string;
  description: string;
  targetCalories: number;
  isPremium: boolean;
  isPersonalized: boolean;
  userId: string | null;
  assignedBy: string;
  dietitianNotes: string;
  suitableForConditions: string[];
  mealPlan: Record<DayKey, string[]>;
}

interface UserFormState {
  uid: string | null;
  displayName: string;
  email: string;
  role: "user" | "admin";
  tier: "free" | "pro" | "private";
  medicalConditions: string[];
}

@Component({
  selector: "app-admin",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatIconModule,
    MatSelectModule,
    ImageCropperDialogComponent,
    SearchInputComponent,
  ],
  templateUrl: "./admin.component.html",
  styleUrls: ["./admin.component.scss"],
})
export class AdminComponent implements OnInit {
  private recipeService = inject(RecipeService);
  private conditionService = inject(MedicalConditionService);
  private dietPlanService = inject(DietPlanService);
  private userService = inject(UserService);
  private authService = inject(AuthService);
  private firebase = inject(FirebaseService);
  private localStore = inject(LocalStoreService);

  activeTab: AdminTab = "recipes";
  isLoading = true;
  isSaving = false;
  isSeeding = false;

  toastMessage = "";
  toastType: "success" | "error" = "success";
  private toastTimer?: ReturnType<typeof setTimeout>;

  recipes: Recipe[] = [];
  conditions: MedicalCondition[] = [];
  allPlans: DietPlan[] = [];
  users: User[] = [];

  // Filters
  recipeSearch = "";
  recipeMealFilter = "";
  conditionSearch = "";
  userSearch = "";
  planScopeFilter: "all" | "public" | "personalized" = "all";
  assetSearch = "";

  // Confirm delete state
  confirmDeleteId: string | null = null;
  confirmDeleteType: "recipe" | "condition" | "plan" | "user" | null = null;

  // Constants
  readonly allMealTypes = MEAL_TYPES;
  readonly allDietTags = DIET_TAGS;
  readonly allAssetImages = RECIPE_IMAGE_ASSETS;
  readonly weekDays = WEEK_DAYS;
  readonly mealSlotLabels = ["Śniadanie", "II śniadanie", "Obiad", "Podwieczorek", "Kolacja"];
  readonly conditionIconChoices = [
    "bloodtype",
    "favorite",
    "grain",
    "spa",
    "monitor_heart",
    "health_and_safety",
    "medication",
    "local_dining",
  ];

  // Recipe Modal
  isRecipeModalOpen = false;
  showAssetPicker = false;
  recipeForm: RecipeFormState = this.createEmptyRecipeForm();
  bulkIngredientsText = "";
  bulkInstructionsText = "";
  showBulkIngredients = false;
  showBulkInstructions = false;

  // Image Cropper Dialog
  isCropperOpen = false;
  cropperInitialUrl = "";

  // Condition Modal
  isConditionModalOpen = false;
  conditionForm: ConditionFormState = this.createEmptyConditionForm();

  // Plan Modal
  isPlanModalOpen = false;
  planActiveDay: DayKey = "monday";
  planForm: PlanFormState = this.createEmptyPlanForm();
  templatePlanId = "";

  // User Modal
  isUserModalOpen = false;
  userForm: UserFormState = this.createEmptyUserForm();

  get currentAdminUid(): string | null {
    return this.authService.currentUserSnapshot?.uid ?? null;
  }

  get publicPlans(): DietPlan[] {
    return this.allPlans.filter((p) => p.userId === null);
  }

  get personalizedPlans(): DietPlan[] {
    return this.allPlans.filter((p) => Boolean(p.isPersonalized && p.userId));
  }

  get managedPlans(): DietPlan[] {
    const visible = this.allPlans.filter((p) => p.userId === null || Boolean(p.isPersonalized));
    if (this.planScopeFilter === "public") {
      return visible.filter((p) => p.userId === null);
    }
    if (this.planScopeFilter === "personalized") {
      return visible.filter((p) => Boolean(p.isPersonalized && p.userId));
    }
    return visible;
  }

  get filteredUsers(): User[] {
    const q = this.userSearch.trim().toLowerCase();
    if (!q) return this.users;
    return this.users.filter(
      (u) =>
        (u.displayName || "").toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        (u.medicalConditions ?? []).some((c) => c.toLowerCase().includes(q)),
    );
  }

  get isFallbackMode(): boolean {
    return this.firebase.isFallbackMode;
  }

  get availableConditionNames(): string[] {
    const set = new Set<string>(MEDICAL_CONDITIONS);
    for (const c of this.conditions) {
      if (c.name) set.add(c.name);
    }
    return Array.from(set);
  }

  get filteredRecipes(): Recipe[] {
    const q = this.recipeSearch.trim().toLowerCase();
    return this.recipes.filter((r) => {
      if (this.recipeMealFilter && !r.mealType.includes(this.recipeMealFilter)) {
        return false;
      }
      if (!q) return true;
      return (
        r.name.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.suitableForConditions.some((c) => c.toLowerCase().includes(q)) ||
        r.dietTags.some((t) => t.toLowerCase().includes(q))
      );
    });
  }

  get filteredConditions(): MedicalCondition[] {
    const q = this.conditionSearch.trim().toLowerCase();
    if (!q) return this.conditions;
    return this.conditions.filter(
      (c) => c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q),
    );
  }

  get filteredAssetImages(): string[] {
    const q = this.assetSearch.trim().toLowerCase();
    if (!q) return this.allAssetImages;
    return this.allAssetImages.filter((f) => f.toLowerCase().includes(q));
  }

  get estimatedMacroKcal(): number {
    return Math.round(
      (Number(this.recipeForm.protein) || 0) * 4 +
        (Number(this.recipeForm.carbs) || 0) * 4 +
        (Number(this.recipeForm.fat) || 0) * 9,
    );
  }

  ngOnInit(): void {
    this.loadAllData();
  }

  async loadAllData(): Promise<void> {
    this.isLoading = true;
    try {
      const [recipes, conditions, plans, users] = await Promise.all([
        firstValueFrom(this.recipeService.getRecipes()),
        firstValueFrom(this.conditionService.getMedicalConditions()),
        firstValueFrom(this.dietPlanService.getDietPlans()),
        firstValueFrom(this.userService.getAllUsers()),
      ]);
      this.recipes = recipes;
      this.conditions = conditions;
      this.allPlans = plans;
      this.users = users;
    } catch (err) {
      console.error(err);
      this.showToast("Nie udało się pobrać danych panelu.", "error");
    } finally {
      this.isLoading = false;
    }
  }

  showToast(message: string, type: "success" | "error" = "success"): void {
    this.toastMessage = message;
    this.toastType = type;
    if (this.toastTimer) clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => {
      this.toastMessage = "";
    }, 4200);
  }

  resolveImage(url?: string): string {
    return resolveRecipeImageUrl(url);
  }

  onImgError(event: Event): void {
    (event.target as HTMLImageElement).src = FALLBACK_RECIPE_IMAGE;
  }

  // ==================== RECIPE CRUD ====================

  private createEmptyRecipeForm(): RecipeFormState {
    return {
      uid: null,
      name: "",
      description: "",
      prepTimeMinutes: 15,
      servings: 1,
      calories: 380,
      protein: 22,
      carbs: 40,
      fat: 14,
      fiber: 6,
      sodium: 320,
      stars: 4.8,
      imageUrl: "",
      mealType: ["Śniadanie"],
      suitableForConditions: [],
      dietTags: [],
      ingredients: [""],
      instructions: [""],
    };
  }

  openNewRecipe(): void {
    this.recipeForm = this.createEmptyRecipeForm();
    this.showAssetPicker = false;
    this.showBulkIngredients = false;
    this.showBulkInstructions = false;
    this.isRecipeModalOpen = true;
  }

  openEditRecipe(recipe: Recipe): void {
    this.recipeForm = {
      uid: recipe.uid,
      name: recipe.name,
      description: recipe.description,
      prepTimeMinutes: recipe.prepTimeMinutes,
      servings: recipe.servings,
      calories: recipe.calories,
      protein: recipe.protein,
      carbs: recipe.carbs,
      fat: recipe.fat,
      fiber: recipe.fiber,
      sodium: recipe.sodium,
      stars: recipe.stars ?? 4.7,
      imageUrl: recipe.imageUrl ?? "",
      mealType: [...recipe.mealType],
      suitableForConditions: [...recipe.suitableForConditions],
      dietTags: [...recipe.dietTags],
      ingredients: recipe.ingredients.length ? [...recipe.ingredients] : [""],
      instructions: recipe.instructions.length ? [...recipe.instructions] : [""],
    };
    this.showAssetPicker = false;
    this.showBulkIngredients = false;
    this.showBulkInstructions = false;
    this.isRecipeModalOpen = true;
  }

  duplicateRecipe(recipe: Recipe): void {
    this.openEditRecipe(recipe);
    this.recipeForm.uid = null;
    this.recipeForm.name = `${recipe.name} (kopia)`;
  }

  closeRecipeModal(): void {
    this.isRecipeModalOpen = false;
  }

  toggleTag(list: string[], value: string): void {
    const idx = list.indexOf(value);
    if (idx >= 0) {
      list.splice(idx, 1);
    } else {
      list.push(value);
    }
  }

  addListRow(list: string[]): void {
    list.push("");
  }

  removeListRow(list: string[], index: number): void {
    if (list.length <= 1) {
      list[0] = "";
      return;
    }
    list.splice(index, 1);
  }

  moveListRow(list: string[], index: number, delta: number): void {
    const target = index + delta;
    if (target < 0 || target >= list.length) return;
    const [item] = list.splice(index, 1);
    list.splice(target, 0, item);
  }

  applyBulkIngredients(): void {
    const lines = this.bulkIngredientsText
      .split(/\r?\n/)
      .map((l) => l.replace(/^[-•*\d.)\s]+/, "").trim())
      .filter(Boolean);
    if (lines.length) {
      this.recipeForm.ingredients = lines;
      this.bulkIngredientsText = "";
      this.showBulkIngredients = false;
    }
  }

  applyBulkInstructions(): void {
    const lines = this.bulkInstructionsText
      .split(/\r?\n/)
      .map((l) => l.replace(/^[-•*\d.)\s]+/, "").trim())
      .filter(Boolean);
    if (lines.length) {
      this.recipeForm.instructions = lines;
      this.bulkInstructionsText = "";
      this.showBulkInstructions = false;
    }
  }

  selectAssetImage(filename: string): void {
    this.recipeForm.imageUrl = filename;
    this.showAssetPicker = false;
  }

  openImageCropper(useCurrentImage = false): void {
    this.cropperInitialUrl =
      useCurrentImage && this.recipeForm.imageUrl
        ? resolveRecipeImageUrl(this.recipeForm.imageUrl)
        : "";
    this.isCropperOpen = true;
  }

  onImageCropped(result: CroppedImageResult): void {
    this.recipeForm.imageUrl = result.dataUrl;
    this.isCropperOpen = false;
    const kb = Math.round((result.dataUrl.length * 3) / 4 / 1024);
    this.showToast(
      `Zdjęcie przycięte (${result.width}×${result.height} px, ~${kb} KB, zaokrąglenie ${result.borderRadiusPercent}%).`,
    );
  }

  async saveRecipe(): Promise<void> {
    if (!this.recipeForm.name.trim()) {
      this.showToast("Podaj nazwę przepisu.", "error");
      return;
    }

    const ingredients = this.recipeForm.ingredients.map((s) => s.trim()).filter(Boolean);
    const instructions = this.recipeForm.instructions.map((s) => s.trim()).filter(Boolean);

    if (ingredients.length === 0) {
      this.showToast("Dodaj przynajmniej jeden składnik.", "error");
      return;
    }

    const payload: Omit<Recipe, "uid" | "createdAt" | "updatedAt"> = {
      name: this.recipeForm.name.trim(),
      description: this.recipeForm.description.trim(),
      prepTimeMinutes: Math.max(1, Number(this.recipeForm.prepTimeMinutes) || 10),
      servings: Math.max(1, Number(this.recipeForm.servings) || 1),
      calories: Math.max(0, Number(this.recipeForm.calories) || 0),
      protein: Math.max(0, Number(this.recipeForm.protein) || 0),
      carbs: Math.max(0, Number(this.recipeForm.carbs) || 0),
      fat: Math.max(0, Number(this.recipeForm.fat) || 0),
      fiber: Math.max(0, Number(this.recipeForm.fiber) || 0),
      sodium: Math.max(0, Number(this.recipeForm.sodium) || 0),
      stars: Math.min(5, Math.max(1, Number(this.recipeForm.stars) || 4.8)),
      imageUrl: this.recipeForm.imageUrl.trim() || FALLBACK_RECIPE_IMAGE,
      mealType: this.recipeForm.mealType.length ? [...this.recipeForm.mealType] : ["Obiad"],
      suitableForConditions: [...this.recipeForm.suitableForConditions],
      dietTags: [...this.recipeForm.dietTags],
      ingredients,
      instructions: instructions.length
        ? instructions
        : ["Połącz wszystkie składniki i podawaj od razu."],
    };

    this.isSaving = true;
    try {
      if (this.recipeForm.uid) {
        await firstValueFrom(this.recipeService.updateRecipe(this.recipeForm.uid, payload));
        this.showToast(`Zaktualizowano przepis „${payload.name}”.`);
      } else {
        await firstValueFrom(this.recipeService.addRecipe(payload));
        this.showToast(`Dodano nowy przepis „${payload.name}”.`);
      }
      this.isRecipeModalOpen = false;
      await this.loadAllData();
    } catch (err) {
      console.error(err);
      this.showToast("Nie udało się zapisać przepisu.", "error");
    } finally {
      this.isSaving = false;
    }
  }

  // ==================== CONDITION CRUD ====================

  private createEmptyConditionForm(): ConditionFormState {
    return {
      id: null,
      name: "",
      shortSummary: "",
      description: "",
      icon: "health_and_safety",
      pdfURL: "",
      dietaryRecommendations: [""],
      lifestyleRecommendations: [""],
      foodsToEat: [""],
      foodsToAvoid: [""],
      warnings: [""],
    };
  }

  openNewCondition(): void {
    this.conditionForm = this.createEmptyConditionForm();
    this.isConditionModalOpen = true;
  }

  openEditCondition(cond: MedicalCondition): void {
    this.conditionForm = {
      id: cond.id,
      name: cond.name,
      shortSummary: cond.shortSummary ?? "",
      description: cond.description,
      icon: cond.icon || "health_and_safety",
      pdfURL: cond.pdfURL ?? "",
      dietaryRecommendations: cond.dietaryRecommendations?.length
        ? [...cond.dietaryRecommendations]
        : [""],
      lifestyleRecommendations: cond.lifestyleRecommendations?.length
        ? [...cond.lifestyleRecommendations]
        : [""],
      foodsToEat: cond.foodsToEat?.length ? [...cond.foodsToEat] : [""],
      foodsToAvoid: cond.foodsToAvoid?.length ? [...cond.foodsToAvoid] : [""],
      warnings: cond.warnings?.length ? [...cond.warnings] : [""],
    };
    this.isConditionModalOpen = true;
  }

  closeConditionModal(): void {
    this.isConditionModalOpen = false;
  }

  async saveCondition(): Promise<void> {
    if (!this.conditionForm.name.trim()) {
      this.showToast("Podaj nazwę jednostki chorobowej.", "error");
      return;
    }

    const payload: Omit<MedicalCondition, "id"> = {
      name: this.conditionForm.name.trim(),
      shortSummary: this.conditionForm.shortSummary.trim(),
      description: this.conditionForm.description.trim(),
      icon: this.conditionForm.icon || "health_and_safety",
      pdfURL: this.conditionForm.pdfURL.trim() || undefined,
      dietaryRecommendations: this.conditionForm.dietaryRecommendations
        .map((s) => s.trim())
        .filter(Boolean),
      lifestyleRecommendations: this.conditionForm.lifestyleRecommendations
        .map((s) => s.trim())
        .filter(Boolean),
      foodsToEat: this.conditionForm.foodsToEat.map((s) => s.trim()).filter(Boolean),
      foodsToAvoid: this.conditionForm.foodsToAvoid.map((s) => s.trim()).filter(Boolean),
      warnings: this.conditionForm.warnings.map((s) => s.trim()).filter(Boolean),
    };

    this.isSaving = true;
    try {
      if (this.conditionForm.id) {
        await firstValueFrom(
          this.conditionService.updateMedicalCondition(this.conditionForm.id, payload),
        );
        this.showToast(`Zaktualizowano „${payload.name}”.`);
      } else {
        await firstValueFrom(this.conditionService.addMedicalCondition(payload));
        this.showToast(`Dodano jednostkę chorobową „${payload.name}”.`);
      }
      this.isConditionModalOpen = false;
      await this.loadAllData();
    } catch (err) {
      console.error(err);
      this.showToast("Nie udało się zapisać jednostki chorobowej.", "error");
    } finally {
      this.isSaving = false;
    }
  }

  // ==================== DIET PLAN CRUD ====================

  private createEmptyPlanForm(): PlanFormState {
    return {
      id: null,
      name: "",
      description: "",
      targetCalories: 1850,
      isPremium: false,
      isPersonalized: false,
      userId: null,
      assignedBy: "mgr Maja Harkot",
      dietitianNotes: "",
      suitableForConditions: [],
      mealPlan: createEmptyMealPlan(),
    };
  }

  openNewPlan(): void {
    this.planForm = this.createEmptyPlanForm();
    this.templatePlanId = "";
    this.planActiveDay = "monday";
    this.isPlanModalOpen = true;
  }

  openNewPlanForUser(user: User): void {
    this.planForm = {
      ...this.createEmptyPlanForm(),
      name: `Plan indywidualny — ${user.displayName || user.email}`,
      description:
        "Spersonalizowany 7-dniowy jadłospis ułożony indywidualnie przez dietetyka klinicznego.",
      isPersonalized: true,
      isPremium: true,
      userId: user.uid,
      assignedBy: "mgr Maja Harkot",
      suitableForConditions: [...(user.medicalConditions ?? [])],
    };
    this.templatePlanId = "";
    this.planActiveDay = "monday";
    this.isPlanModalOpen = true;
  }

  openEditPlan(plan: DietPlan): void {
    this.planForm = {
      id: plan.id,
      name: plan.name,
      description: plan.description,
      targetCalories: plan.targetCalories ?? 1850,
      isPremium: Boolean(plan.isPremium),
      isPersonalized: Boolean(plan.isPersonalized && plan.userId),
      userId: plan.userId ?? null,
      assignedBy: plan.assignedBy || "mgr Maja Harkot",
      dietitianNotes: plan.dietitianNotes || "",
      suitableForConditions: [...(plan.suitableForConditions ?? [])],
      mealPlan: normalizeMealPlan(plan.mealPlan),
    };
    this.templatePlanId = "";
    this.planActiveDay = "monday";
    this.isPlanModalOpen = true;
  }

  closePlanModal(): void {
    this.isPlanModalOpen = false;
  }

  onPlanScopeToggle(personalized: boolean): void {
    this.planForm.isPersonalized = personalized;
    if (personalized) {
      this.planForm.isPremium = true;
      if (!this.planForm.userId && this.users.length) {
        this.planForm.userId = this.users[0].uid;
      }
    } else {
      this.planForm.userId = null;
    }
  }

  applyPlanTemplate(templateId: string): void {
    this.templatePlanId = templateId;
    const tpl = this.publicPlans.find((p) => p.id === templateId);
    if (!tpl) return;
    this.planForm.mealPlan = normalizeMealPlan(tpl.mealPlan);
    if (!this.planForm.suitableForConditions.length) {
      this.planForm.suitableForConditions = [...tpl.suitableForConditions];
    }
    this.showToast(`Załadowano posiłki z szablonu „${tpl.name}”.`);
  }

  copyActiveDayToAllDays(): void {
    const source = [...this.planForm.mealPlan[this.planActiveDay]];
    for (const day of this.weekDays) {
      this.planForm.mealPlan[day.key] = [...source];
    }
    this.showToast("Skopiowano zestaw posiłków na wszystkie 7 dni.");
  }

  getPlanDayCalories(day: DayKey): number {
    const ids = this.planForm.mealPlan[day] ?? [];
    return ids.reduce((sum, id) => {
      const rec = this.recipes.find((r) => r.uid === id);
      return sum + (rec?.calories ?? 0);
    }, 0);
  }

  getPlanAverageCalories(plan: DietPlan): number {
    let total = 0;
    let filledDays = 0;
    for (const day of this.weekDays) {
      const ids = plan.mealPlan[day.key] ?? [];
      const dayKcal = ids.reduce((s, id) => {
        const rec = this.recipes.find((r) => r.uid === id);
        return s + (rec?.calories ?? 0);
      }, 0);
      if (dayKcal > 0) {
        total += dayKcal;
        filledDays++;
      }
    }
    return filledDays ? Math.round(total / filledDays) : (plan.targetCalories ?? 0);
  }

  getPlanFilledMealsCount(plan: DietPlan): number {
    let count = 0;
    for (const day of this.weekDays) {
      count += (plan.mealPlan[day.key] ?? []).filter(Boolean).length;
    }
    return count;
  }

  async savePlan(): Promise<void> {
    if (!this.planForm.name.trim()) {
      this.showToast("Podaj nazwę jadłospisu.", "error");
      return;
    }

    if (this.planForm.isPersonalized && !this.planForm.userId) {
      this.showToast("Wybierz użytkownika, któremu chcesz przypisać plan.", "error");
      return;
    }

    const payload: Omit<DietPlan, "id"> = {
      name: this.planForm.name.trim(),
      description: this.planForm.description.trim(),
      targetCalories: Number(this.planForm.targetCalories) || 1800,
      isPremium: this.planForm.isPersonalized ? true : this.planForm.isPremium,
      isPersonalized: this.planForm.isPersonalized,
      assignedBy: this.planForm.isPersonalized
        ? this.planForm.assignedBy.trim() || "mgr Maja Harkot"
        : undefined,
      dietitianNotes: this.planForm.isPersonalized
        ? this.planForm.dietitianNotes.trim() || undefined
        : undefined,
      createdAt: new Date().toISOString(),
      suitableForConditions: [...this.planForm.suitableForConditions],
      mealPlan: normalizeMealPlan(this.planForm.mealPlan),
      userId: this.planForm.isPersonalized ? this.planForm.userId : null,
    };

    this.isSaving = true;
    try {
      if (this.planForm.id) {
        await firstValueFrom(this.dietPlanService.updateDietPlan(this.planForm.id, payload));
        this.showToast(`Zaktualizowano jadłospis „${payload.name}”.`);
      } else {
        await firstValueFrom(this.dietPlanService.addDietPlan(payload));
        if (payload.isPersonalized && payload.userId) {
          const targetName = this.getUserNameById(payload.userId);
          this.showToast(`Przypisano indywidualny plan „${payload.name}” dla ${targetName}.`);
        } else {
          this.showToast(`Dodano gotowy jadłospis „${payload.name}”.`);
        }
      }
      this.isPlanModalOpen = false;
      await this.loadAllData();
    } catch (err) {
      console.error(err);
      this.showToast("Nie udało się zapisać jadłospisu.", "error");
    } finally {
      this.isSaving = false;
    }
  }

  // ==================== USER CRUD ====================

  private createEmptyUserForm(): UserFormState {
    return {
      uid: null,
      displayName: "",
      email: "",
      role: "user",
      tier: "free",
      medicalConditions: [],
    };
  }

  openNewUser(): void {
    this.userForm = this.createEmptyUserForm();
    this.isUserModalOpen = true;
  }

  openEditUser(user: User): void {
    this.userForm = {
      uid: user.uid,
      displayName: user.displayName || "",
      email: user.email,
      role: user.role === "admin" ? "admin" : "user",
      tier: user.subscription?.tier ?? "free",
      medicalConditions: [...(user.medicalConditions ?? [])],
    };
    this.isUserModalOpen = true;
  }

  closeUserModal(): void {
    this.isUserModalOpen = false;
  }

  async saveUser(): Promise<void> {
    if (!this.userForm.email.trim()) {
      this.showToast("Podaj adres e-mail użytkownika.", "error");
      return;
    }

    const subscription = {
      tier: this.userForm.tier,
      active: this.userForm.tier !== "free",
      activatedAt: this.userForm.tier !== "free" ? new Date().toISOString() : undefined,
    };

    this.isSaving = true;
    try {
      if (this.userForm.uid) {
        await firstValueFrom(
          this.userService.updateUser(this.userForm.uid, {
            displayName: this.userForm.displayName.trim() || this.userForm.email.split("@")[0],
            email: this.userForm.email.trim(),
            role: this.userForm.role,
            subscription,
            medicalConditions: [...this.userForm.medicalConditions],
          }),
        );
        this.showToast("Zaktualizowano dane użytkownika.");
      } else {
        await firstValueFrom(
          this.userService.createUser({
            displayName: this.userForm.displayName.trim() || this.userForm.email.split("@")[0],
            email: this.userForm.email.trim(),
            role: this.userForm.role,
            subscription,
            medicalConditions: [...this.userForm.medicalConditions],
            savedRecipes: [],
            dietPlans: [],
          }),
        );
        this.showToast(`Dodano użytkownika „${this.userForm.displayName || this.userForm.email}”.`);
      }
      this.isUserModalOpen = false;
      await this.loadAllData();
    } catch (err) {
      console.error(err);
      this.showToast("Nie udało się zapisać użytkownika.", "error");
    } finally {
      this.isSaving = false;
    }
  }

  getUserNameById(uid: string | null): string {
    if (!uid) return "Publiczny";
    const found = this.users.find((u) => u.uid === uid);
    return found ? found.displayName || found.email : uid;
  }

  getUserPersonalizedPlansCount(uid: string): number {
    return this.allPlans.filter((p) => p.userId === uid && p.isPersonalized).length;
  }

  getUserInitials(user: User): string {
    const src = (user.displayName || user.email || "U").trim();
    const parts = src.split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return src.slice(0, 2).toUpperCase();
  }

  getTierLabel(tier?: string): string {
    if (tier === "private") return "Indywidualny";
    if (tier === "pro") return "PRO";
    return "Free";
  }

  async toggleUserAdminRole(user: User): Promise<void> {
    if (user.uid === this.currentAdminUid) {
      this.showToast("Nie możesz odebrać uprawnień administratora samemu sobie.", "error");
      return;
    }
    const nextRole: "admin" | "user" = user.role === "admin" ? "user" : "admin";
    try {
      await firstValueFrom(
        this.userService.updateUser(user.uid, {
          role: nextRole,
          email: user.email,
        }),
      );
      await this.loadAllData();
      this.showToast(
        nextRole === "admin"
          ? `Nadano uprawnienia administratora dla ${user.displayName || user.email}.`
          : `Odebrano uprawnienia administratora dla ${user.displayName || user.email}.`,
      );
    } catch (err) {
      console.error(err);
      this.showToast("Nie udało się zmienić roli użytkownika.", "error");
    }
  }

  // ==================== DELETE CONFIRM ====================

  requestDelete(type: "recipe" | "condition" | "plan" | "user", id: string): void {
    this.confirmDeleteType = type;
    this.confirmDeleteId = id;
  }

  cancelDelete(): void {
    this.confirmDeleteType = null;
    this.confirmDeleteId = null;
  }

  async confirmDelete(): Promise<void> {
    if (!this.confirmDeleteId || !this.confirmDeleteType) return;
    const id = this.confirmDeleteId;
    const type = this.confirmDeleteType;
    this.cancelDelete();

    try {
      if (type === "recipe") {
        await firstValueFrom(this.recipeService.deleteRecipe(id));
        this.showToast("Usunięto przepis.");
      } else if (type === "condition") {
        await firstValueFrom(this.conditionService.deleteMedicalCondition(id));
        this.showToast("Usunięto jednostkę chorobową.");
      } else if (type === "plan") {
        await firstValueFrom(this.dietPlanService.deleteDietPlan(id));
        this.showToast("Usunięto jadłospis.");
      } else if (type === "user") {
        await firstValueFrom(this.userService.deleteUser(id));
        this.showToast("Usunięto użytkownika.");
      }
      await this.loadAllData();
    } catch (err) {
      console.error(err);
      this.showToast("Nie udało się usunąć elementu.", "error");
    }
  }

  // ==================== SEED / BACKUP / IMPORT ====================

  async runSeedAll(): Promise<void> {
    this.isSeeding = true;
    try {
      const [rCount, cCount, pCount] = await Promise.all([
        this.recipeService.seedToFirestore(),
        this.conditionService.seedToFirestore(),
        this.dietPlanService.seedToFirestore(),
      ]);
      await this.loadAllData();
      this.showToast(`Zasiano bazę: ${rCount} przepisów, ${cCount} chorób, ${pCount} jadłospisów.`);
    } catch (err) {
      console.error(err);
      this.showToast("Błąd podczas zasilania bazy seed.", "error");
    } finally {
      this.isSeeding = false;
    }
  }

  exportBackupJson(): void {
    const payload = {
      version: 2,
      exportedAt: new Date().toISOString(),
      recipes: this.recipes,
      medicalConditions: this.conditions,
      dietPlans: this.publicPlans,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `dietetycznie-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    this.showToast("Pobrano plik kopii zapasowej JSON.");
  }

  async onImportBackupFile(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = "";
    if (!file) return;

    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      if (Array.isArray(parsed)) {
        // Bulk recipe array import
        let count = 0;
        for (const item of parsed) {
          if (!item?.name) continue;
          await firstValueFrom(
            this.recipeService.addRecipe({
              name: String(item.name),
              description: String(item.description ?? ""),
              ingredients: Array.isArray(item.ingredients) ? item.ingredients : [],
              instructions: Array.isArray(item.instructions) ? item.instructions : [],
              prepTimeMinutes: Number(item.prepTimeMinutes ?? 15),
              servings: Number(item.servings ?? 1),
              calories: Number(item.calories ?? 0),
              protein: Number(item.protein ?? 0),
              carbs: Number(item.carbs ?? 0),
              fat: Number(item.fat ?? 0),
              fiber: Number(item.fiber ?? 0),
              sodium: Number(item.sodium ?? 0),
              imageUrl: item.imageUrl ?? FALLBACK_RECIPE_IMAGE,
              suitableForConditions: Array.isArray(item.suitableForConditions)
                ? item.suitableForConditions
                : [],
              dietTags: Array.isArray(item.dietTags) ? item.dietTags : [],
              mealType: Array.isArray(item.mealType) ? item.mealType : ["Obiad"],
              stars: Number(item.stars ?? 4.7),
            }),
          );
          count++;
        }
        await this.loadAllData();
        this.showToast(`Zaimportowano ${count} przepisów z JSON.`);
      } else {
        this.localStore.importBackup(parsed);
        await this.loadAllData();
        this.showToast("Przywrócono backup JSON do lokalnej bazy.");
      }
    } catch (err) {
      console.error(err);
      this.showToast("Nieprawidłowy plik JSON.", "error");
    }
  }

  resetLocalSeed(): void {
    this.localStore.resetAllToSeed();
    this.loadAllData();
    this.showToast("Przywrócono domyślny zestaw danych seed.");
  }

  trackByIndex(index: number): number {
    return index;
  }
}
