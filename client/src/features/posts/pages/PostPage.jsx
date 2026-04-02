import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { RelativeTime } from "../../../lib/RelativeTime";
import { editableCategoryOptions, editablePostTypeOptions} from "../../skills/components/skillsOptions";
import PostComments from "../components/PostComments";
import { PATHS } from "../../../app/Routes";

export default function PostPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [actionMessage, setActionMessage] = useState("");
    const [editing, setEditing] = useState(false);
    const [isCreatingComment, setIsCreatingComment] = useState(false);
    const [commentText, setCommentText] = useState("");
    const [editForm, setEditForm] = useState({
        title: "",
        content: "",
        category: "Hiking",
        type: "question"
    });

    useEffect(() => {
        async function fetchPost() {
            setLoading(true);
            setError("");

            try {
                const response = await fetch(`/api/posts/${id}`);

                if (!response.ok) {
                    throw new Error("Could not load post.");
                }

                const data = await response.json();
                setPost(data);
                setEditForm({
                    title: data.title || "",
                    content: data.content || "",
                    category: data.category || "Hiking",
                    type: data.type || "question"
                });
            } catch {
                setError("Could not load post.");
            } finally {
                setLoading(false);
            }
        }

        fetchPost();
    }, [id]);

    const handleEditChange = (e) => {
        setEditForm({
            ...editForm,
            [e.target.name]: e.target.value
        });
    };

    const saveEdit = async () => {
        try {
            const response = await fetch(`/api/posts/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(editForm)
            });

            const data = await response.json();

            if (!response.ok) {
                setActionMessage(data.message || "Could not update post.");
                return;
            }

            setPost(data.post);
            setEditing(false);
            setActionMessage("");
        } catch {
            setActionMessage("Could not update post.");
        }
    };

    const deletePost = async () => {
        try {
            const response = await fetch(`/api/posts/${id}`, {
                method: "DELETE"
            });

            const data = await response.json();

            if (!response.ok) {
                setActionMessage(data.message || "Could not delete post.");
                return;
            }

            navigate("/skills");
        } catch {
            setActionMessage("Could not delete post.");
        }
    };

    const likePost = async () => {
        if (!post) return;

        try {
            const response = await fetch(`/api/posts/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    likes: (post.likes || 0) + 1
                })
            });

            const data = await response.json();

            if (!response.ok) {
                setActionMessage(data.message || "Could not like post.");
                return;
            }

            setPost(data.post);
            setActionMessage("");
        } catch {
            setActionMessage("Could not like post.");
        }
    };

    const submitComment = async () => {
        if (!post || !commentText.trim()) {
            return;
        }

        const nextComments = [
            ...(post.comments || []),
            {
                text: commentText.trim(),
                author: "Guest",
                timestamp: new Date().toISOString()
            }
        ];

        try {
            const response = await fetch(`/api/posts/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    comments: nextComments
                })
            });

            const data = await response.json();

            if (!response.ok) {
                setActionMessage(data.message || "Could not add comment.");
                return;
            }

            setPost(data.post);
            setCommentText("");
            setIsCreatingComment(false);
            setActionMessage("");
        } catch {
            setActionMessage("Could not add comment.");
        }
    };

    if (loading) {
        return <div className="mx-auto max-w-4xl px-6 py-8 text-gray-600">Loading...</div>;
    }

    if (error || !post) {
        return <div className="mx-auto max-w-4xl px-6 py-8 text-red-600">{error || "Post not found."}</div>;
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="mx-auto max-w-4xl px-6 py-8">
                <p className="text-sm text-gray-500">
                    <Link to={PATHS.HOME} className="hover:underline">
                        Home
                    </Link>{" "}
                    &gt;
                    <Link to={PATHS.SKILLS} className="hover:underline">
                        Skills
                    </Link>{" "}
                    &gt; Post
                </p>

                {actionMessage && <p className="mt-4 text-red-600">{actionMessage}</p>}

                <article className="mt-4 border border-gray-300 bg-white p-5">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                        <div className="text-sm text-gray-600">
                            <span>{post.category}</span>
                            <span className="mx-2">|</span>
                            <span>{post.type}</span>
                        </div>
                        <span className="text-sm text-gray-500">
                            {RelativeTime(post.timestamp)}
                        </span>
                    </div>

                    {editing ? (
                        <div className="mt-4 flex flex-col gap-3">
                            <input
                                type="text"
                                name="title"
                                value={editForm.title}
                                onChange={handleEditChange}
                                className="border border-gray-300 px-3 py-2"
                            />

                            <div className="flex flex-col gap-3 sm:flex-row">
                                <select
                                    name="category"
                                    value={editForm.category}
                                    onChange={handleEditChange}
                                    className="border border-gray-300 px-3 py-2"
                                >
                                    {editableCategoryOptions.map((category) => (
                                        <option key={category} value={category}>
                                            {category}
                                        </option>
                                    ))}
                                </select>

                                <select
                                    name="type"
                                    value={editForm.type}
                                    onChange={handleEditChange}
                                    className="border border-gray-300 px-3 py-2"
                                >
                                    {editablePostTypeOptions.map((type) => (
                                        <option key={type.value} value={type.value}>
                                            {type.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <textarea
                                name="content"
                                value={editForm.content}
                                onChange={handleEditChange}
                                rows={8}
                                className="border border-gray-300 px-3 py-2"
                            />
                        </div>
                    ) : (
                        <>
                            <h1 className="mt-4 text-3xl font-semibold text-gray-900">
                                {post.title}
                            </h1>

                            <p className="mt-3 whitespace-pre-wrap text-sm text-gray-700">
                                {post.content}
                            </p>
                        </>
                    )}

                    <div className="mt-5 border-t border-gray-200 pt-4">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-full bg-gray-200" />
                                <span className="text-sm font-medium text-gray-800">
                                    {post.author || "Author Name"}
                                </span>
                            </div>

                            <div className="flex flex-wrap gap-3">
                                <button
                                    type="button"
                                    onClick={likePost}
                                    className="border border-gray-300 px-3 py-2 text-sm"
                                >
                                    Like ({post.likes || 0})
                                </button>

                                {editing ? (
                                    <>
                                        <button
                                            type="button"
                                            onClick={saveEdit}
                                            className="bg-black px-3 py-2 text-sm text-white"
                                        >
                                            Save
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setEditing(false)}
                                            className="border border-gray-300 px-3 py-2 text-sm"
                                        >
                                            Cancel
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => setEditing(true)}
                                        className="border border-gray-300 px-3 py-2 text-sm"
                                    >
                                        Edit
                                    </button>
                                )}

                                <button
                                    type="button"
                                    onClick={deletePost}
                                    className="border border-red-300 px-3 py-2 text-sm text-red-600"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </article>

                <PostComments
                    comments={post.comments || []}
                    isCreatingComment={isCreatingComment}
                    commentText={commentText}
                    onCommentTextChange={setCommentText}
                    onOpenCreateComment={() => setIsCreatingComment(true)}
                    onCancelCreateComment={() => {
                        setIsCreatingComment(false);
                        setCommentText("");
                    }}
                    onSubmitComment={submitComment}
                />
            </div>
        </div>
    );
}
