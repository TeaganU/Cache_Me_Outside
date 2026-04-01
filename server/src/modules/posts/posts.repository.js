import Post from "../../models/Post.js";

// Normalizes a query value into a clean array so Express can accept
// either a single query param or repeated params like ?category=A&category=B.
function normalizeToArray(value) {
  if (value === undefined || value === null) {
    return [];
  }

  const values = Array.isArray(value) ? value : [value];

  return values
    .map((item) => String(item).trim())
    .filter((item) => item !== "" && item !== "All");
}

// Builds the Mongo query object from the request filters.
function buildQuery({ search, category, type }) {
  const query = {};
  const categories = normalizeToArray(category);
  const types = normalizeToArray(type);

  // Match any selected categories.
  if (categories.length > 0) {
    query.category = { $in: categories };
  }

  // Match any selected post types.
  if (types.length > 0) {
    query.type = { $in: types };
  }

  // Search across the main text fields using a case-insensitive regex.
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
  // Generate the next numeric id based on the current highest one.
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
  // Update the matching post and return the new version after the change.
  return await Post.findOneAndUpdate(
    { id },
    { $set: updates },
    { new: true }
  ).lean();
}

export async function deletePostById(id) {
  // deleteOne returns metadata, so convert it to a simple true/false result.
  const result = await Post.deleteOne({ id });
  return result.deletedCount === 1;
}
