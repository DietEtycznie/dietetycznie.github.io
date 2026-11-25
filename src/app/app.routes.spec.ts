import "@angular/compiler";
import { describe, expect, it } from "vitest";
import { routes } from "./app.routes";
import { adminGuard } from "./guards/admin.guard";

describe("App routing table (Polish paths & legacy redirects)", () => {
  const byPath = (path: string) => routes.find((r) => r.path === path);

  it("exposes all primary Polish application routes", () => {
    const primaryPaths = [
      "",
      "przepisy",
      "przepisy/:uid",
      "choroby",
      "choroby/:id",
      "jadlospisy",
      "logowanie",
      "rejestracja",
      "admin",
    ];

    for (const path of primaryPaths) {
      const route = byPath(path);
      expect(route, `Expected route '${path}' to exist`).toBeDefined();
      expect(typeof route?.loadComponent).toBe("function");
    }
  });

  it("protects /admin route with adminGuard", () => {
    const adminRoute = byPath("admin");
    expect(adminRoute?.canActivate).toContain(adminGuard);
  });

  it("maintains backward-compatible redirects from legacy English URLs", () => {
    const expectedRedirects: [string, string][] = [
      ["login", "logowanie"],
      ["register", "rejestracja"],
      ["recipes", "przepisy"],
      ["recipes/:uid", "przepisy/:uid"],
      ["diet-plans", "jadlospisy"],
      ["conditions", "choroby"],
      ["conditions/:id", "choroby/:id"],
    ];

    for (const [legacyPath, targetPath] of expectedRedirects) {
      const route = byPath(legacyPath);
      expect(route?.redirectTo).toBe(targetPath);
      expect(route?.pathMatch).toBe("full");
    }
  });

  it("redirects unknown paths via wildcard to home", () => {
    const wildcard = byPath("**");
    expect(wildcard?.redirectTo).toBe("");
  });
});
