import { Routes } from "@angular/router";
import { adminGuard } from "./guards/admin.guard";

export const routes: Routes = [
  {
    path: "",
    loadComponent: () => import("./pages/home/home.component").then((m) => m.HomeComponent),
  },
  {
    path: "logowanie",
    loadComponent: () => import("./pages/auth/login/login.component").then((m) => m.LoginComponent),
  },
  {
    path: "rejestracja",
    loadComponent: () =>
      import("./pages/auth/register/register.component").then((m) => m.RegisterComponent),
  },
  {
    path: "przepisy",
    loadComponent: () =>
      import("./pages/recipes/recipes.component").then((m) => m.RecipesComponent),
  },
  {
    path: "przepisy/:uid",
    loadComponent: () =>
      import("./pages/recipe-details/recipe-details.component").then(
        (m) => m.RecipeDetailsComponent,
      ),
  },
  {
    path: "jadlospisy",
    loadComponent: () =>
      import("./pages/diet-plans/diet-plans.component").then((m) => m.DietPlansComponent),
  },
  {
    path: "choroby",
    loadComponent: () =>
      import("./pages/conditions/conditions.component").then((m) => m.ConditionsComponent),
  },
  {
    path: "choroby/:id",
    loadComponent: () =>
      import("./pages/conditions/conditions.component").then((m) => m.ConditionsComponent),
  },
  {
    path: "admin",
    loadComponent: () => import("./pages/admin/admin.component").then((m) => m.AdminComponent),
    canActivate: [adminGuard],
  },
  // Legacy English URL redirects for backward compatibility
  { path: "login", redirectTo: "logowanie", pathMatch: "full" },
  { path: "register", redirectTo: "rejestracja", pathMatch: "full" },
  { path: "recipes", redirectTo: "przepisy", pathMatch: "full" },
  { path: "recipes/:uid", redirectTo: "przepisy/:uid", pathMatch: "full" },
  { path: "diet-plans", redirectTo: "jadlospisy", pathMatch: "full" },
  { path: "conditions", redirectTo: "choroby", pathMatch: "full" },
  { path: "conditions/:id", redirectTo: "choroby/:id", pathMatch: "full" },
  {
    path: "**",
    redirectTo: "",
  },
];
