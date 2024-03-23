import { describe, it, expect } from "vitest";
import dedent from "dedent";

import { clsx } from "../src";
import { process } from "./util/index";

const source = dedent`
  import x from "y";

  Hi

  export const b = 1;
`;

describe("remark-mdx-remove-esm", () => {
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
