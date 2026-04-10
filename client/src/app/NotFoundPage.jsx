import { Link } from "react-router-dom";
import { PATHS } from "./Routes";

export default function NotFoundPage() {
    return (
        <div className="mx-auto max-w-4xl px-6 py-12 text-center">
            <h1 className="text-4xl font-bold text-gray-900">404</h1>
            <p className="mt-4 text-lg text-gray-700">Page Not Found</p>
            <p className="mt-2 text-sm text-gray-600">
                The page you’re looking for doesn’t exist or may have been moved.
            </p>

            <div className="mt-6 flex justify-center gap-3">
                <Link to={PATHS.HOME} className="border border-gray-300 px-4 py-2">
                    Go Home
                </Link>
                <Link to={PATHS.SKILLS} className="bg-black px-4 py-2 text-white">
                    Browse Skills
                </Link>
            </div>
        </div>

    )
}