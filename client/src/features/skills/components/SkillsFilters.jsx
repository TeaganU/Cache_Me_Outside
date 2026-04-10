export default function SkillsFilters({
    categoryOptions,
    postTypeOptions,
    sortByOptions,
    selectedCategories,
    selectedTypes,
    sortBy,
    onToggleCategory,
    onToggleType,
    onToggleSort
}) {
    return (
        <aside className="w-full border border-gray-300 bg-white p-5 md:max-w-xs">
            <h2 className="text-2xl font-semibold text-gray-900">Filters</h2>
            
            <section className="mt-6">
                <h3 className="text-lg font-medium text-gray-900">Sort By</h3>
                <select
                    className="mt-3 w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800"
                    value={sortBy}
                    onChange={(event) => onToggleSort(event.target.value)}
                >
                    {sortByOptions.map((option) => (
                        <option
                            key={option.value}
                            value={option.value}
                        >
                            {option.label}
                        </option>
                    ))}
                </select>
            </section>

            <section className="mt-6">
                <h3 className="text-lg font-medium text-gray-900">Categories</h3>
                <div className="mt-3 space-y-2 text-base text-gray-800">
                    {categoryOptions.map((category) => (
                        <label key={category} className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={selectedCategories.includes(category)}
                                onChange={() => onToggleCategory(category)}
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
                    {postTypeOptions.map((type) => (
                        <label key={type} className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={selectedTypes.includes(type)}
                                onChange={() => onToggleType(type)}
                                className="h-4 w-4 border-gray-400"
                            />
                            <span>{type}</span>
                        </label>
                    ))}
                </div>
            </section>
        </aside >
    );
}
