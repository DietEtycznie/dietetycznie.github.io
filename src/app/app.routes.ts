import { Routes } from "@angular/router";
import { authGuard } from "./guards/auth.guard";
import { adminGuard } from "./guards/admin.guard";
import { RecipesComponent } from "./pages/recipes/recipes.component";

export const routes: Routes = [
  {
    path: "",
    loadComponent: () =>
      import("./pages/home/home.component").then((m) => m.HomeComponent),
  },
  {
    path: "login",
    loadComponent: () =>
      import("./pages/auth/login/login.component").then(
        (m) => m.LoginComponent,
      ),
  },
  {
    path: "register",
    loadComponent: () =>
      import("./pages/auth/register/register.component").then(
        (m) => m.RegisterComponent,
      ),
  },
  {
    path: "recipes",
    loadComponent: () =>
      import("./pages/recipes/recipes.component").then(
        (m) => m.RecipesComponent,
      ),
  },
  {
    path: "recipes/:uid",
    loadComponent: () =>
      import("./pages/recipe-details/recipe-details.component").then(
        (m) => m.RecipeDetailsComponent,
      ),
  },
  {
    path: "diet-plans",
    loadComponent: () =>
      import("./pages/diet-plans/diet-plans.component").then(
        (m) => m.DietPlansComponent,
      ),
  },
  {
    path: "conditions",
    loadComponent: () =>
      import("./pages/conditions/conditions.component").then(
        (m) => m.ConditionsComponent,
      ),
  },
  {
    path: "admin",
    loadComponent: () =>
      import("./pages/admin/admin.component").then((m) => m.AdminComponent),
    canActivate: [adminGuard],
  },
  {
    path: "**",
    redirectTo: "",
  },
];
