import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import {
  Recipe,
  MEDICAL_CONDITIONS,
  DIET_TAGS,
  MEAL_TYPES,
} from "../../../models/recipe.model";
import { RecipeService } from "../../../services/recipe.service";
import { MedicalCondition } from "../../../models/medical-condition.model";
import { MedicalConditionService } from "../../../services/medical-condition.service";

@Component({
  selector: "app-admin",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCheckboxModule,
  ],
  templateUrl: "./admin.component.html",
  styleUrls: ["./admin.component.scss"],
})
export class AdminComponent {
  recipe: Partial<Recipe> = {
    name: "",
    description: "",
    mealType: [],
    ingredients: [],
    instructions: [],
    prepTimeMinutes: 0,
    servings: 0,
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    sodium: 0,
    fiber: 0,
    imageUrl: "",
    suitableForConditions: [],
    dietTags: [],
  };

  medicalCondition: Partial<Omit<MedicalCondition, "id">> = {
    name: "",
    description: "",
    dietaryRecommendations: [],
    lifestyleRecommendations: [],
    foodsToEat: [],
    foodsToAvoid: [],
    warnings: [],
  };

  allConditions = MEDICAL_CONDITIONS;
  allDietTags = DIET_TAGS;
  allMealTypes = MEAL_TYPES;

  private recipeService = inject(RecipeService);
  private medicalConditionService = inject(MedicalConditionService);

  async addRecipe() {
    const recipeToAdd = {
      ...this.recipe,
      ingredients:
        typeof this.recipe.ingredients === "string"
          ? (this.recipe.ingredients as string).split(",").map((i) => i.trim())
          : (this.recipe.ingredients ?? []),
      instructions:
        typeof this.recipe.instructions === "string"
          ? (this.recipe.instructions as string).split(",").map((i) => i.trim())
          : (this.recipe.instructions ?? []),
    };
    await this.recipeService
      .addRecipe(recipeToAdd as Omit<Recipe, "uid" | "createdAt" | "updatedAt">)
      .toPromise();
    alert("Przepis dodany!");
    this.recipe = {
      name: "",
      description: "",
      mealType: [],
      ingredients: [],
      instructions: [],
      prepTimeMinutes: 0,
      servings: 0,
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      sodium: 0,
      fiber: 0,
      imageUrl: "",
      suitableForConditions: [],
      dietTags: [],
    };
  }

  async addMedicalCondition() {
    const condToAdd = {
      ...this.medicalCondition,
      dietaryRecommendations:
        typeof this.medicalCondition.dietaryRecommendations === "string"
          ? (this.medicalCondition.dietaryRecommendations as string)
              .split(",")
              .map((i) => i.trim())
          : (this.medicalCondition.dietaryRecommendations ?? []),
      lifestyleRecommendations:
        typeof this.medicalCondition.lifestyleRecommendations === "string"
          ? (this.medicalCondition.lifestyleRecommendations as string)
              .split(",")
              .map((i) => i.trim())
          : (this.medicalCondition.lifestyleRecommendations ?? []),
      foodsToEat:
        typeof this.medicalCondition.foodsToEat === "string"
          ? (this.medicalCondition.foodsToEat as string)
              .split(",")
              .map((i) => i.trim())
          : (this.medicalCondition.foodsToEat ?? []),
      foodsToAvoid:
        typeof this.medicalCondition.foodsToAvoid === "string"
          ? (this.medicalCondition.foodsToAvoid as string)
              .split(",")
              .map((i) => i.trim())
          : (this.medicalCondition.foodsToAvoid ?? []),
      warnings:
        typeof this.medicalCondition.warnings === "string"
          ? (this.medicalCondition.warnings as string)
              .split(",")
              .map((i) => i.trim())
          : (this.medicalCondition.warnings ?? []),
    };
    await this.medicalConditionService
      .addMedicalCondition(condToAdd as Omit<MedicalCondition, "id">)
      .toPromise();
    alert("Jednostka chorobowa dodana!");
    this.medicalCondition = {
      name: "",
      description: "",
      dietaryRecommendations: [],
      lifestyleRecommendations: [],
      foodsToEat: [],
      foodsToAvoid: [],
      warnings: [],
    };
  }

  async fillAndAddMultipleRecipes() {
    const payload = `[{}]`;
    try {
      const recipes: any[] = JSON.parse(payload);

      for (const parsed of recipes) {
        this.recipe = {
          name: parsed.name ?? "",
          description: parsed.description ?? "",
          mealType: parsed.mealType ?? [],
          ingredients:
            parsed.ingredients?.split(",").map((i: string) => i.trim()) ?? [],
          instructions:
            parsed.instructions?.split(",").map((i: string) => i.trim()) ?? [],
          prepTimeMinutes: parsed.prepTimeMinutes ?? 0,
          servings: parsed.servings ?? 0,
          calories: parsed.calories ?? 0,
          protein: parsed.protein ?? 0,
          carbs: parsed.carbs ?? 0,
          fat: parsed.fat ?? 0,
          imageUrl: parsed.imageUrl ?? "",
          suitableForConditions: parsed.suitableForConditions ?? [],
          dietTags: parsed.dietTags ?? [],
        };

        await this.addRecipe();
      }

      alert("Wszystkie przepisy zostały dodane!");
    } catch (error) {
      alert("Błąd podczas wczytywania listy przepisów.");
      console.error(error);
    }
  }

  async fillAndAddMultipleMedicalConditions() {
    // Poprawny JSON!
    const payload = `{
      "name": "Cukrzyca typu II",
      "description": "Cukrzyca typu II to przewlekła choroba metaboliczna związana z zaburzoną wrażliwością na insulinę. Wymaga modyfikacji stylu życia i diety w celu kontroli glikemii i zmniejszenia ryzyka powikłań metabolicznych i sercowo-naczyniowych.",
      "dietaryRecommendations": [
        "Stopniowo redukuj masę ciała — utrata minimum 5–7% masy ciała poprawia wrażliwość na insulinę.",
        "Spożywaj posiłki regularnie, co 3–4 godziny, ostatni posiłek 2–3 godziny przed snem.",
        "Unikaj podjadania i napojów dostarczających energię między posiłkami (kawy z mlekiem i cukrem, słodzone herbaty, napoje).",
        "Komponuj posiłki zgodnie z Talerzem Zdrowego Żywienia: ½ talerza warzywa i owoce (przewaga warzyw), ¼ białko, ¼ węglowodany złożone.",
        "Spożywaj minimum 400g warzyw i owoców dziennie, preferuj owoce jagodowe (maliny, truskawki, jagody).",
        "Węglowodany dostarczaj z pełnoziarnistych produktów zbożowych (pełnoziarniste pieczywo, kasze, brązowy ryż, pełnoziarniste makarony).",
        "Wybieraj produkty białkowe: chude mięsa, ryby, nasiona roślin strączkowych, niskotłuszczowe produkty mleczne.",
        "Spożywaj codziennie 2 porcje fermentowanych produktów mlecznych do 3% tłuszczu.",
        "Ogranicz spożycie tłuszczów nasyconych, preferuj tłuszcze roślinne (olej rzepakowy, oliwa, lniany), orzechy, pestki i awokado.",
        "Unikaj rozdrabniania i rozgotowywania potraw — jedz powoli i w spokoju.",
        "Stosuj korzystną kolejność spożywania: warzywa → białka i tłuszcze → węglowodany.",
        "Spożywaj naturalne słodziki (ksylitol, stewia, erytrytol) zamiast cukru.",
        "Wypijaj 1,5–2L płynów dziennie (woda, herbaty ziołowe, kawa bez cukru)."
      ],
      "lifestyleRecommendations": [
        "Codziennie podejmuj minimum 30 minut umiarkowanej aktywności fizycznej (spacer, wchodzenie po schodach, aktywne prace domowe).",
        "Dbaj o redukcję stresu — stosuj techniki relaksacyjne, jogę, uważność, ćwiczenia oddechowe.",
        "Zapewnij odpowiednią ilość i jakość snu: 7–8 godzin, stałe pory snu, unikanie ekranów godzinę przed snem.",
        "W przypadku stosowania metforminy kontroluj poziom witaminy B12."
      ],
      "foodsToEat": [
        "świeże i mrożone warzywa i owoce (przewaga warzyw)",
        "pełnoziarniste produkty zbożowe (pełnoziarniste pieczywo, kasze, brązowy i dziki ryż, pełnoziarniste makarony)",
        "chude mięsa (kurczak, indyk, cielęcina, królik)",
        "chude wędliny domowe",
        "niskotłuszczowe fermentowane produkty mleczne (do 3% tłuszczu)",
        "chude i półtłuste sery twarogowe, mozzarella light",
        "ryby morskie i słodkowodne (łosoś, dorsz, makrela, halibut)",
        "nasiona roślin strączkowych i ich przetwory",
        "orzechy niesolone, pestki, nasiona",
        "tłuszcze roślinne: oliwa z oliwek, olej rzepakowy, lniany",
        "gorzka czekolada min. 70% kakao",
        "przeciery i musy owocowe bez cukru, dżemy bez cukru",
        "kisiele i galaretki bez dodatku cukru"
      ],
      "foodsToAvoid": [
        "produkty wysokoprzetworzone: fast-food, instant, gotowe dania z mąki oczyszczonej",
        "pełnotłuste sery żółte, topione, pleśniowe, mascarpone",
        "tłuste mięsa: wieprzowina, baranina, kaczka, gęś",
        "tłuste wędliny (baleron, salami, boczek, mielonki, pasztety)",
        "pełnotłuste mleko, śmietany, jogurty owocowe z cukrem, desery mleczne",
        "białe pieczywo, bułki maślane, płatki zbożowe słodzone",
        "biały ryż, jasne makarony, kasza manna, kuskus",
        "owoce kandyzowane, owoce w syropach",
        "słodycze, cukier, miód, syropy, słone przekąski (chipsy, paluszki, krakersy)",
        "tłuszcze nasycone: smalec, masło, olej kokosowy, palmowy, margaryny twarde",
        "słodzone napoje, soki wysokosłodzone, czekolada do picia",
        "gotowe sosy, przyprawy z dużą ilością soli, kostki rosołowe"
      ],
      "warnings": [
        "Alkohol podnosi glikemię poposiłkową — najlepiej całkowicie go wyeliminować.",
        "Rzuć palenie — zmniejsza ryzyko powikłań sercowo-naczyniowych.",
        "Diety alternatywne (niskowęglowodanowe, wysokobiałkowe) mogą zwiększać ryzyko zaburzeń glikemii — ich stosowanie skonsultuj z lekarzem."
      ]
    }`;
    try {
      const parsed = JSON.parse(payload);
      this.medicalCondition = {
        name: parsed.name ?? "",
        description: parsed.description ?? "",
        dietaryRecommendations: parsed.dietaryRecommendations ?? [],
        lifestyleRecommendations: parsed.lifestyleRecommendations ?? [],
        foodsToEat: parsed.foodsToEat ?? [],
        foodsToAvoid: parsed.foodsToAvoid ?? [],
        warnings: parsed.warnings ?? [],
      };
      await this.addMedicalCondition();
      alert("Jednostka chorobowa została dodana!");
    } catch (error) {
      alert("Błąd podczas wczytywania jednostki chorobowej.");
      console.error(error);
    }
  }
}
