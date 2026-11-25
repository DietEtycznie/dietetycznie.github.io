import { describe, expect, it } from "vitest";
import { isDismissCooldownActive, isIosSafariUserAgent } from "./pwa-install.service";

describe("PwaInstallService helpers", () => {
  it("detects iOS Safari user agents accurately", () => {
    const iphoneSafari =
      "Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1";
    const ipadSafari =
      "Mozilla/5.0 (iPad; CPU OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1";
    const iphoneChrome =
      "Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/123.0.6312.52 Mobile/15E148 Safari/604.1";
    const androidChrome =
      "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Mobile Safari/537.36";
    const macSafari =
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_4) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Safari/605.1.15";

    expect(isIosSafariUserAgent(iphoneSafari)).toBe(true);
    expect(isIosSafariUserAgent(ipadSafari)).toBe(true);
    expect(isIosSafariUserAgent(iphoneChrome)).toBe(false);
    expect(isIosSafariUserAgent(androidChrome)).toBe(false);
    expect(isIosSafariUserAgent(macSafari)).toBe(false);
  });

  it("respects the 14-day dismissal cooldown", () => {
    const now = 1_700_000_000_000;
    const oneDayMs = 24 * 60 * 60 * 1000;

    expect(isDismissCooldownActive(null, now)).toBe(false);
    expect(isDismissCooldownActive("invalid", now)).toBe(false);
    expect(isDismissCooldownActive(String(now - 3 * oneDayMs), now)).toBe(true);
    expect(isDismissCooldownActive(String(now - 15 * oneDayMs), now)).toBe(false);
  });
});
