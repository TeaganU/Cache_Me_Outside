import express from "express";
import cors from "cors";
import postsRoutes from "./modules/posts/posts.routes.js";
import mongoose from "mongoose";
import dotenv from "dotenv";

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

dotenv.config({path: "./server/src/.env"});

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));
