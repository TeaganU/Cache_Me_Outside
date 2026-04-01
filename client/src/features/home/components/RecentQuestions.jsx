import { Link } from "react-router-dom";
import { PATHS } from "../../../app/Routes";

export default function RecentQuestions() {
    return (
        <section className="border 2px black min-h-100 px-3 py-1.5">
            <div className="flex justify-between">
                <h1 className="font-bold">
                    Recent Questions
                </h1>

                <Link
                    to={`${PATHS.SKILLS}?search=${encodeURIComponent("question")}`}
                    className="text-gray-700">
                    View All
                </Link>
            </div>
        </section>
    )
}