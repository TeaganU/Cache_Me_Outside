import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient } from "../../../lib/ApiClient";

function CreatePostPage() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        type: "Question",
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
        setMessage("");

        try {
            const data = await apiClient.post("/posts", form);

            setMessage(data.message);

            setForm({
                type: "Question",
                category: "Hiking",
                title: "",
                content: ""
            });

            navigate("/skills");
        } catch (err) {
            console.error(err);
            setMessage(err?.data?.message || "There was an error creating the post");
        }
    };

    return (
        <div className="mx-auto max-w-xl p-8">
            <h1 className="mb-4 text-2xl">Create Post</h1>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <select name="type" value={form.type} onChange={handleChange}>
                    <option value="Question">Question</option>
                    <option value="Skill Guide">Skill Guide</option>
                    <option value="Discussion">Discussion</option>
                    <option value="Event">Event</option>
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

                <button className="bg-blue-500 p-2 text-white hover:cursor-pointer">
                    Submit Post
                </button>
            </form>

            {message && <p className="mt-4">{message}</p>}
        </div>
    );
}

export default CreatePostPage;