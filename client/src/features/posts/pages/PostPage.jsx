import { useEffect, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { RelativeTime } from "../../../lib/RelativeTime";
import {
    editableCategoryOptions,
    editablePostTypeOptions,
} from "../../skills/components/skillsOptions";
import PostComments from "../components/PostComments";
import { PATHS } from "../../../app/Routes";
import { apiClient } from "../../../lib/ApiClient";
import { useAuth } from "../../../lib/AuthContext";
import { getImageUrl } from "../../../lib/getImageUrl";
import ReportModal from "../../reports/components/ReportModal";

export default function PostPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { isLoggedIn, user } = useAuth();
    const highlightedCommentId = searchParams.get("commentId") || "";

    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [actionMessage, setActionMessage] = useState("");
    const [editing, setEditing] = useState(false);
    const [isCreatingComment, setIsCreatingComment] = useState(false);
    const [isReportingPost, setIsReportingPost] = useState(false);
    const [isLikingPost, setIsLikingPost] = useState(false);
    const [commentText, setCommentText] = useState("");
    const [editForm, setEditForm] = useState({
        title: "",
        content: "",
        category: "Hiking",
        type: "question",
    });
    const canModifyPost =
        isLoggedIn &&
        user &&
        post &&
        (user.id === post.authorId || user.role === "admin");
    const canReportPost =
        isLoggedIn &&
        user &&
        post &&
        user.id !== post.authorId;

    useEffect(() => {
        let isMounted = true;

        async function fetchPost() {
            setLoading(true);
            setError("");

            try {
                const response = await fetch(`/api/posts/${id}`);

                if (!response.ok) {
                    throw new Error("Could not load post.");
                }

                const data = await response.json();

                if (!isMounted) return;

                setPost(data);
                setEditForm({
                    title: data.title || "",
                    content: data.content || "",
                    category: data.category || "Hiking",
                    type: data.type || "question",
                });

                if (isLoggedIn) {
                    try {
                        const likeStatus = await apiClient.get(`/like/${id}/me`);

                        if (isMounted) {
                            setPost((current) => current ? {
                                ...current,
                                likes: likeStatus.likesCount,
                                likedByCurrentUser: likeStatus.liked,
                            } : current);
                        }
                    } catch {
                        // Ignore like status errors so the page still loads
                    }
                }

                try {
                    const viewResponse = await fetch(`/api/posts/${id}/view`, {
                        method: "POST",
                    });

                    if (viewResponse.ok) {
                        const viewData = await viewResponse.json();

                        if (isMounted && viewData.post) {
                            setPost((current) => current ? {
                                ...viewData.post,
                                likedByCurrentUser: current.likedByCurrentUser,
                            } : viewData.post);
                        }
                    }
                } catch {
                    // Ignore view count errors so the page still loads
                }
            } catch {
                if (isMounted) {
                    setError("Could not load post.");
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        }

        fetchPost();

        return () => {
            isMounted = false;
        };
    }, [id, isLoggedIn]);

    useEffect(() => {
        if (!highlightedCommentId || !post) {
            return;
        }

        const target = document.getElementById(`comment-${highlightedCommentId}`);

        if (target) {
            target.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    }, [highlightedCommentId, post]);

    const handleEditChange = (e) => {
        setEditForm({
            ...editForm,
            [e.target.name]: e.target.value,
        });
    };

    const saveEdit = async () => {
        try {
            const data = await apiClient.patch(`/posts/${id}`, editForm);
            setPost(data.post);
            setEditing(false);
            setActionMessage("");
        } catch (error) {
            setActionMessage(error?.data?.message || "Could not update post.");
        }
    };

    const deletePost = async () => {
        try {
            await apiClient.delete(`/posts/${id}`);
            navigate(PATHS.SKILLS);
        } catch (error) {
            setActionMessage(error?.data?.message || "Could not delete post.");
        }
    };

    const likePost = async () => {
        if (!post || isLikingPost) return;

        try {
            setIsLikingPost(true);
            const data = await apiClient.post(`/like/${id}`);
            setPost((current) => current ? {
                ...current,
                likes: data.likesCount,
                likedByCurrentUser: data.liked,
            } : current);
            setActionMessage("");
        } catch (error) {
            setActionMessage(error?.data?.message || "Could not like post.");
        } finally {
            setIsLikingPost(false);
        }
    };

    const submitComment = async () => {
        if (!post || !commentText.trim()) return;

        try {
            const data = await apiClient.post(`/posts/${id}/comments`, {
                text: commentText.trim(),
            });

            setPost((current) => ({
                ...current,
                comments: [...(current.comments ?? []), data.comment],
            }));

            setCommentText("");
            setIsCreatingComment(false);
            setActionMessage("");
        } catch (error) {
            console.error(error);
            setActionMessage(
                error?.data?.message || "Could not add comment."
            );
        }
    };

    if (loading) {
        return (
            <div className="mx-auto max-w-4xl px-6 py-8 text-gray-600">
                Loading...
            </div>
        );
    }

    if (error || !post) {
        return (
            <div className="mx-auto max-w-4xl px-6 py-8 text-red-600">
                {error || "Post not found."}
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="mx-auto max-w-4xl px-6 py-8">
                <p className="text-sm text-gray-500">
                    <Link to={PATHS.HOME} className="hover:underline">
                        Home
                    </Link>{" "}
                    &gt;{" "}
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
                            {RelativeTime(post.createdAt)}
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
                                
                                {post.authorProfileImage ? (
                                    
                                    <img
                                        src={getImageUrl(post.authorProfileImage)}
                                        alt={`${post.authorUsername} profile`}
                                        className="h-10 w-10 rounded-full border object-cover"
                                    />
                                ) : (
                                    <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-black text-white text-sm">
                                        {post.authorUsername.slice(0, 2)}
                                    </div>
                                )}
                                <span className="text-sm font-medium text-gray-800">
                                    {post.authorUsername || "Guest"}
                                </span>
                            </div>

                            <div className="flex flex-wrap gap-3">
                                <button
                                    type="button"
                                    onClick={likePost}
                                    disabled={isLikingPost}
                                    className="border border-gray-300 px-3 py-2 text-sm hover:cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {post.likedByCurrentUser ? "Unlike" : "Like"} ({post.likes || 0})
                                </button>

                                <div className="border border-gray-300 px-3 py-2 text-sm text-gray-700">
                                    Views ({post.views || 0})
                                </div>

                                {canModifyPost && (
                                    <>
                                        {editing ? (
                                            <>
                                                <button
                                                    type="button"
                                                    onClick={saveEdit}
                                                    className="bg-black px-3 py-2 text-sm text-white hover:cursor-pointer"
                                                >
                                                    Save
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setEditing(false)}
                                                    className="border border-gray-300 px-3 py-2 text-sm hover:cursor-pointer"
                                                >
                                                    Cancel
                                                </button>
                                            </>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={() => setEditing(true)}
                                                className="border border-gray-300 px-3 py-2 text-sm hover:cursor-pointer"
                                            >
                                                Edit
                                            </button>
                                        )}

                                        <button
                                            type="button"
                                            onClick={deletePost}
                                            className="border border-red-300 px-3 py-2 text-sm text-red-600 hover:cursor-pointer"
                                        >
                                            Delete
                                        </button>
                                    </>
                                )}

                                {canReportPost && (
                                    <button
                                        type="button"
                                        onClick={() => setIsReportingPost(true)}
                                        className="px-1 py-2 text-sm text-red-600 hover:cursor-pointer hover:underline"
                                    >
                                        Report
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </article>

                <PostComments
                    postId={post._id}
                    comments={post.comments || []}
                    highlightedCommentId={highlightedCommentId}
                    isLoggedIn={isLoggedIn}
                    currentUserId={user?.id || ""}
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

                <ReportModal
                    isOpen={isReportingPost}
                    title="Report Post"
                    description="Tell us why this post should be reviewed."
                    endpoint={`/reports/posts/${post._id}`}
                    onClose={() => setIsReportingPost(false)}
                    onSubmitted={() => setActionMessage("Report submitted.")}
                />
            </div>
        </div>
    );
}
