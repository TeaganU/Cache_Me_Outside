import { Link } from "react-router-dom";
import { RelativeTime } from "../../../lib/RelativeTime";
import { PATHS } from "../../../app/Routes";
import { getImageUrl } from "../../../lib/getImageUrl";

export default function TrendingSkillsCard({ post }) {
    const username = post.authorUsername || "Author Name";
    const initials = username.slice(0, 2).toUpperCase();

    return (
        <Link to={PATHS.POST(post._id)}
            className="flex flex-col bg-white border border-gray-300 w-65 min-w-50 p-2 rounded-lg gap-y-2
            hover:cursor-pointer hover:border-gray-500 hover:-translate-y-0.5">
            <div className="flex justify-between text-xs">
                <span>
                    {post.category || "Category"}
                </span>
                <span>
                    {RelativeTime(post.createdAt) || "Recently"}
                </span>
            </div>
            <h1 className="font-bold text-xl">
                {post.title || "Title"}
            </h1>
            <div className="flex items-center gap-3 mt-auto">
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
        </Link>
    )
}
