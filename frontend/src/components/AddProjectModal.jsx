import { useState } from "react";
import { createProject } from "../services/projectService";
import toast from "react-hot-toast";

const AddProjectModal = ({ onClose }) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim()) {
            toast.error("Title is required");
            return;
        }
        setLoading(true);
        try {
            await createProject({ title, description });
            toast.success("Project created successfully");
            onClose();
            window.location.reload(); // quick hack to refresh dashboard
        } catch (error) {
            toast.error("Failed to create project");
        }
        setLoading(false);
    };

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50"
            onClick={onClose}
        >
            <div
                className="bg-gray-900 text-gray-200 rounded-lg p-6 w-full max-w-md shadow-lg
                   transform transition-transform duration-300 ease-in-out
                   hover:scale-[1.02]"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-2xl font-semibold mb-6 border-b border-gray-700 pb-2">
                    Add New Project
                </h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-5">
                        <label className="block font-semibold mb-1" htmlFor="title">
                            Title
                        </label>
                        <input
                            id="title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2
                         focus:outline-none focus:ring-2 focus:ring-purple-500
                         placeholder-gray-400 text-gray-100 transition duration-200"
                            placeholder="Enter project title"
                            required
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block font-semibold mb-1" htmlFor="description">
                            Description
                        </label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2
                         focus:outline-none focus:ring-2 focus:ring-purple-500
                         placeholder-gray-400 text-gray-100 transition duration-200"
                            rows={4}
                            placeholder="Enter project description"
                        />
                    </div>

                    <div className="flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2 border border-gray-600 rounded
                         hover:bg-gray-700 hover:border-purple-500 transition
                         duration-200 disabled:opacity-50"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-5 py-2 bg-purple-600 text-gray-100 rounded
                         hover:bg-purple-700 transition duration-200 disabled:opacity-50"
                            disabled={loading}
                        >
                            {loading ? "Creating..." : "Create"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddProjectModal;
