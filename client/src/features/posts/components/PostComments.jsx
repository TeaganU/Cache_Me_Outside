import { RelativeTime } from "../../../lib/RelativeTime";

export default function PostComments({
    comments,
    isCreatingComment,
    commentText,
    onCommentTextChange,
    onOpenCreateComment,
    onCancelCreateComment,
    onSubmitComment
}) {
    return (
        <section className="mt-6 border border-gray-300 bg-white p-4">
            <div className="flex items-center justify-between gap-3">
                <h2 className="text-xl font-semibold text-gray-900">Comments</h2>
                {!isCreatingComment && (
                    <button
                        type="button"
                        onClick={onOpenCreateComment}
                        className="bg-black px-3 py-2 text-sm text-white hover:cursor-pointer"
                    >
                        Create Comment
                    </button>
                )}
            </div>

            {comments.length === 0 && !isCreatingComment && (
                <p className="mt-4 text-sm text-gray-600">No comments</p>
            )}

            {comments.length > 0 && (
                <div className="mt-4 space-y-3">
                    {comments.map((comment, index) => (
                        <div key={`${comment.timestamp}-${index}`} className="border border-gray-200 p-3">
                            <div className="flex items-center justify-between gap-3">
                                <span className="text-sm font-medium text-gray-800">
                                    {comment.author || "Guest"}
                                </span>
                                <span className="text-xs text-gray-500">
                                    {RelativeTime(comment.timestamp)}
                                </span>
                            </div>
                            <p className="mt-2 whitespace-pre-wrap text-sm text-gray-700">
                                {comment.text}
                            </p>
                        </div>
                    ))}
                </div>
            )}

            {isCreatingComment && (
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
        </section>
    );
}
