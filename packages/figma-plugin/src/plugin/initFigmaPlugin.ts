import { createBySelection } from "./createBySelection";
import { postCreate } from "./postCreate";

export function initFigmaPlugin() {
  if (typeof figma !== "undefined") {
    figma.showUI(__html__);
    figma.ui.resize(512, 256);
    figma.ui.on("message", (msg: any) => {
      if (msg.type === "resize") {
        figma.ui.resize(msg.size.w, msg.size.h);
        figma.clientStorage.setAsync("size", msg.size).catch(() => {});
      }
    });
    figma.on("selectionchange", () => {
      postCreate();
      createBySelection();
      const node = figma.currentPage.selection[0] as InstanceNode
      const t = node.componentProperties[0]
      if(t.type === "INSTANCE_SWAP"){
      }
    });
    figma.on("documentchange", () => {
      postCreate();
      createBySelection();
    });
  }
}
