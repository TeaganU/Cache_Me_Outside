import { useState } from "react";

function CreatePostPage() {
    const [form, setForm] = useState({
        type: "question",
        category: "",
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
            const res = await fetch("http://localhost:4000/api/posts", {
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

            //to clear form
            setForm({
                type: "question",
                category: "",
                title: "",
                content: ""
            });

        } catch (err) {
            console.error(err);
            setMessage("There was an error createing the post");
        }
    };

    return (
        <div className="p-8 max-w-xl mx-auto">
            <h1 className="text-2xl mb-4">Create Post</h1>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                {/* post type */}
                <select name="type" value={form.type} onChange={handleChange}>
                    <option value="question">Question</option>
                    <option value="skill guide">Skill Guide</option>
                    <option value="discussion">Discussion</option>
                    <option value="event">Event</option>
                </select>

                {/* skill category (just text for now but can be select an option once we decide all the categories) */}
                <input
                    type="text"
                    name="category"
                    placeholder="Skill Category (e.g. Climbing)"
                    value={form.category}
                    onChange={handleChange}
                />

                {/* post title */}
                <input
                    type="text"
                    name="title"
                    placeholder="Title"
                    value={form.title}
                    onChange={handleChange}
                />

                {/* main text body of the post */}
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



