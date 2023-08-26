import express from "express";
import fs from "fs";
import { componentSetToReactCode, componentSetToStoriesTsx } from "../react";
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

app.post("/create", (req, res) => {
  const data = req.body;
  linkParent(data);
  const src = componentSetToReactCode(data);
  const stories = componentSetToStoriesTsx(data);
  fs.writeFileSync(`${dir}/${data.name}.tsx`, src);
  fs.writeFileSync(`${dir}/${data.name}.stories.tsx`, stories);
  res.send("success");
});

app.post("/write", (req, res) => {
  const name = req.body.name;
  const src = req.body.src;
  const stories = req.body.stories;
  fs.writeFileSync(`${dir}/${name}.tsx`, src);
  fs.writeFileSync(`${dir}/${name}.stories.tsx`, stories);
  res.send("success");
});

app.listen(3000, () => {
  console.log("server started");
});