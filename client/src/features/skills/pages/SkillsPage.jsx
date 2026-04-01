import { Link, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { PATHS } from "../../../app/Routes";

const categoryOptions = [
    "All",
    "Hiking",
    "Skiing",
    "Rock Climbing",
    "Mountaineering",
    "Kayaking",
    "Running",
    "Camping"
];

const typeOptions = [
    "All",
    "Discussion",
    "Skill Guide",
    "Question",
    "Event"
];

function formatRelativeTime(timestamp) {
    if (!timestamp) {
        return "Recently";
    }

    const postDate = new Date(timestamp);
    if (Number.isNaN(postDate.getTime())) {
        return "Recently";
    }

    const diffMs = Date.now() - postDate.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffDays > 0) {
        return `${diffDays} Day${diffDays === 1 ? "" : "s"} Ago`;
    }

    if (diffHours > 0) {
        return `${diffHours} Hour${diffHours === 1 ? "" : "s"} Ago`;
    }

    return "Today";
}

function SkillsPage() {
    const [searchParams] = useSearchParams();
    const searchText = searchParams.get("search") || "";
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [selectedCategories, setSelectedCategories] = useState(["All"]);
    const [selectedTypes, setSelectedTypes] = useState(["All"]);

    useEffect(() => {
        async function fetchResults() {
            setLoading(true);
            setError("");

            try {
                const params = new URLSearchParams();

                // Preserve the navbar search term in the API request.
                if (searchText.trim()) {
                    params.set("search", searchText.trim());
                }

                // Append each selected category so the backend can treat them
                // as repeated query params.
                selectedCategories
                    .filter((category) => category !== "All")
                    .forEach((category) => {
                        params.append("category", category);
                    });

                // Append each selected type the same way.
                selectedTypes
                    .filter((type) => type !== "All")
                    .forEach((type) => {
                        params.append("type", type);
                    });

                // If no filters are active, just fetch all posts.
                const endpoint = params.toString()
                    ? `/api/posts?${params.toString()}`
                    : "/api/posts";
                const response = await fetch(endpoint);

                if (!response.ok) {
                    throw new Error("Failed to fetch results");
                }

                const data = await response.json();
                setResults(data);
            } catch {
                setError("Could not load results.");
                setResults([]);
            } finally {
                setLoading(false);
            }
        }

        fetchResults();
    }, [searchText, selectedCategories, selectedTypes]);

    // "All" acts like a reset; otherwise this toggles individual checkbox values.
    const toggleFilter = (value, selectedValues, setSelectedValues) => {
        if (value === "All") {
            setSelectedValues(["All"]);
            return;
        }

        const withoutAll = selectedValues.filter((item) => item !== "All");
        const nextValues = withoutAll.includes(value)
            ? withoutAll.filter((item) => item !== value)
            : [...withoutAll, value];

        setSelectedValues(nextValues.length > 0 ? nextValues : ["All"]);
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-8 md:flex-row">
                <aside className="w-full border border-gray-300 bg-white p-5 md:max-w-xs">
                    <h2 className="text-2xl font-semibold text-gray-900">Filters</h2>

                    <section className="mt-6">
                        <h3 className="text-lg font-medium text-gray-900">Categories</h3>
                        <div className="mt-3 space-y-2 text-base text-gray-800">
                            {categoryOptions.map((category) => (
                                <label key={category} className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={selectedCategories.includes(category)}
                                        onChange={() => toggleFilter(category, selectedCategories, setSelectedCategories)}
                                        className="h-4 w-4 border-gray-400"
                                    />
                                    <span>{category}</span>
                                </label>
                            ))}
                        </div>
                    </section>

                    <section className="mt-6">
                        <h3 className="text-lg font-medium text-gray-900">Post Type</h3>
                        <div className="mt-3 space-y-2 text-base text-gray-800">
                            {typeOptions.map((type) => (
                                <label key={type} className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={selectedTypes.includes(type)}
                                        onChange={() => toggleFilter(type, selectedTypes, setSelectedTypes)}
                                        className="h-4 w-4 border-gray-400"
                                    />
                                    <span>{type}</span>
                                </label>
                            ))}
                        </div>
                    </section>
                </aside>

                <main className="min-w-0 flex-1">
                    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                            <p className="text-sm text-gray-500">
                                <Link to="/" className="hover:underline">
                                    Home
                                </Link>{" "}
                                &gt;{" "}
                                <Link to="/skills" className="hover:underline">
                                    Skills
                                </Link>
                            </p>
                            <h1 className="mt-2 text-3xl font-semibold text-gray-900">
                                Browse Skills
                            </h1>
                            {searchText && (
                                <p className="mt-2 text-sm text-gray-600">
                                    Search results for: {searchText}
                                </p>
                            )}
                        </div>

                        <Link
                            to={PATHS.CREATEPOST}
                            className="inline-block bg-black px-4 py-2 text-white"
                        >
                            Create Post
                        </Link>
                    </div>

                    {loading && <p className="text-gray-600">Loading...</p>}

                    {error && <p className="text-red-600">{error}</p>}

                    {!loading && !error && results.length > 0 && (
                        <div className="space-y-4">
                            {results.map((post) => (
                                <article
                                    key={post._id ?? post.id}
                                    className="border border-gray-300 bg-white p-4"
                                >
                                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                                        <div className="text-sm text-gray-600">
                                            <span>{post.category || "Category"}</span>
                                            <span className="mx-2">|</span>
                                            <span>{post.type || "Type"}</span>
                                        </div>
                                        <span className="text-sm text-gray-500">
                                            {formatRelativeTime(post.timestamp)}
                                        </span>
                                    </div>

                                    <h2 className="mt-3 text-2xl font-semibold text-gray-900">
                                        {post.title}
                                    </h2>

                                    <p className="mt-2 whitespace-pre-wrap text-sm text-gray-700">
                                        {post.content}
                                    </p>

                                    <div className="mt-4 border-t border-gray-200 pt-3">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-gray-200" />
                                            <span className="text-sm font-medium text-gray-800">
                                                {post.author || "Author Name"}
                                            </span>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}

                    {!loading && !error && results.length === 0 && (
                        <p className="text-gray-600">
                            {searchText
                                ? "No matching results found for this search and filter combination."
                                : "No posts match the selected filters yet."}
                        </p>
                    )}
                </main>
            </div>
        </div>
    );
}

export default SkillsPage;
