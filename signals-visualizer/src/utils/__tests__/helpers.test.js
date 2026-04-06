import { describe, expect, it } from "vitest";

import { clamp, formatNumber } from "../helpers";

describe("helpers", () => {
  it("clamps values to a lower and upper bound", () => {
    expect(clamp(-2, 0, 10)).toBe(0);
    expect(clamp(5, 0, 10)).toBe(5);
    expect(clamp(20, 0, 10)).toBe(10);
  });

  it("formats numbers using fixed precision", () => {
    expect(formatNumber(Math.PI, 2)).toBe("3.14");
    expect(formatNumber(2, 4)).toBe("2.0000");
  });
});
