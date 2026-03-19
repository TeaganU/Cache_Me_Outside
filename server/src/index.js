import express from "express";
import cors from "cors";
import postsRoutes from "./modules/posts/posts.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/posts", postsRoutes);

app.get("/", (req, res) => {
  res.send("API running");
});

app.listen(4000, () => {
  console.log("Server running on http://localhost:4000");
});
