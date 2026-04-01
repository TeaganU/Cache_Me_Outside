import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    id: { type: Number, unique: true, index: true },
    author: { type: String, default: "Guest" },
    timestamp: { type: String, default: () => new Date().toISOString() },
    type: { type: String, required: true },
    category: { type: String, required: true },
    title: { type: String, required: true },
    content: { type: String, required: true }
  },
  { versionKey: false }
);

export default mongoose.model("Post", postSchema);