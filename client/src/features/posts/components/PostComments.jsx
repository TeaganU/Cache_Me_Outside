import { RelativeTime } from "../../../lib/RelativeTime";
import { useState } from "react";
import { getImageUrl } from "../../../lib/getImageUrl";
import ReportModal from "../../reports/components/ReportModal";

export default function PostComments({
    postId,
    comments,
    highlightedCommentId,
    isLoggedIn,
    currentUserId,
    currentUserRole,
    isCreatingComment,
    commentText,
    onCommentTextChange,
    onOpenCreateComment,
    onCancelCreateComment,
    onSubmitComment,
    onEditComment,
    onDeleteComment
}) {
    const safeComments = comments ?? [];
    const [activeCommentId, setActiveCommentId] = useState("");
    const [message, setMessage] = useState("");
    const [editingCommentId, setEditingCommentId] = useState("");
    const [editingText, setEditingText] = useState("");
    const [busyCommentId, setBusyCommentId] = useState("");

    return (
        <section className="mt-6 border border-gray-300 bg-white p-4">
            <div className="flex items-center justify-between gap-3">
                <h2 className="text-xl font-semibold text-gray-900">Comments</h2>

                {isLoggedIn && !isCreatingComment && (
                    <button
                        type="button"
                        onClick={onOpenCreateComment}
                        className="bg-black px-3 py-2 text-sm text-white hover:cursor-pointer"
                    >
                        Create Comment
                    </button>
                )}
            </div>

            {!isLoggedIn && (
                <p className="mt-4 text-sm text-gray-600">
                    Log in to add a comment.
                </p>
            )}

            {safeComments.length === 0 && !isCreatingComment && (
                <p className="mt-4 text-sm text-gray-600">No comments</p>
            )}

            {safeComments.length > 0 && (
                <div className="mt-4 space-y-3">
                    {safeComments.map((comment, index) => {
                        const username = comment.authorUsername || "Guest";
                        const initials = username.slice(0, 2).toUpperCase();
                        const canManageComment =
                            isLoggedIn &&
                            currentUserId &&
                            (currentUserId === comment.authorId || currentUserRole === "admin");
                        const canReportComment =
                            isLoggedIn &&
                            currentUserId &&
                            currentUserId !== comment.authorId &&
                            currentUserRole !== "admin";

                        return (
                            <div
                                key={comment._id ?? index}
                                id={comment._id ? `comment-${comment._id}` : undefined}
                                className={`border p-3 ${
                                    highlightedCommentId === comment._id
                                        ? "border-blue-500 bg-blue-50"
                                        : "border-gray-200"
                                }`}
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex items-center gap-3">
                                        {comment.authorProfileImage ? (
                                            <img
                                                src={getImageUrl(comment.authorProfileImage)}
                                                alt={`${username} profile`}
                                                className="h-10 w-10 rounded-full border object-cover"
                                            />
                                        ) : (
                                            <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-black text-white text-sm">
                                                {initials}
                                            </div>
                                        )}

                                        <span className="text-sm font-medium text-gray-800">
                                            {username}
                                        </span>
                                    </div>

                                    <span className="text-xs text-gray-500">
                                        {RelativeTime(comment.createdAt)}
                                    </span>
                                </div>

                                {editingCommentId === comment._id ? (
                                    <div className="mt-2 space-y-3">
                                        <textarea
                                            value={editingText}
                                            onChange={(event) => setEditingText(event.target.value)}
                                            rows={3}
                                            className="w-full border border-gray-300 px-3 py-2 text-sm"
                                        />
                                        <div className="flex gap-3">
                                            <button
                                                type="button"
                                                disabled={busyCommentId === comment._id}
                                                onClick={async () => {
                                                    setBusyCommentId(comment._id);
                                                    const ok = await onEditComment(comment._id, editingText);
                                                    setBusyCommentId("");

                                                    if (ok) {
                                                        setEditingCommentId("");
                                                        setEditingText("");
                                                    }
                                                }}
                                                className="bg-black px-3 py-2 text-sm text-white disabled:cursor-not-allowed hover:cursor-pointer"
                                            >
                                                Save
                                            </button>
                                            <button
                                                type="button"
                                                disabled={busyCommentId === comment._id}
                                                onClick={() => {
                                                    setEditingCommentId("");
                                                    setEditingText("");
                                                }}
                                                className="border border-gray-300 px-3 py-2 text-sm disabled:cursor-not-allowed hover:cursor-pointer"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="mt-2 whitespace-pre-wrap text-sm text-gray-700">
                                        {comment.text}
                                    </p>
                                )}

                                <div className="mt-3 flex flex-wrap gap-3">
                                    {canManageComment && editingCommentId !== comment._id && (
                                        <>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setEditingCommentId(comment._id);
                                                    setEditingText(comment.text || "");
                                                }}
                                                className="text-sm text-gray-700 hover:cursor-pointer hover:underline"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                type="button"
                                                disabled={busyCommentId === comment._id}
                                                onClick={async () => {
                                                    setBusyCommentId(comment._id);
                                                    await onDeleteComment(comment._id);
                                                    setBusyCommentId("");
                                                }}
                                                className="text-sm text-red-600 disabled:cursor-not-allowed hover:cursor-pointer hover:underline"
                                            >
                                                Delete
                                            </button>
                                        </>
                                    )}

                                    {canReportComment && (
                                        <button
                                            type="button"
                                            onClick={() => setActiveCommentId(comment._id)}
                                            className="text-sm text-red-600 hover:cursor-pointer hover:underline"
                                        >
                                            Report
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {message && <p className="mt-4 text-sm text-gray-700">{message}</p>}

            {isLoggedIn && isCreatingComment && (
                <div className="mt-4 flex flex-col gap-3">
                    <textarea
                        value={commentText}
                        onChange={(e) => onCommentTextChange(e.target.value)}
                        rows={4}
                        placeholder="Write a comment..."
                        className="border border-gray-300 px-3 py-2"
                    />

                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={onSubmitComment}
                            className="bg-black px-3 py-2 text-sm text-white hover:cursor-pointer"
                        >
                            Add Comment
                        </button>
                        <button
                            type="button"
                            onClick={onCancelCreateComment}
                            className="border border-gray-300 px-3 py-2 text-sm hover:cursor-pointer"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            <ReportModal
                isOpen={Boolean(activeCommentId)}
                title="Report Comment"
                description="Tell us why this comment should be reviewed."
                endpoint={`/reports/posts/${postId}/comments/${activeCommentId}`}
                onClose={() => setActiveCommentId("")}
                onSubmitted={() => setMessage("Report submitted.")}
            />
        </section>
    );
}