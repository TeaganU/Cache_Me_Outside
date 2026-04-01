import mongoose from "mongoose";
import dotenv from "dotenv";
import Post from "./models/Post.js";

dotenv.config();

const samplePosts = [
  {
    "id": 1,
    "author": "John Doe",
    "timestamp": new Date().toISOString(),
    "type": "Skill Guide",
    "category": "Rock Climbing",
    "title": "Rock Climbing Basics",
    "content": "Learn how to climb safely."
  },
  {
    "id": 2,
    "author": "Jane Doe",
    "timestamp": new Date().toISOString(),
    "type": "Event",
    "category": "Skiing",
    "title": "Backcountry Ski Trip",
    "content": "Join us on a ski trip in the Revelstoke backcountry."
  },
  {
    "id": 3,
    "author": "Owen",
    "timestamp": new Date().toISOString(),
    "type": "Discussion",
    "category": "Hiking",
    "title": "Best Hiking Trails Near Kelowna",
    "content": "Looking for scenic hikes around the Okanagan."
  },
  {
    "id": 4,
    "author": "Jane Doe",
    "timestamp": new Date().toISOString(),
    "type": "Skill Guide",
    "category": "Camping",
    "title": "How to Set Up a Campsite",
    "content": "Tips for choosing and setting up a safe campsite."
  },
  {
    "id": 5,
    "author": "Teagan",
    "timestamp": new Date().toISOString(),
    "type": "Event",
    "category": "Running",
    "title": "Trail Running Meetup",
    "content": "Join our weekly group trail run this Sunday."
  },
  {
    "id": 6,
    "author": "John Doe",
    "timestamp": new Date().toISOString(),
    "type": "Discussion",
    "category": "Kayaking",
    "title": "Best Lakes for Kayaking",
    "content": "Where are the best calm lakes for kayaking in BC?"
  },
  {
    "id": 7,
    "author": "Santa",
    "timestamp": new Date().toISOString(),
    "type": "Skill Guide",
    "category": "Skiing",
    "title": "Beginner Skiing Tips",
    "content": "Learn balance, turning, and stopping techniques."
  },
  {
    "id": 8,
    "author": "COSC360 Man",
    "timestamp": new Date().toISOString(),
    "type": "Question",
    "category": "Rock Climbing",
    "title": "How do I improve grip strength for climbing?",
    "content": "Any tips or exercises that helped you improve grip strength?"
  },
  {
    "id": 9,
    "author": "Someone",
    "timestamp": new Date().toISOString(),
    "type": "Discussion",
    "category": "Mountaineering",
    "title": "Getting Started with Mountaineering",
    "content": "What gear and skills do beginners need?"
  },
  {
    "id": 10,
    "author": "Someone2",
    "timestamp": new Date().toISOString(),
    "type": "Skill Guide",
    "category": "Hiking",
    "title": "Packing Essentials for Day Hikes",
    "content": "What to bring on a safe and enjoyable day hike."
  }
];

async function run() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    await Post.deleteMany({});
    await Post.insertMany(samplePosts);

    console.log("Sample posts inserted");
    process.exit(0);
  } catch (err) {
    console.error("Seed error:", err);
    process.exit(1);
  }
}

run();