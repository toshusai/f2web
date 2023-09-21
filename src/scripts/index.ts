import { config } from "dotenv";
config();
import * as Figma from "figma-api";
import { figmaNodeToDomNode } from "../plugin/converter/figmaNodeToDomNode";
import { parseDomName } from "../plugin/converter/parseDomName";
import { DomNode } from "../plugin/types/DomNode";

async function main() {
  const api = new Figma.Api({
    personalAccessToken: process.env.FIGMA_TOKEN ?? "",
  });
  const fileKey = process.env.FILE_KEY ?? "";

  const file = await api.getFile(fileKey);
  let target = findComponentSetNode(file.document as any, "ButtonBase");

  if (!target) return;

  const ctx: any = {
    root: target,
    ignoreInstance: true,
    ...parseDomName(target.name),
  };
  const rawDomNodes = (
    await Promise.all(
      target.children.map((child) => figmaNodeToDomNode(child, ctx))
    )
  ).filter((x) => x !== null) as DomNode[];
  console.log(rawDomNodes);
}

function findComponentSetNode(
  node: SceneNode | DocumentNode,
  name: string
): ComponentSetNode | null {
  if ("children" in node) {
    for (const child of node.children) {
      if (child.type === "COMPONENT_SET") {
        if (child.name === name) {
          return child;
        }
      }
      const r = findComponentSetNode(child as any, name);
      if (r) return r;
    }
  }
  return null;
}

// https://www.figma.com/file/A6OzjYZ4c9mhh5tZocNjnM/shu-web-dev?type=design&node-id=30-13975&mode=design&t=RRLGV32Myi8e0H3E-0

main();
