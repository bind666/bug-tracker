import { useEffect, useState } from "react";
import {
    fetchProjects,
    updateProject,
    deleteProject,
    addTeamMember,
    removeTeamMember,
} from "../services/projectService";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const ProjectList = () => {
    const { user } = useAuth();
    const [projects, setProjects] = useState([]);
    const [editId, setEditId] = useState(null);
    const [editData, setEditData] = useState({ title: "", description: "" });
    const [showMembersId, setShowMembersId] = useState(null);
    const [addEmailInputs, setAddEmailInputs] = useState({});
    const [removeEmailInputs, setRemoveEmailInputs] = useState({});

    const getData = async () => {
        if (!user) return;
        try {
            const res = await fetchProjects();
            setProjects(res.data.data);
        } catch {
            toast.error("Failed to fetch projects");
        }
    };

    useEffect(() => {
        if (user) getData();
    }, [user]);

    const handleEdit = (project) => {
        setEditId(project._id);
        setEditData({ title: project.title, description: project.description });
    };

    const handleUpdate = async () => {
        try {
            await updateProject(editId, editData);
            toast.success("Project updated");
            setEditId(null);
            getData();
        } catch {
            toast.error("Update failed");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this project?")) return;
        try {
            await deleteProject(id);
            toast.success("Project deleted");
            getData();
        } catch {
            toast.error("Delete failed");
        }
    };

    const handleAddMemberByEmail = async (projectId) => {
        const email = addEmailInputs[projectId];
        if (!email) {
            toast.error("Please enter an email to add");
            return;
        }
        try {
            await addTeamMember(projectId, email);
            toast.success(`Added ${email} to project`);
            setAddEmailInputs(prev => ({ ...prev, [projectId]: "" }));
            getData();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to add member");
        }
    };

    const handleRemoveMemberByEmail = async (projectId) => {
        const email = removeEmailInputs[projectId];
        if (!email) {
            toast.error("Please enter an email to remove");
            return;
        }
        if (!window.confirm(`Remove ${email} from this project?`)) return;
        try {
            await removeTeamMember(projectId, email);
            toast.success(`Removed ${email} from project`);
            setRemoveEmailInputs(prev => ({ ...prev, [projectId]: "" }));
            getData();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to remove member");
        }
    };

    return (
        <div className="p-4 sm:p-6 max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-center text-purple-300 animate-pulse">
                🚀 Your Projects
            </h2>

            {projects.map((project, index) => (
                <div
                    key={project._id}
                    className="bg-gradient-to-r from-purple-900 to-indigo-900 text-purple-100 rounded-2xl p-4 sm:p-6 mb-6 shadow-lg transform transition duration-300 ease-in-out hover:scale-105 hover:shadow-2xl animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                >
                    {editId === project._id ? (
                        <div className="space-y-3">
                            <input
                                type="text"
                                value={editData.title}
                                onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                                className="bg-purple-700 text-white border-none px-4 py-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
                            />
                            <textarea
                                value={editData.description}
                                onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                                className="bg-purple-700 text-white border-none px-4 py-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
                            />
                            <div className="flex flex-wrap gap-2 sm:gap-3">
                                <button
                                    onClick={handleUpdate}
                                    className="bg-green-500 hover:bg-green-600 transition px-3 py-1.5 text-sm sm:text-base rounded-xl text-white font-semibold shadow hover:shadow-md"
                                >
                                    💾 Save
                                </button>
                                <button
                                    onClick={() => setEditId(null)}
                                    className="bg-gray-600 hover:bg-gray-700 transition px-3 py-1.5 text-sm sm:text-base rounded-xl text-white font-semibold shadow hover:shadow-md"
                                >
                                    ❌ Cancel
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <h3 className="text-2xl font-semibold mb-2">{project.title}</h3>
                            <p className="text-sm text-purple-200 mb-4">{project.description}</p>
                            <div className="flex flex-wrap gap-2 sm:gap-4 mb-4">
                                <button
                                    onClick={() => handleEdit(project)}
                                    className="bg-blue-600 hover:bg-blue-700 transition px-3 py-1.5 text-sm sm:text-base rounded-xl text-white font-semibold shadow hover:shadow-md"
                                >
                                    ✏️ Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(project._id)}
                                    className="bg-red-600 hover:bg-red-700 transition px-3 py-1.5 text-sm sm:text-base rounded-xl text-white font-semibold shadow hover:shadow-md"
                                >
                                    🗑 Delete
                                </button>
                                <button
                                    onClick={() => setShowMembersId(showMembersId === project._id ? null : project._id)}
                                    className="bg-green-600 hover:bg-green-700 transition px-3 py-1.5 text-sm sm:text-base rounded-xl text-white font-semibold shadow hover:shadow-md"
                                >
                                    👥 Members
                                </button>
                            </div>

                            {showMembersId === project._id && (
                                <>
                                    {project.teamMembers && project.teamMembers.length > 0 ? (
                                        <ul className="list-disc list-inside text-purple-300 text-sm mb-4">
                                            {project.teamMembers.map((member) => (
                                                <li key={member._id}>
                                                    {member.name} ({member.email})
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-purple-300 text-sm mb-4 italic">No members added yet.</p>
                                    )}

                                    {/* Add/Remove by email */}
                                    <div className="mb-4 flex flex-col gap-4 max-w-md">
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                            <input
                                                type="email"
                                                value={addEmailInputs[project._id] || ""}
                                                onChange={(e) =>
                                                    setAddEmailInputs(prev => ({ ...prev, [project._id]: e.target.value }))
                                                }
                                                placeholder="Enter email to add"
                                                className="flex-1 px-3 py-2 rounded bg-purple-700 text-white border-none focus:outline-none focus:ring-2 focus:ring-purple-400"
                                            />
                                            <button
                                                onClick={() => handleAddMemberByEmail(project._id)}
                                                className="bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 text-sm sm:text-base rounded font-semibold"
                                            >
                                                Add Member
                                            </button>
                                        </div>

                                        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                            <input
                                                type="email"
                                                value={removeEmailInputs[project._id] || ""}
                                                onChange={(e) =>
                                                    setRemoveEmailInputs(prev => ({ ...prev, [project._id]: e.target.value }))
                                                }
                                                placeholder="Enter email to remove"
                                                className="flex-1 px-3 py-2 rounded bg-purple-700 text-white border-none focus:outline-none focus:ring-2 focus:ring-purple-400"
                                            />
                                            <button
                                                onClick={() => handleRemoveMemberByEmail(project._id)}
                                                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 text-sm sm:text-base rounded font-semibold"
                                            >
                                                Remove Member
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </>
                    )}
                </div>
            ))}
        </div>
    );
};

export default ProjectList;
