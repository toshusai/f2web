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

const DIR = "";

app.post("/api/v1/create", (req, res) => {
  const src = req.body.src;
  const name = req.body.name;
  const stories = req.body.stories;
  const colorsCss = req.body.colorsCss;
  const tailwindColors = req.body.tailwindColors;
  fs.mkdirSync(`${DIR}/components/react/${name}`, { recursive: true });
  fs.writeFileSync(`${DIR}/components/react/${name}/index.tsx`, src);
  fs.writeFileSync(
    `${DIR}/components/react/${name}/index.stories.tsx`,
    stories
  );
  fs.writeFileSync(`${DIR}/global.css`, colorsCss);
  fs.writeFileSync(`${DIR}/colors.js`, tailwindColors);
  res.send({
    status: "ok",
  });
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
