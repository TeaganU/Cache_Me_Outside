import { Link } from "react-router-dom";
import { PATHS } from "../../../app/Routes";
import { RelativeTime } from "../../../lib/RelativeTime";
import { getImageUrl } from "../../../lib/getImageUrl";

export default function SkillsPostCard({
    post
}) {
    const username = post.authorUsername || "Author Name";
    const initials = username.slice(0, 2).toUpperCase();

    return (
        <Link to={PATHS.POST(post._id)}
            className="flex flex-col bg-white border border-gray-300 p-4
            hover:cursor-pointer hover:border-gray-500 hover:-translate-y-0.5">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div className="text-sm text-gray-600">
                    <span>{post.category || "Category"}</span>
                    <span className="mx-2">|</span>
                    <span>{post.type || "Type"}</span>
                </div>
                <span className="text-sm text-gray-500">
                    {RelativeTime(post.createdAt)}
                </span>
            </div>

            <div className="block">
                <h2 className="mt-3 text-2xl font-semibold text-gray-900">
                    {post.title}
                </h2>

                <p className="mt-2 whitespace-pre-wrap text-sm text-gray-700">
                    {post.content}
                </p>
            </div>

            <div className="mt-4 border-t border-gray-200 pt-3">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                        {post.authorProfileImage ? (
                            <img
                                src={getImageUrl(post.authorProfileImage)}
                                alt={`${username} profile`}
                                className="h-8 w-8 rounded-full border object-cover"
                            />
                        ) : (
                            <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-black text-xs text-white">
                                {initials}
                            </div>
                        )}
                        <span className="text-sm font-medium text-gray-800">
                            {username}
                        </span>
                    </div>

                    <div className="text-sm text-gray-600">
                        <span>{post.likes || 0} {(post.likes || 0) === 1 ? "Like" : "Likes"}</span>
                        <span className="mx-2">|</span>
                        <span>{post.views || 0} {(post.views || 0) === 1 ? "View" : "Views"}</span>
                        <span className="mx-2">|</span>
                        <span>{post.comments?.length || 0} {(post.comments?.length || 0) === 1 ? "Comment" : "Comments"}</span>
                    </div>
                </div>
            </div>
        </Link>
    );
}
