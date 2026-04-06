import { describe, expect, it } from "vitest";

import { discreteConvolution } from "../convolution";

describe("discreteConvolution", () => {
  it("returns the expected linear convolution result", () => {
    const x = [1, 2, 3];
    const h = [1, 1];

    expect(discreteConvolution(x, h)).toEqual([1, 3, 5, 3]);
  });
});
