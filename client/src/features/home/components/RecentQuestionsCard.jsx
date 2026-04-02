import { RelativeTime } from "../../../lib/RelativeTime";

export default function RecentQuestionsCard({ post }) {
    return (
        <div className="flex w-full px-2 py-1 items-center justify-between bg-white border 1px black rounded-lg 
            hover:cursor-pointer hover:border-gray-500 hover:-translate-x-0.5">
            <div className="flex flex-col">
                <span>
                    <span>
                        {post.category || "Category"}
                    </span>
                    <h1 className="font-bold text-xl">
                        {post.title || "Title"}
                    </h1>
                </span>

                <div className="flex items-center gap-3 mt-auto">
                    <div className="h-8 w-8 rounded-full bg-gray-200" />
                    <span className="text-sm font-medium text-gray-800">
                        {post.author || "Author Name"}
                    </span>
                </div>
            </div>

            <span>
                {RelativeTime(post.timestamp)}
            </span>
        </div>
    )
}