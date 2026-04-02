import type { Plugin } from "unified";
import type { Root, Node, Literal } from "mdast";
import type { MdxjsEsm } from "mdast-util-mdxjs-esm";
import { remove } from "unist-util-remove";

export type MdxEsmSpecifier = "import" | "export";

export type MdxRemoveEsmOptions =
  | MdxEsmSpecifier
  | (MdxEsmSpecifier | string | boolean | null | undefined | 0)[];

function isLiteral(node: Node): node is Literal {
  return "value" in node;
}

function isMdxjsEsm(node: Literal): node is MdxjsEsm {
  return node.type === "mdxjsEsm";
}

const RemarkMdxRemoveEsm: Plugin<[MdxRemoveEsmOptions?], Root> = (options) => {
  // normalize everything into a clean array
  const raw = Array.isArray(options) ? options : [options];

  // filter for valid specifiers
  const active = raw.filter((o): o is MdxEsmSpecifier => o === "import" || o === "export");

  const hasImport = active.includes("import");
  const hasExport = active.includes("export");

  if (options === undefined || (hasImport && hasExport)) return removeAllEsm();
  if (hasExport) return removeExports();
  if (hasImport) return removeImports();

  function removeAllEsm() {
    return (tree: Root): undefined => {
      remove(tree, "mdxjsEsm");
    };
  }

  function removeExports() {
    return (tree: Root): undefined => {
      remove(tree, (node) => {
        // type predicate
        if (!isLiteral(node)) return;

        // type predicate
        if (!isMdxjsEsm(node)) return;

        const type = node.data?.estree?.body[0].type;

        return (
          type === "ExportNamedDeclaration" ||
          type === "ExportDefaultDeclaration" ||
          type === "ExportAllDeclaration"
        );
      });
    };
  }

  function removeImports() {
    return (tree: Root): undefined => {
      // remove import declarations
      remove(tree, (node) => {
        // type predicate
        if (!isLiteral(node)) return;

        // type predicate
        if (!isMdxjsEsm(node)) return;

        const type = node.data?.estree?.body[0].type;

        return type === "ImportDeclaration";
      });
    };
  }

  return;
};

export default RemarkMdxRemoveEsm;
