import { describe, it, expect } from "vitest";

import { clsx } from "../src";

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

      // console.log(testCase.disableExports);

      expect(specifiers).toEqual(testCase.expected);
    });
  });
});
