import { postPreviewMessage } from "./postPreviewMessage";

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
    figma.on("selectionchange", async () => {
      await postPreviewMessage();
    });
    figma.on("run", async () => {
      await postPreviewMessage();
    });
    figma.on("documentchange", () => {});
  }
}
