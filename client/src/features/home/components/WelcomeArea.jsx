import { PATHS } from "../../../app/Routes";
import { Link } from 'react-router-dom';

export default function WelcomeArea() {
    return (
        <section className="flex flex-col gap-4">
            <h1 className="font-bold text-3xl">
                Share Skills.<br />
                Build Community.<br />
                Explore Outdoors.
            </h1>

            <p className="text-gray-600">
                Connect with outdoor enthusiasts,<br />
                learn new skills in climbing, skiing, mountaineering, and more.<br />
                Share your expertise and grow together.
            </p>

            <nav className="flex gap-4">
                <Link 
                    to={PATHS.SIGNUP}
                    className="bg-black text-white px-2 py-1">
                    Get Started
                </Link>

                <Link
                    to={PATHS.SKILLS}
                    className="bg-white text-black border 1px black px-2 py-1">
                    View Skills
                </Link>
            </nav>
        </section>
    )
}