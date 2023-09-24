import { postPreviewMessage, postSelectMessage } from "./postPreviewMessage";

export function initFigmaPlugin() {
  if (typeof figma !== "undefined") {
    figma.showUI(__html__);
    figma.ui.resize(512, 512);
    figma.ui.on("message", (msg: any) => {
      if (msg.type === "resize") {
        figma.ui.resize(msg.size.w, msg.size.h);
        figma.clientStorage.setAsync("size", msg.size).catch(() => {});
      }
      if (msg.type === "generate") {
        postPreviewMessage().catch((error) => {
          figma.ui.postMessage({
            type: "error",
            message: error.toString(),
          });
        });
      }
    });
    figma.on("selectionchange", async () => {
      await postSelectMessage();
    });
    figma.on("run", async () => {
      await postSelectMessage();
    });
    figma.on("documentchange", () => {});
  }
}
