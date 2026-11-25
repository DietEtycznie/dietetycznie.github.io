import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const rootDir = resolve(__dirname, "..");

describe("PWA configuration integrity", () => {
  it("has a valid manifest.webmanifest with existing icon files and standalone display", () => {
    const manifestPath = resolve(rootDir, "src/manifest.webmanifest");
    expect(existsSync(manifestPath)).toBe(true);

    const manifest = JSON.parse(readFileSync(manifestPath, "utf-8")) as {
      name: string;
      short_name: string;
      display: string;
      start_url: string;
      icons: { src: string; sizes: string; purpose?: string }[];
    };

    expect(manifest.short_name).toBe("DietEtycznie");
    expect(manifest.display).toBe("standalone");
    expect(manifest.start_url).toBe("/");
    expect(manifest.icons.length).toBeGreaterThanOrEqual(4);

    for (const icon of manifest.icons) {
      const iconFile = resolve(rootDir, "src", icon.src);
      expect(existsSync(iconFile), `Missing PWA icon: ${icon.src}`).toBe(true);
    }

    expect(manifest.icons.some((i) => i.purpose === "maskable")).toBe(true);
    expect(existsSync(resolve(rootDir, "src/assets/icons/apple-touch-icon-180x180.png"))).toBe(
      true,
    );
  });

  it("has a valid ngsw-config.json with app and assets groups", () => {
    const ngswPath = resolve(rootDir, "ngsw-config.json");
    expect(existsSync(ngswPath)).toBe(true);

    const config = JSON.parse(readFileSync(ngswPath, "utf-8")) as {
      index: string;
      assetGroups: { name: string }[];
    };

    expect(config.index).toBe("/index.html");
    expect(config.assetGroups.map((g) => g.name)).toContain("app");
    expect(config.assetGroups.map((g) => g.name)).toContain("assets");
  });
});
