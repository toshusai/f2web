import express from "express";
import fs from "fs";
import { config } from "dotenv";
config()

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
  const dir = process.env.TARGET_DIR;
  fs.mkdirSync(`${dir}/components/react/${name}`, { recursive: true });
  fs.writeFileSync(`${dir}/components/react/${name}/index.tsx`, src);
  fs.writeFileSync(
    `${dir}/components/react/${name}/index.stories.tsx`,
    stories
  );
  fs.writeFileSync(`${dir}/global.css`, colorsCss);
  fs.writeFileSync(`${dir}/colors.js`, tailwindColors);
  res.send({
    status: "ok",
  });
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
