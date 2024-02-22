import { unified } from "unified";
import remarkParse from "remark-parse";
import gfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import remarkMdx from "remark-mdx";
import rehypeStringify from "rehype-stringify";
import dedent from "dedent";
import type { VFileCompatible, VFile } from "vfile";

import { describe, it, expect } from "vitest";

import plugin, { MdxRemoveEsmOptions, clsx } from "../src";

const compilerCreator = (options?: MdxRemoveEsmOptions) =>
  unified()
    .use(remarkParse)
    .use(remarkMdx)
    .use(gfm)
    .use(plugin, options)
    .use(remarkRehype)
    .use(rehypeStringify);

const process = async (
  content: VFileCompatible,
  options?: MdxRemoveEsmOptions,
): Promise<VFile> => {
  return compilerCreator(options).process(content);
};

const source = dedent`
  import x from "y";

  Hi

  export const b = 1;
`;

describe("xxx", () => {
  // ******************************************
  it("with no options", async () => {
    expect(String(await process(source))).toMatchInlineSnapshot(`"<p>Hi</p>"`);
  });

  // ******************************************
  it("only imports", async () => {
    expect(String(await process(source, "import"))).toMatchInlineSnapshot(`
      "<p>Hi</p>
      export const b = 1;"
    `);
  });

  // ******************************************
  it("only exports", async () => {
    expect(String(await process(source, "export"))).toMatchInlineSnapshot(`
      "import x from "y";
      <p>Hi</p>"
    `);
  });

  // ******************************************
  it("with array options - 1", async () => {
    const disableExports = true;
    const disableImports = true;

    const mdxRemoveEsmOptions = clsx([disableExports && "export", disableImports && "import"]);

    expect(String(await process(source, mdxRemoveEsmOptions))).toMatchInlineSnapshot(`
      "<p>Hi</p>"
    `);
  });

  // ******************************************
  it("with array options - 2", async () => {
    const disableExports = true;
    const disableImports = false;

    const mdxRemoveEsmOptions = clsx([disableExports && "export", disableImports && "import"]);

    expect(String(await process(source, mdxRemoveEsmOptions))).toMatchInlineSnapshot(`
      "import x from "y";
      <p>Hi</p>"
    `);
  });

  // ******************************************
  it("with array options - 3", async () => {
    const disableExports = false;
    const disableImports = true;

    const mdxRemoveEsmOptions = clsx([disableExports && "export", disableImports && "import"]);

    expect(String(await process(source, mdxRemoveEsmOptions))).toMatchInlineSnapshot(`
      "<p>Hi</p>
      export const b = 1;"
    `);
  });

  // ******************************************
  it("with array options - 4", async () => {
    const disableExports = undefined;
    const disableImports = undefined;

    const mdxRemoveEsmOptions = clsx([disableExports && "export", disableImports && "import"]);

    expect(String(await process(source, mdxRemoveEsmOptions))).toMatchInlineSnapshot(`
      "import x from "y";
      <p>Hi</p>
      export const b = 1;"
    `);
  });
});

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
  it("clsx performs well", async () => {
    testCases.forEach((testCase) => {
      const specifiers = clsx([testCase.disableExports && "export"]);

      console.log(testCase.disableExports);

      expect(specifiers).toEqual(testCase.expected);
    });
  });
});
