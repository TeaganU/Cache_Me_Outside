import { useState } from "react";
import { useNavigate } from "react-router-dom";

function CreatePostPage() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        type: "question",
        category: "Hiking",
        title: "",
        content: ""
    });

    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch("/api/posts", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(form)
            });

            const data = await res.json();

            if (!res.ok) {
                setMessage(data.message || "There was an error creating the post");
                return;
            }

            setMessage(data.message);

            setForm({
                type: "question",
                category: "Hiking",
                title: "",
                content: ""
            });

            navigate("/skills");
        } catch (err) {
            console.error(err);
            setMessage("There was an error createing the post");
        }
    };

    return (
        <div className="p-8 max-w-xl mx-auto">
            <h1 className="text-2xl mb-4">Create Post</h1>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <select name="type" value={form.type} onChange={handleChange}>
                    <option value="question">Question</option>
                    <option value="skill guide">Skill Guide</option>
                    <option value="discussion">Discussion</option>
                    <option value="event">Event</option>
                </select>

                <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                >
                    <option value="Hiking">Hiking</option>
                    <option value="Skiing">Skiing</option>
                    <option value="Rock Climbing">Rock Climbing</option>
                    <option value="Mountaineering">Mountaineering</option>
                    <option value="Kayaking">Kayaking</option>
                    <option value="Running">Running</option>
                    <option value="Camping">Camping</option>
                </select>

                <input
                    type="text"
                    name="title"
                    placeholder="Title"
                    value={form.title}
                    onChange={handleChange}
                />

                <textarea
                    name="content"
                    placeholder="Write your post..."
                    value={form.content}
                    onChange={handleChange}
                />

                <button className="bg-blue-500 text-white p-2">
                    Submit Post
                </button>
            </form>

            {message && <p className="mt-4">{message}</p>}
        </div>
    );
}

export default CreatePostPage;
