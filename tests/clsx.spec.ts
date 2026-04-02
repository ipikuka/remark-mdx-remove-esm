import { describe, it, expect, expectTypeOf } from "vitest";

import { clsx } from "../src/index.js";
import { process } from "./util/index.js";

const testCases = [
  {
    disableExports: true,
    expected: ["export"],
  },
  {
    disableExports: false,
    expected: [],
  },
  {
    disableExports: undefined,
    expected: [],
  },
  {
    disableExports: "someValue",
    expected: ["export"],
  },
  {
    disableExports: 0,
    expected: [],
  },
  {
    disableExports: null,
    expected: [],
  },
  {
    disableExports: [],
    expected: ["export"],
  },
  {
    disableExports: {},
    expected: ["export"],
  },
] as const;

describe("clsx", () => {
  // ******************************************
  it("performs well", async () => {
    testCases.forEach((testCase) => {
      const specifiers = clsx([testCase.disableExports && "export"]);

      // Runtime Assertion (Value check)
      expect(specifiers).toEqual(testCase.expected);

      // Static Type Assertion (Type check)
      // Confirms 'specifiers' is valid to pass as the 2nd argument of 'process'
      expectTypeOf(specifiers).toExtend<Parameters<typeof process>[1]>();
    });
  });
});
