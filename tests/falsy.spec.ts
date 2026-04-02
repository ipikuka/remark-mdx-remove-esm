import { describe, it, expect, expectTypeOf } from "vitest";

import { process } from "./util/index.js";

const testCases = [
  { disableExports: true, expected: ["export"] },
  { disableExports: false, expected: [false] },
  { disableExports: undefined, expected: [undefined] },
  { disableExports: "someValue", expected: ["export"] },
  { disableExports: 0, expected: [0] },
  { disableExports: null, expected: [null] },
  { disableExports: [], expected: ["export"] },
  { disableExports: {}, expected: ["export"] },
] as const;

describe("remark-mdx-remove-esm", () => {
  // ******************************************
  it("performs well", async () => {
    testCases.forEach((testCase) => {
      const specifiers = [testCase.disableExports && "export"];

      // runtime assertion (Value check)
      expect(specifiers).toEqual(testCase.expected);

      // static type assertion (Type check) // 2nd argument of 'process'
      expectTypeOf(specifiers).toExtend<Parameters<typeof process>[1]>();
    });
  });
});
