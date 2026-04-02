import SkillsPostCard from "./SkillsPostCard";

export default function SkillsPostList({ posts }) {
    return (
        <div className="space-y-4">
            {posts.map((post) => (
                <SkillsPostCard
                    key={post._id}
                    post={post}
                />
            ))}
        </div>
    );
}
