import { describe, it, expect } from "vitest";
import {
  missingField,
  safeNumber,
  invalidEnum,
  invalidFormat,
  tooLong,
  DATE_RE,
  TIME_SLOT_RE,
  DISCORD_ID_RE,
  DAYS,
  AVAILABILITY_STATUSES,
  ORG_ROLES,
} from "@/lib/validate";

describe("validate helpers", () => {
  describe("missingField", () => {
    it("returns null when all required fields are present", () => {
      expect(missingField({ a: "x", b: 1 }, ["a", "b"])).toBeNull();
    });

    it("flags undefined, null, and empty/whitespace strings as missing", () => {
      expect(missingField({ a: undefined }, ["a"])).toBe("a");
      expect(missingField({ a: null }, ["a"])).toBe("a");
      expect(missingField({ a: "" }, ["a"])).toBe("a");
      expect(missingField({ a: "   " }, ["a"])).toBe("a");
    });

    it("returns the FIRST missing field in order", () => {
      expect(missingField({ a: "x", b: "", c: "" }, ["a", "b", "c"])).toBe("b");
    });

    it("treats 0 and false as present (not missing)", () => {
      expect(missingField({ a: 0, b: false }, ["a", "b"])).toBeNull();
    });
  });

  describe("safeNumber", () => {
    it("parses numeric strings and numbers", () => {
      expect(safeNumber("42")).toBe(42);
      expect(safeNumber(7)).toBe(7);
    });

    it("returns the fallback for non-numeric input", () => {
      expect(safeNumber("abc")).toBe(0);
      expect(safeNumber(undefined, 5)).toBe(5);
      expect(safeNumber(null, 3)).toBe(3);
    });
  });

  describe("invalidEnum", () => {
    it("returns null for allowed values", () => {
      expect(invalidEnum("status", "AVAILABLE", AVAILABILITY_STATUSES)).toBeNull();
    });

    it("treats empty/undefined as optional (null)", () => {
      expect(invalidEnum("status", "", AVAILABILITY_STATUSES)).toBeNull();
      expect(invalidEnum("status", undefined, AVAILABILITY_STATUSES)).toBeNull();
    });

    it("rejects values not in the allowed set", () => {
      expect(invalidEnum("status", "BOGUS", AVAILABILITY_STATUSES)).toMatch(/Invalid status/);
    });

    it("is case-sensitive (guards against lowercase bypass)", () => {
      expect(invalidEnum("status", "available", AVAILABILITY_STATUSES)).toMatch(/Invalid status/);
    });
  });

  describe("invalidFormat", () => {
    it("returns null when the value matches the regex", () => {
      expect(invalidFormat("date", "2026-06-07", DATE_RE)).toBeNull();
    });

    it("treats empty/undefined as optional (null)", () => {
      expect(invalidFormat("date", "", DATE_RE)).toBeNull();
      expect(invalidFormat("date", undefined, DATE_RE)).toBeNull();
    });

    it("rejects values that don't match", () => {
      expect(invalidFormat("date", "06/07/2026", DATE_RE)).toMatch(/Invalid date format/);
    });
  });

  describe("tooLong", () => {
    it("returns null for strings within the cap", () => {
      expect(tooLong("name", "abc", 5)).toBeNull();
      expect(tooLong("name", "exact", 5)).toBeNull();
    });

    it("flags strings over the cap", () => {
      expect(tooLong("name", "toolong", 5)).toMatch(/exceeds 5/);
    });

    it("ignores non-strings", () => {
      expect(tooLong("n", 12345, 2)).toBeNull();
      expect(tooLong("n", undefined, 2)).toBeNull();
    });
  });

  describe("format regexes", () => {
    it("DATE_RE matches YYYY-MM-DD only", () => {
      expect(DATE_RE.test("2026-06-07")).toBe(true);
      expect(DATE_RE.test("2026-6-7")).toBe(false);
      expect(DATE_RE.test("2026-06-07T00:00")).toBe(false);
    });

    it("TIME_SLOT_RE matches HH:MM only (cron split guard)", () => {
      expect(TIME_SLOT_RE.test("09:30")).toBe(true);
      expect(TIME_SLOT_RE.test("9:30")).toBe(false);
      expect(TIME_SLOT_RE.test("09:30:00")).toBe(false);
      expect(TIME_SLOT_RE.test("abc")).toBe(false);
    });

    it("DISCORD_ID_RE matches a numeric snowflake and rejects injection-ish input", () => {
      expect(DISCORD_ID_RE.test("123456789012345678")).toBe(true);
      expect(DISCORD_ID_RE.test("123")).toBe(false); // too short
      expect(DISCORD_ID_RE.test("12345; DROP TABLE")).toBe(false);
      expect(DISCORD_ID_RE.test("../../etc")).toBe(false);
    });
  });

  describe("enum constants", () => {
    it("expose the expected canonical sets", () => {
      expect(DAYS).toEqual(["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"]);
      expect(ORG_ROLES).toContain("OWNER");
      expect(ORG_ROLES).toContain("PLAYER");
      expect(ORG_ROLES).not.toContain("admin"); // org roles are uppercase tier names
    });
  });
});
