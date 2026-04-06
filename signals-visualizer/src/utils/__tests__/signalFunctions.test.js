import { describe, expect, it } from "vitest";

import { evenPart, generateSine, oddPart } from "../signalFunctions";

describe("signalFunctions", () => {
  it("generates expected sampled sine values", () => {
    const signal = generateSine({ amplitude: 2, frequency: 1, samples: 4 });
    const rounded = signal.map((value) => Number(value.toFixed(4)));

    expect(rounded).toEqual([0, 2, 0, -2]);
  });

  it("splits a sequence into even and odd parts that reconstruct the original", () => {
    const input = [1, 2, 3, 4];
    const even = evenPart(input);
    const odd = oddPart(input);
    const reconstructed = even.map((value, index) => value + odd[index]);

    expect(reconstructed).toEqual(input);
  });
});
