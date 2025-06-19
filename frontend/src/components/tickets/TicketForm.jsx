import { useEffect, useState } from "react";
import { createTicket, updateTicket } from "../../services/ticketService";
import toast from "react-hot-toast";
import { fetchProjects } from "../../services/projectService";

//Ticket Form for creating ticket
const TicketForm = ({ projectId, onCreated, editData, clearEdit }) => {
    const [form, setForm] = useState({
        title: "",
        description: "",
        priority: "Low",
        status: "To Do",
        assignee: "",
    });

    const [teamMembers, setTeamMembers] = useState([]);

    useEffect(() => {
        const loadTeamMembers = async () => {
            try {
                const res = await fetchProjects();
                const project = res.data.data.find(p => p._id === projectId);
                if (project?.teamMembers) {
                    setTeamMembers(project.teamMembers);
                } else {
                    toast.error("Project or team members not found");
                }
            } catch (err) {
                toast.error("Failed to load team members");
            }
        };

        if (projectId) loadTeamMembers();
    }, [projectId]);

    useEffect(() => {
        if (editData) {
            setForm({
                title: editData.title,
                description: editData.description,
                priority: editData.priority,
                status: editData.status,
                assignee: editData.assignee?._id || "",
            });
        }
    }, [editData]);

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editData) {
                await updateTicket(editData._id, form);
                toast.success("Ticket updated!");
                clearEdit();
            } else {
                await createTicket({ ...form, projectId });
                toast.success("Ticket created!");
            }
            setForm({ title: "", description: "", priority: "Low", status: "To Do", assignee: "" });
            onCreated?.();
        } catch (err) {
            toast.error("Error saving ticket");
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-gray-900 p-6 rounded-lg shadow-lg text-white animate-fade-in transition-all duration-300"
        >
            <h2 className="text-2xl font-bold text-purple-400 mb-2">
                {editData ? "🛠️ Update Ticket" : "➕ Create Ticket"}
            </h2>
            <p className="text-sm text-gray-400 mb-4">📁 Project ID: {projectId}</p>

            <input
                type="text"
                name="title"
                placeholder="🎯 Ticket Title"
                className="w-full p-3 mb-3 rounded bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={form.title}
                onChange={handleChange}
                required
            />
            <textarea
                name="description"
                placeholder="📝 Description"
                className="w-full p-3 mb-3 rounded bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={form.description}
                onChange={handleChange}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                <select
                    name="priority"
                    className="p-3 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    value={form.priority}
                    onChange={handleChange}
                >
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                </select>

                <select
                    name="status"
                    className="p-3 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={form.status}
                    onChange={handleChange}
                >
                    <option>To Do</option>
                    <option>In Progress</option>
                    <option>Done</option>
                </select>
            </div>

            <select
                name="assignee"
                className="w-full p-3 mb-4 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-green-400"
                value={form.assignee}
                onChange={handleChange}
            >
                <option value="">👤 -- Assign to --</option>
                {teamMembers.map((member) => (
                    <option key={member._id} value={member._id}>
                        {member.name} ({member.email})
                    </option>
                ))}
            </select>

            <div className="flex gap-3">
                <button
                    type="submit"
                    className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded transition"
                >
                    {editData ? "Update" : "Create"}
                </button>
                {editData && (
                    <button
                        type="button"
                        onClick={clearEdit}
                        className="bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded transition"
                    >
                        Cancel Edit
                    </button>
                )}
            </div>
        </form>
    );
};

export default TicketForm;
