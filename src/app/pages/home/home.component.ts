import { CommonModule } from "@angular/common";
import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  inject,
  NgZone,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatIconModule } from "@angular/material/icon";
import { Router, RouterLink } from "@angular/router";
import { MedicalCondition } from "../../../models/medical-condition.model";
import { FALLBACK_RECIPE_IMAGE, Recipe } from "../../../models/recipe.model";
import { AuthService } from "../../../services/auth.service";
import { DietPlanService } from "../../../services/diet-plan.service";
import { MedicalConditionService } from "../../../services/medical-condition.service";
import { RecipeService } from "../../../services/recipe.service";
import { LoadingStateComponent, RecipeCardComponent } from "../../components/ui";

@Component({
  selector: "app-home",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    MatIconModule,
    RecipeCardComponent,
    LoadingStateComponent,
  ],
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild("magicTrack") magicTrackRef?: ElementRef<HTMLElement>;

  featuredRecipes: Recipe[] = [];
  allRecipes: Recipe[] = [];
  medicalConditions: MedicalCondition[] = [];
  totalRecipesCount = 0;
  totalConditionsCount = 0;
  totalReadyPlansCount = 0;
  loadingRecipes = true;
  loadingConditions = true;
  searchQuery = "";

  // Scroll storytelling state
  storyProgress = 0;
  activeChapter = 0;
  scrollHintOpacity = 1;
  private rafId: number | null = null;

  // Interactive Bento states inside scroll chapters
  previewConditionIdx = 0;
  previewPortions = 1;
  previewShopping = [
    { name: "Łosoś wędzony 150 g", checked: true },
    { name: "Szpinak świeży 1 op.", checked: true },
    { name: "Jajka ekologiczne 6 szt.", checked: false },
    { name: "Awokado 2 szt.", checked: false },
    { name: "Kasza gryczana 200 g", checked: false },
  ];

  previewConditions = [
    {
      name: "Hashimoto",
      focus: "Dieta przeciwzapalna · Omega-3 · Selen",
      eat: ["Łosoś, dorsz, jaja", "Owoce jagodowe, szpinak", "Oliwa, orzechy włoskie"],
      avoid: ["Cukry proste i słodycze", "Tłuszcze trans", "Produkty wysokoprzetworzone"],
      recipesCount: 16,
    },
    {
      name: "Cukrzyca typu II",
      focus: "Niski indeks glikemiczny (IG < 55) · Błonnik",
      eat: ["Kasza gryczana, owies", "Warzywa nieskrobiowe", "Twaróg, drób, strączki"],
      avoid: ["Słodkie napoje i soki", "Białe pieczywo pszenne", "Rozgotowany biały ryż"],
      recipesCount: 18,
    },
    {
      name: "Nadciśnienie tętnicze",
      focus: "Model kliniczny DASH · Kontrola sodu < 5 g soli",
      eat: ["Buraki, pomidory, potas", "Świeże zioła zamiast soli", "Pełne ziarna i ryby"],
      avoid: ["Wędliny i konserwy", "Kostki rosołowe", "Słone przekąski i sery"],
      recipesCount: 22,
    },
    {
      name: "Celiakia",
      focus: "100% naturalnie bezglutenowe · Przekreślony Kłos",
      eat: ["Ryż, gryka, komosa", "Świeże mięso, ryby, jaja", "Warzywa, owoce, strączki"],
      avoid: ["Pszenica, żyto, jęczmień", "Zwykły sos sojowy", "Niecertyfikowany owies"],
      recipesCount: 19,
    },
  ];

  storyChapters = [
    {
      index: 0,
      kicker: "01 · Zalecenia medyczne",
      title: "Zaczynasz od swojego zdrowia",
      body: "Wybierasz jednostkę chorobową i od razu widzisz konkretne zasady NCEŻ, produkty zalecane oraz bezpieczne przepisy.",
    },
    {
      index: 1,
      kicker: "02 · Przepisy i makro",
      title: "Każdy posiłek policzony za Ciebie",
      body: "Dokładne kalorie, białko, węglowodany, tłuszcz, sód i błonnik. Przelicznik porcji sam skaluje gramatury i wartości.",
    },
    {
      index: 2,
      kicker: "03 · Plan i zakupy",
      title: "Cały tydzień w jednym rytmie",
      body: "Kopiujesz gotowy 7-dniowy jadłospis z 5 posiłkami dziennie, podmieniasz dania i jednym kliknięciem tworzysz listę zakupów.",
    },
  ];

  private recipeService = inject(RecipeService);
  private medicalConditionService = inject(MedicalConditionService);
  private dietPlanService = inject(DietPlanService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private ngZone = inject(NgZone);

  user$ = this.authService.user$;

  ngOnInit(): void {
    this.recipeService.getRecipes().subscribe((recipes) => {
      this.allRecipes = recipes;
      this.totalRecipesCount = recipes.length;
      this.featuredRecipes = [...recipes]
        .sort((a, b) => (b.stars ?? 0) - (a.stars ?? 0))
        .slice(0, 6);
      this.loadingRecipes = false;
    });

    this.medicalConditionService.getMedicalConditions().subscribe((conditions) => {
      this.totalConditionsCount = conditions.length;
      this.medicalConditions = conditions.slice(0, 4);
      this.loadingConditions = false;
    });

    this.dietPlanService.getPublicDietPlans().subscribe((plans) => {
      this.totalReadyPlansCount = plans.length;
    });
  }

  ngAfterViewInit(): void {
    this.ngZone.runOutsideAngular(() => {
      this.rafId = requestAnimationFrame(() => {
        this.rafId = null;
        this.updateScrollProgress();
      });
    });
  }

  ngOnDestroy(): void {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
    }
  }

  @HostListener("window:scroll")
  @HostListener("window:resize")
  onWindowScroll(): void {
    if (this.rafId !== null) return;
    this.ngZone.runOutsideAngular(() => {
      this.rafId = requestAnimationFrame(() => {
        this.rafId = null;
        this.updateScrollProgress();
      });
    });
  }

  private isCompactViewport(): boolean {
    return typeof window !== "undefined" && window.innerWidth <= 980;
  }

  private isShortViewport(): boolean {
    return typeof window !== "undefined" && window.innerWidth <= 980 && window.innerHeight < 580;
  }

  private updateScrollProgress(): void {
    const el = this.magicTrackRef?.nativeElement;

    if (this.isShortViewport()) {
      if (this.scrollHintOpacity !== 0) {
        this.ngZone.run(() => {
          this.scrollHintOpacity = 0;
        });
      }
      if (el) {
        el.style.setProperty("--story-p", "0.5");
        el.style.setProperty("--wave-p", "1");
        el.style.setProperty("--stage-scale", "1");
      }
      return;
    }

    const isCompact = this.isCompactViewport();

    const hintOp = Math.max(0, Math.min(1, 1 - window.scrollY / 140));
    if (Math.abs(hintOp - this.scrollHintOpacity) > 0.02) {
      this.ngZone.run(() => {
        this.scrollHintOpacity = hintOp;
      });
    }

    if (!el) return;

    const rect = el.getBoundingClientRect();
    const scrollable = Math.max(1, el.offsetHeight - window.innerHeight);
    const raw = -rect.top / scrollable;
    const clamped = Math.max(0, Math.min(1, raw));

    // Strictly 0 before entering the track (zero green bleed under hero!)
    const fadeSpan = isCompact ? 0.08 : 0.14;
    const entryFade = clamped < 0.02 ? 0 : Math.min(1, (clamped - 0.02) / fadeSpan);
    const exitFade = clamped > 1 - fadeSpan ? Math.max(0, (1 - clamped) / fadeSpan) : 1;
    const wave = entryFade * exitFade;

    el.style.setProperty("--story-p", clamped.toFixed(4));
    el.style.setProperty("--wave-p", wave.toFixed(4));

    // Subtle Apple-like scale zoom (never exceeds 1.0 on compact viewports)
    const scale = isCompact ? 0.96 + wave * 0.04 : 0.94 + wave * 0.07;
    el.style.setProperty("--stage-scale", scale.toFixed(4));

    const chapter = clamped < 0.34 ? 0 : clamped < 0.68 ? 1 : 2;
    if (chapter !== this.activeChapter || Math.abs(clamped - this.storyProgress) > 0.04) {
      this.ngZone.run(() => {
        this.storyProgress = clamped;
        this.activeChapter = chapter;
      });
    }
  }

  jumpToChapter(chapterIdx: number): void {
    if (this.isShortViewport()) {
      this.activeChapter = chapterIdx;
      return;
    }

    const el = this.magicTrackRef?.nativeElement;
    if (!el) return;
    const scrollable = Math.max(1, el.offsetHeight - window.innerHeight);
    const targetProgress = chapterIdx === 0 ? 0.16 : chapterIdx === 1 ? 0.5 : 0.84;
    const top = window.scrollY + el.getBoundingClientRect().top + scrollable * targetProgress;
    window.scrollTo({ top, behavior: "smooth" });
  }

  get activePreviewCondition() {
    return this.previewConditions[this.previewConditionIdx];
  }

  togglePreviewShopping(index: number): void {
    this.previewShopping[index].checked = !this.previewShopping[index].checked;
  }

  submitSearch(): void {
    const q = this.searchQuery.trim();
    this.router.navigate(["/przepisy"], {
      queryParams: q ? { q } : {},
    });
  }

  getRecipeCountForCondition(conditionName: string): number {
    return this.allRecipes.filter((r) => r.suitableForConditions?.includes(conditionName)).length;
  }

  handleImageError(event: Event): void {
    (event.target as HTMLImageElement).src = FALLBACK_RECIPE_IMAGE;
  }
}
