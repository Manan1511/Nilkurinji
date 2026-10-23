import { describe, expect, it } from "vitest";
import { parseTeaProfile } from "./tea-profile";

describe("approved tea profile", () => {
  it("publishes a normalized profile only when explicitly approved", () => {
    expect(parseTeaProfile(JSON.stringify({
      approved: true,
      format: "loose-tea",
      origin: "Assam",
      elevationM: 450,
      tastingNotes: ["malt", " honey ", ""],
      brewing: { dose: { amount: 2, unit: "g" }, waterMl: 200, temperatureC: 95, steepSeconds: 180, infusions: 2 },
    }))).toEqual({
      approved: true,
      format: "loose-tea",
      origin: "Assam",
      estate: null,
      elevationM: 450,
      harvest: null,
      lot: null,
      tastingNotes: ["malt", "honey"],
      brewing: { dose: { amount: 2, unit: "g" }, waterMl: 200, temperatureC: 95, steepSeconds: 180, infusions: 2, instructions: null },
    });
  });

  it("rejects unapproved, malformed, and non-object data", () => {
    expect(parseTeaProfile(null)).toBeNull();
    expect(parseTeaProfile("{" )).toBeNull();
    expect(parseTeaProfile(JSON.stringify({ approved: false, origin: "Assam" }))).toBeNull();
    expect(parseTeaProfile(JSON.stringify(["approved"]))).toBeNull();
  });

  it("omits invalid fields while keeping valid approved notes", () => {
    expect(parseTeaProfile(JSON.stringify({
      approved: true,
      format: "pyramid-infuser",
      origin: "<b>Origin</b>",
      elevationM: -10,
      tastingNotes: ["warm spice", 4],
      brewing: { dose: { amount: -1, unit: "bag" }, waterMl: 0, temperatureC: 101, steepSeconds: 0, infusions: 1.5, instructions: "<b>Steep</b>" },
    }))).toEqual({
      approved: true,
      format: null,
      origin: null,
      estate: null,
      elevationM: null,
      harvest: null,
      lot: null,
      tastingNotes: ["warm spice"],
      brewing: { dose: null, waterMl: null, temperatureC: null, steepSeconds: null, infusions: null, instructions: null },
    });
  });
});
