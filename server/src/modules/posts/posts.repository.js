import Post from "../../models/Post.js";

function buildQuery({ search, category, type }) {
  const query = {};

  if (category && String(category).trim() !== "") {
    query.category = String(category).trim();
  }

  if (type && String(type).trim() !== "") {
    query.type = String(type).trim();
  }

  if (search && String(search).trim() !== "") {
    const q = String(search).trim();
    const rx = new RegExp(q, "i");

    query.$or = [
      { title: rx },
      { content: rx },
      { author: rx },
      { category: rx },
      { type: rx }
    ];
  }

  return query;
}

export async function findPosts(filters = {}) {
  const query = buildQuery(filters);
  return await Post.find(query).sort({ timestamp: -1 }).lean();
}

export async function addPost(newPost) {
  const max = await Post.findOne().sort({ id: -1 }).select("id").lean();
  const nextId = (max?.id ?? 0) + 1;

  const doc = new Post({
    id: nextId,
    author: "Guest",
    timestamp: new Date().toISOString(),
    ...newPost
  });

  return await doc.save();
}

export async function updatePostById(id, updates) {
  return await Post.findOneAndUpdate(
    { id },
    { $set: updates },
    { new: true }
  ).lean();
}

export async function deletePostById(id) {
  const result = await Post.deleteOne({ id });
  return result.deletedCount === 1;
}