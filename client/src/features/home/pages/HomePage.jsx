import RecentQuestions from "../components/RecentQuestions";
import TrendingSkills from "../components/TrendingSkills";
import WelcomeArea from "../components/WelcomeArea";

export default function HomePage() {
    return (
        <main className="flex flex-col gap-5 px-8 py-4">
            <WelcomeArea />
            <TrendingSkills />
            <RecentQuestions />
        </main>
    )
}