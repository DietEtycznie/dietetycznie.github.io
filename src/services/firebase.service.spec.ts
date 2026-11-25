import { describe, expect, it } from "vitest";
import { cleanFirestorePayload } from "./firebase.service";

describe("cleanFirestorePayload", () => {
  it("strips undefined fields while preserving falsy and null values", () => {
    const input = {
      uid: "u-1",
      name: "Plan Hashimoto",
      userId: null,
      isPersonalized: false,
      targetCalories: undefined,
      photoURL: undefined,
      calories: 0,
      description: "",
      tags: ["DASH"],
    };

    const cleaned = cleanFirestorePayload(input);

    expect(cleaned).toEqual({
      uid: "u-1",
      name: "Plan Hashimoto",
      userId: null,
      isPersonalized: false,
      calories: 0,
      description: "",
      tags: ["DASH"],
    });
    expect("targetCalories" in cleaned).toBe(false);
    expect("photoURL" in cleaned).toBe(false);
  });
});
