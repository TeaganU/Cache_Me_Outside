import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import SkillsFilters from "../components/SkillsFilters";
import SkillsHeader from "../components/SkillsHeader";
import SkillsPostList from "../components/SkillsPostList";
import {
    categoryOptions,
    postTypeOptions,
    sortByOptions
} from "../components/skillsOptions";

function getSelectedValues(searchParams, key) {
    const values = searchParams
        .get(key)
        ?.split(",")
        .map((value) => value.trim())
        .filter(Boolean);

    return values && values.length > 0 ? values : ["All"];
}

export default function SkillsPage() {
    const resultInc = 10;
    const [searchParams, setSearchParams] = useSearchParams();
    const searchText = searchParams.get("search") || "";
    const selectedCategories = getSelectedValues(searchParams, "category");
    const selectedTypes = getSelectedValues(searchParams, "type");
    const sortBy = searchParams.get("sort") || "uploadDate";
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [resultLimit, setResultLimit] = useState(resultInc);

    useEffect(() => {
        setResultLimit(resultInc);
    }, [searchText, selectedCategories, selectedTypes, sortBy]);

    useEffect(() => {
        async function fetchResults() {
            setLoading(true);
            setError("");

            try {
                const endpoint = searchParams.toString()
                    ? `/api/posts?${searchParams.toString()}`
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
    }, [searchParams]);

    function updateSearchParams(updateFn) {
        const nextParams = new URLSearchParams(searchParams);
        updateFn(nextParams);
        setSearchParams(nextParams);
    }

    const toggleFilter = (key, value, selectedValues) => {
        if (value === "All") {
            updateSearchParams((params) => {
                params.delete(key);
            });
            return;
        }

        const withoutAll = selectedValues.filter((item) => item !== "All");
        const nextValues = withoutAll.includes(value)
            ? withoutAll.filter((item) => item !== value)
            : [...withoutAll, value];

        updateSearchParams((params) => {
            if (nextValues.length === 0) {
                params.delete(key);
                return;
            }

            params.set(key, nextValues.join(","));
        });
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-8 md:flex-row">
                <SkillsFilters
                    categoryOptions={categoryOptions}
                    postTypeOptions={postTypeOptions}
                    sortByOptions={sortByOptions}
                    selectedCategories={selectedCategories}
                    selectedTypes={selectedTypes}
                    sortBy={sortBy}
                    onToggleCategory={(category) =>
                        toggleFilter("category", category, selectedCategories)
                    }
                    onToggleType={(type) =>
                        toggleFilter("type", type, selectedTypes)
                    }
                    onToggleSort={(value) =>
                        updateSearchParams((params) => {
                            if (!value || value === "uploadDate") {
                                params.delete("sort");
                                return;
                            }

                            params.set("sort", value);
                        })
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
