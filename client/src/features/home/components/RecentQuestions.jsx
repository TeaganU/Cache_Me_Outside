import { Link } from "react-router-dom";
import { PATHS } from "../../../app/Routes";
import { useEffect, useState } from "react";
import RecentQuestionsCard from "./RecentQuestionsCard";

export default function RecentQuestions() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchRecentQuestions() {
            setLoading(true);
            setError("");

            try {
                const response = await fetch("/api/posts?type=Question");

                if (!response.ok) {
                    throw new Error("Failed to fetch posts");
                }

                const data = await response.json();
                const recentPosts = data.slice(0, 5);

                setPosts(recentPosts);
            } catch {
                setError("Could not load recent questions.");
                setPosts([]);
            } finally {
                setLoading(false);
            }
        }

        fetchRecentQuestions();
    }, []);

    return (
        <section className="flex flex-col bg-gray-50 border 2px black min-h-20 px-3 py-1.5 gap-2">
            <div className="flex justify-between">
                <h1 className="font-bold">
                    Recent Questions
                </h1>

                <Link
                    to={`${PATHS.SKILLS}?type=${encodeURIComponent("Question")}`}
                    className="text-gray-700">
                    View All
                </Link>
            </div>

            <div className="flex flex-col gap-3 overflow-y-auto flex-1 p-2">
                {loading && <p className="text-sm text-gray-600">Loading recent questions...</p>}

                {error && <p className="text-sm text-red-600">{error}</p>}

                {!loading && !error && posts.map((post) => (
                    <RecentQuestionsCard
                        key={post._id}
                        post={post}
                    />
                ))}

                {!loading && !error && posts.length === 0 && (
                    <p className="text-sm text-gray-600">No questions posted yet.</p>
                )}
            </div>
        </section>
    )
}
