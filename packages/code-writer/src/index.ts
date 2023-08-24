import express from "express";
import fs from "fs";

const app = express();

app.use(express.json());

app.use((_req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  next();
});

const dir = "../storybook/src/stories";

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
