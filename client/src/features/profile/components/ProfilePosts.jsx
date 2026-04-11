import { useEffect, useState } from "react";
import { apiClient } from "../../../lib/ApiClient";
import ProfilePostsCard from "./ProfilePostsCard";
import ProfileCommentsCard from "./ProfileCommentsCard";

export default function ProfilePosts() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [postView, setPostView] = useState("posts");

    useEffect(() => {
        async function fetchProfilePosts() {
            setLoading(true);
            setError("");

            try {
                const data = postView === "posts"
                    ? await apiClient.get("/profile/me/posts")
                    : await apiClient.get("/profile/me/comments");

                setItems(postView === "posts" ? (data.posts ?? []) : (data.comments ?? []));
            } catch {
                setError(`Could not load ${postView}.`);
                setItems([]);
            } finally {
                setLoading(false);
            }
        }

        fetchProfilePosts();
    }, [postView]);

    return (
        <section className="border border-gray-400 bg-white p-4">
            <div className="p-2">
                <div className="flex w-fit flex-row border border-gray-300 bg-gray-100 p-1">
                <button
                    type="button"
                    onClick={() => setPostView("posts")}
                    className={`px-4 py-2 text-sm font-bold uppercase tracking-wide transition hover:cursor-pointer ${postView === "posts"
                        ? "bg-black text-white shadow-sm"
                        : "bg-transparent text-gray-600 hover:bg-white hover:text-black"
                        }`}>
                    Posts
                </button>
                <button
                    type="button"
                    onClick={() => setPostView("comments")}
                    className={`px-4 py-2 text-sm font-bold uppercase tracking-wide transition hover:cursor-pointer ${postView === "comments"
                        ? "bg-black text-white shadow-sm"
                        : "bg-transparent text-gray-600 hover:bg-white hover:text-black"
                        }`}>
                    Comments
                </button>
                </div>
            </div>
            <div className="flex flex-col justify-between gap-3 overflow-x-auto flex-1 p-2">
                {loading &&
                    <p className="text-sm text-gray-600">
                        Loading {postView === "posts" ? "posts" : "comments"}...
                    </p>}

                {error && <p className="text-sm text-red-600">{error}</p>}

                {!loading && !error && items.map((item) => (
                    postView === "posts"
                        ?
                        <ProfilePostsCard
                            key={item._id}
                            post={item}
                        />
                        :
                        <ProfileCommentsCard
                            key={item._id}
                            comment={item}
                        />
                ))}

                {!loading && !error && items.length === 0 && (
                    <p className="text-sm text-gray-600">No {postView === "posts" ? "posts" : "comments"} yet.</p>
                )}
            </div>
        </section>
    )
}
