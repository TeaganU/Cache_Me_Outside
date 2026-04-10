import mongoose from "mongoose";
import Post from "../../models/Post.js";

function normalizeToArray(value) {
  if (value === undefined || value === null) {
    return [];
  }

  const values = Array.isArray(value) ? value : [value];

  return values
    .map((item) => String(item).trim())
    .filter((item) => item !== "" && item !== "All");
}

function buildQuery({ search, category, type, authorId }) {
  const query = {};
  const categories = normalizeToArray(category);
  const types = normalizeToArray(type);

  if (categories.length > 0) {
    query.category = { $in: categories };
  }

  if (types.length > 0) {
    query.type = { $in: types };
  }

  if (authorId) {
    query.authorId = authorId;
  }

  if (search && String(search).trim() !== "") {
    const q = String(search).trim();
    const rx = new RegExp(q, "i");

    query.$or = [
      { title: rx },
      { content: rx },
      { authorUsername: rx },
      { category: rx },
      { type: rx }
    ];
  }

  return query;
}

export async function findPosts(filters = {}) {
  const query = buildQuery(filters);
  return await Post.find(query).sort({ createdAt: -1 }).lean();
}

export async function findPostById(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return null;
  }

  return await Post.findById(id).lean();
}

export async function findPostDocumentById(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return null;
  }

  return await Post.findById(id);
}

export async function addPost(newPost) {
  const doc = new Post({
    likes: 0,
    views: 0,
    comments: [],
    ...newPost,
  });

  return await doc.save();
}

export async function updatePostById(id, updates) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return null;
  }

  return await Post.findByIdAndUpdate(
    id,
    { $set: updates },
    { new: true }
  ).lean();
}

export async function setPostLikesById(id, likes) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return null;
  }

  return await Post.findByIdAndUpdate(
    id,
    { $set: { likes } },
    { new: true }
  ).lean();
}

export async function deletePostById(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return false;
  }

  const result = await Post.deleteOne({ _id: id });
  return result.deletedCount === 1;
}

export async function incrementPostViews(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return null;
  }

  return await Post.findByIdAndUpdate(
    id,
    { $inc: { views: 1 } },
    { new: true }
  ).lean();
}

