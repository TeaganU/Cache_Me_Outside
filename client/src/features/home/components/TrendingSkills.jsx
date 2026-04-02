import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PATHS } from "../../../app/Routes";
import TrendingSkillsCard from "./TrendingSkillsCard";

export default function TrendingSkills() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchTrendingSkills() {
            setLoading(true);
            setError("");

            try {
                const response = await fetch("/api/posts");

                if (!response.ok) {
                    throw new Error("Failed to fetch posts");
                }

                const data = await response.json();
                const recentPosts = [...data]
                    // Currently sorting by date until we add in post metrics
                    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                    .slice(0, 6);

                setPosts(recentPosts);
            } catch {
                setError("Could not load trending skills.");
                setPosts([]);
            } finally {
                setLoading(false);
            }
        }

        fetchTrendingSkills();
    }, []);

    return (
        <section className="flex flex-col border 2px black min-h-40 px-3 py-1.5 gap-y-2">
            <div className="flex justify-between">
                <h1 className="font-bold">
                    Trending Skills
                </h1>

                <Link
                    to={PATHS.SKILLS}
                    className="text-gray-700">
                    View All
                </Link>
            </div>
            <div className="flex flex-row justify-between gap-3 overflow-x-auto flex-1 p-2">
                {loading && <p className="text-sm text-gray-600">Loading trending skills...</p>}

                {error && <p className="text-sm text-red-600">{error}</p>}

                {!loading && !error && posts.map((post) => (
                    <TrendingSkillsCard
                        key={post._id ?? post.id}
                        post={post}
                    />
                ))}

                {!loading && !error && posts.length === 0 && (
                    <p className="text-sm text-gray-600">No skills posts yet.</p>
                )}
            </div>
        </section>
    )
}
