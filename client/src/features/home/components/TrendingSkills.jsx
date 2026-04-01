import { Link } from "react-router-dom";
import { PATHS } from "../../../app/Routes";

export default function TrendingSkills() {
    return (
        <section className="border 2px black h-40 px-3 py-1.5">
            <div className="flex justify-between">
                <h1 className="font-bold">
                    Trending Skills
                </h1>

                <Link
                    to={PATHS.SKILLS}
                    className="text-gray-700">
                    View All
                </Link>
            </div>
        </section>
    )
}