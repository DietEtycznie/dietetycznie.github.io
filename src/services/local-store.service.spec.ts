import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SEED_MEDICAL_CONDITIONS } from "../data/seed-conditions";
import { SEED_DIET_PLANS } from "../data/seed-diet-plans";
import { SEED_RECIPES } from "../data/seed-recipes";
import { LocalStoreService } from "./local-store.service";

function createMemoryStorage(): Storage {
  const store = new Map<string, string>();
  return {
    get length() {
      return store.size;
    },
    clear: () => store.clear(),
    getItem: (key: string) => (store.has(key) ? store.get(key)! : null),
    key: (index: number) => Array.from(store.keys())[index] ?? null,
    removeItem: (key: string) => {
      store.delete(key);
    },
    setItem: (key: string, value: string) => {
      store.set(key, String(value));
    },
  };
}

describe("LocalStoreService", () => {
  let service: LocalStoreService;

  beforeEach(() => {
    vi.stubGlobal("localStorage", createMemoryStorage());
    service = new LocalStoreService();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("seeds recipes, medical conditions, diet plans, and demo users on empty storage", () => {
    expect(service.getRecipes()).toHaveLength(SEED_RECIPES.length);
    expect(service.getConditions()).toHaveLength(SEED_MEDICAL_CONDITIONS.length);
    expect(service.getDietPlans()).toHaveLength(SEED_DIET_PLANS.length);
    expect(service.getUsers().length).toBeGreaterThanOrEqual(3);
  });

  it("upserts users by UID or case-insensitive email and deletes cleanly", () => {
    const initialCount = service.getUsers().length;

    service.upsertUser({
      uid: "u-new",
      email: "Marek@Test.pl",
      displayName: "Marek",
      role: "user",
    });
    expect(service.getUsers()).toHaveLength(initialCount + 1);

    // Updating by case-insensitive email updates existing entry without duplicating
    service.upsertUser({
      uid: "u-new",
      email: "marek@test.pl",
      displayName: "Marek Admin",
      role: "admin",
    });
    expect(service.getUsers()).toHaveLength(initialCount + 1);
    const updated = service.getUsers().find((u) => u.uid === "u-new");
    expect(updated?.role).toBe("admin");
    expect(updated?.displayName).toBe("Marek Admin");

    service.deleteUser("u-new");
    expect(service.getUsers()).toHaveLength(initialCount);
  });

  it("persists and clears active demo user session", () => {
    expect(service.getDemoUser()).toBeNull();
    service.saveDemoUser({
      uid: "demo-1",
      email: "demo@dietetycznie.pl",
      displayName: "Demo",
      role: "user",
    });
    expect(service.getDemoUser()?.uid).toBe("demo-1");

    service.saveDemoUser(null);
    expect(service.getDemoUser()).toBeNull();
  });

  it("exports backup, imports custom payload with normalized dates/images, and resets to seed", () => {
    const backup = service.exportBackup();
    expect(backup.version).toBe(2);
    expect(backup.recipes).toHaveLength(SEED_RECIPES.length);

    service.importBackup({
      recipes: [
        {
          ...SEED_RECIPES[0],
          uid: "custom-rec-1",
          name: "Własny przepis testowy",
          imageUrl: "szakszuka.png",
        },
      ],
    });

    const loaded = service.getRecipes();
    expect(loaded).toHaveLength(1);
    expect(loaded[0].uid).toBe("custom-rec-1");
    expect(loaded[0].imageUrl).toBe("assets/recipes/szakszuka.png");
    expect(loaded[0].createdAt).toBeInstanceOf(Date);

    service.resetAllToSeed();
    expect(service.getRecipes()).toHaveLength(SEED_RECIPES.length);
  });

  it("degrades gracefully when localStorage throws security/quota errors", () => {
    vi.stubGlobal("localStorage", {
      getItem: () => {
        throw new Error("Storage blocked");
      },
      setItem: () => {
        throw new Error("Quota exceeded");
      },
      removeItem: () => {
        throw new Error("Storage blocked");
      },
    });

    expect(() => service.saveDemoUser(null)).not.toThrow();
    expect(service.getRecipes()).toHaveLength(SEED_RECIPES.length);
  });
});
