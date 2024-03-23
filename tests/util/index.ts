import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkMdx from "remark-mdx";
import gfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import type { VFileCompatible, VFile } from "vfile";

import plugin, { type MdxRemoveEsmOptions } from "../../src";

const compilerCreator = (options?: MdxRemoveEsmOptions) =>
  unified()
    .use(remarkParse)
    .use(remarkMdx)
    .use(gfm)
    .use(plugin, options)
    .use(remarkRehype)
    .use(rehypeStringify);

export const process = async (
  content: VFileCompatible,
  options?: MdxRemoveEsmOptions,
): Promise<VFile> => {
  return compilerCreator(options).process(content);
};
