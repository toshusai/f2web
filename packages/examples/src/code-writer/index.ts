import express from "express";
import fs from "fs";
import { componentSetToStoriesTsx } from "../react";
import { componentSetToReactTailwindCode } from "../react-tailwind";
import { convertToCssAvairableName } from "./convertToCssAvairableName";
const app = express();

app.use(express.json());

app.use((_req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  next();
});

const dir = "./src/stories";

function linkParent(node: any) {
  if (node.children) {
    for (let child of node.children) {
      child.parent = node;
      linkParent(child);
    }
  }
}

function toHex(c: number) {
  const hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}
function colorToHex(color: RGB, alpha: number) {
  return `#${toHex(Math.round(color.r * 255))}${toHex(
    Math.round(color.g * 255)
  )}${toHex(Math.round(color.b * 255))}${toHex(Math.round(alpha * 255))}`;
}

app.post("/create", (req, res) => {
  const data = req.body.componentSet;
  linkParent(data);
  const ctx = req.body.context;
  const configSrc = createTailwindConfig(ctx);
  fs.writeFileSync(`./tailwind.config.js`, configSrc);

  const src = componentSetToReactTailwindCode(data);
  const stories = componentSetToStoriesTsx(data);
  fs.writeFileSync(`${dir}/${data.name}.tsx`, src);
  fs.writeFileSync(`${dir}/${data.name}.stories.tsx`, stories);
  res.send("success");
});

export function createTailwindConfig(ctx: any) {
  const colors = {};
  ctx.colors.forEach((color) => {
    colors[convertToCssAvairableName(color.name)] = colorToHex(
      color.paint.color,
      color.paint.opacity
    );
  });
  const tailwindConfig = {
    theme: {
      extend: {
        colors: colors,
      },
    },
  };
  return `/** @type {import('tailwindcss').Config} */
    export default {
      content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
      theme: ${JSON.stringify(tailwindConfig.theme, null, 2)},
     plugins: [],
    };
    `;
}

app.listen(3000, () => {
  console.log("server started");
});
