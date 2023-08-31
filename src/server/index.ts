import express from "express";
import fs from "fs";

const app = express();

app.use(express.json());

app.use((_, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  res.header("Access-Control-Allow-Methods", "*");
  next();
});

app.post("/api/v1/create", (req, res) => {
  const src = req.body.src;
  const name = req.body.name;
  const stories = req.body.stories;
  const colorsCss = req.body.colorsCss;
  const tailwindColors = req.body.tailwindColors;
  fs.writeFileSync(`./src/stories/${name}.tsx`, src);
  fs.writeFileSync(`./src/stories/${name}.stories.tsx`, stories);
  fs.writeFileSync(`./.storybook/colors.css`, colorsCss);
  fs.writeFileSync(`./color.js`, tailwindColors);
  res.send({
    status: "ok",
  });
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
