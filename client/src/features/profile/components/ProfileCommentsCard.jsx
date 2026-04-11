import { Link } from "react-router-dom";
import { RelativeTime } from "../../../lib/RelativeTime";
import { PATHS } from "../../../app/Routes";

export default function ProfileCommentsCard({ comment }) {
    const destination = `${PATHS.POST(comment.postId)}?commentId=${comment._id}`;

    return (
        <Link to={destination}
            className="flex flex-col w-full bg-white border border-gray-300 
            hover:cursor-pointer hover:border-gray-500 hover:-translate-x-0.5">
            <div className="flex justify-between text-xs text-gray-600">
                <span>
                    {comment.postCategory || "Category"}
                    <span className="mx-2">|</span>
                    {comment.postType || "Post"}
                </span>
                <span>
                    {RelativeTime(comment.createdAt) || "Recently"}
                </span>
            </div>
            <h1 className="font-bold text-xl">
                {comment.postTitle || "Untitled Post"}
            </h1>
            <p className="mt-2 text-sm text-gray-700">
                {comment.text || "No comment text"}
            </p>
            <div className="mt-3 text-sm text-gray-600">
                View original post
            </div>
        </Link>
    )
}
