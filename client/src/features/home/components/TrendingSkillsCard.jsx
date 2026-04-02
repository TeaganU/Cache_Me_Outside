import { Link } from "react-router-dom";
import { RelativeTime } from "../../../lib/RelativeTime";
import { PATHS } from "../../../app/Routes";

export default function TrendingSkillsCard({ post }) {
    return (
        <Link to={PATHS.POST(post.id)}
            className="flex flex-col bg-white border border-gray-300 w-65 min-w-50 p-2 rounded-lg gap-y-2
            hover:cursor-pointer hover:border-gray-500 hover:-translate-y-0.5">
            <div className="flex justify-between text-xs">
                <span>
                    {post.category || "Category"}
                </span>
                <span>
                    {RelativeTime(post.timestamp) || "Recently"}
                </span>
            </div>
            <h1 className="font-bold text-xl">
                {post.title || "Title"}
            </h1>
            <div className="flex items-center gap-3 mt-auto">
                <div className="h-8 w-8 rounded-full bg-gray-200" />
                <span className="text-sm font-medium text-gray-800">
                    {post.author || "Author Name"}
                </span>
            </div>
            <div className="text-sm text-gray-600">
                <span>{post.likes || 0} Likes</span>
                <span className="mx-2">|</span>
                <span>{post.comments?.length || 0} Comments</span>
            </div>
        </Link>
    )
}
