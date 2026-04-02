import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import SkillsFilters from "../components/SkillsFilters";
import SkillsHeader from "../components/SkillsHeader";
import SkillsPostList from "../components/SkillsPostList";
import {
    categoryOptions,
    postTypeOptions
} from "../components/skillsOptions";
export default function SkillsPage() {
    const resultInc = 10
    const [searchParams] = useSearchParams();
    const searchText = searchParams.get("search") || "";
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [selectedCategories, setSelectedCategories] = useState(["All"]);
    const [selectedTypes, setSelectedTypes] = useState(["All"]);
    const [resultLimit, setResultLimit] = useState(resultInc);

    useEffect(() => {
        setResultLimit(resultInc);
    }, [searchText, selectedCategories, selectedTypes]);

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
                <SkillsFilters
                    categoryOptions={categoryOptions}
                    postTypeOptions={postTypeOptions}
                    selectedCategories={selectedCategories}
                    selectedTypes={selectedTypes}
                    onToggleCategory={(category) =>
                        toggleFilter(category, selectedCategories, setSelectedCategories)
                    }
                    onToggleType={(type) =>
                        toggleFilter(type, selectedTypes, setSelectedTypes)
                    }
                />

                <main className="flex flex-col min-w-0 flex-1">
                    <SkillsHeader searchText={searchText} />

                    {loading && <p className="text-gray-600">Loading...</p>}

                    {error && <p className="text-red-600">{error}</p>}

                    {!loading && !error && results.length > 0 && (
                        <SkillsPostList posts={results.slice(0, resultLimit)} />
                    )}

                    {!loading && !error && results.length > resultLimit && (
                        <div className="flex mt-4 justify-center">
                            <button
                                type="button"
                                onClick={() => setResultLimit((current) => current + resultInc)}
                                className="border border-gray-400 bg-gray-200 rounded-lg px-2 py-1 hover:cursor-pointer"
                            >
                                Load More
                            </button>
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
