import { Link } from "react-router-dom";
import { PATHS } from "../../../app/Routes";

export default function SkillsHeader({ searchText }) {
    return (
        <div className="mb-6 flex flex-col gap-2">
                <p className="text-sm text-gray-500">
                    <Link to="/" className="hover:underline">
                        Home
                    </Link>{" "}
                    &gt;{" "}
                    <Link to={PATHS.SKILLS} className="hover:underline">
                        Skills
                    </Link>
                </p>

                <div className="flex flex-row justify-between">
                    <h1 className="mt-2 text-3xl font-semibold text-gray-900">
                        Browse Skills
                    </h1>

                    <Link
                        to={PATHS.CREATEPOST}
                        className="inline-block bg-black px-4 py-2 text-white"
                    >
                        Create Post
                    </Link>
                </div>
                

                {searchText && (
                    <div className="flex justify-between mt-2 text-sm text-gray-600 items-center w-full">
                        <p>
                            Search results for: {searchText}
                        </p>
                        <Link 
                        to={PATHS.SKILLS} 
                        className="hover:underline">
                            Clear Results
                        </Link>
                    </div>
                )}
        </div>
    );
}
