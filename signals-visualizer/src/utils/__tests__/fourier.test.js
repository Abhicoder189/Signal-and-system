import { describe, expect, it } from "vitest";

import { dft } from "../fourier";

describe("dft", () => {
  it("produces unit magnitude bins for an impulse", () => {
    const output = dft([1, 0, 0, 0]);

    output.forEach(({ magnitude, real, imag }) => {
      expect(magnitude).toBeCloseTo(1, 6);
      expect(real).toBeCloseTo(1, 6);
      expect(imag).toBeCloseTo(0, 6);
    });
  });

  it("captures DC component for a constant signal", () => {
    const output = dft([1, 1, 1, 1]);

    expect(output[0].magnitude).toBeCloseTo(4, 6);
    expect(output[1].magnitude).toBeCloseTo(0, 6);
    expect(output[2].magnitude).toBeCloseTo(0, 6);
    expect(output[3].magnitude).toBeCloseTo(0, 6);
  });
});
