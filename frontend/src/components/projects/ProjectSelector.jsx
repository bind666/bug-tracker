import { useEffect, useState } from "react";
import { fetchProjects } from "../../services/projectService";
import toast from "react-hot-toast";
import { useProject } from "../../context/ProjectContext";

//Project Selector for tickets
const ProjectSelector = () => {
    const [projects, setProjects] = useState([]);
    const { selectedProject, setSelectedProject } = useProject();

    useEffect(() => {
        const loadProjects = async () => {
            try {
                const res = await fetchProjects();
                setProjects(res.data.data);
                console.log("✅ Loaded projects:", res.data.data);
            } catch (err) {
                console.error("❌ Failed to fetch projects:", err);
                toast.error("Failed to load projects");
            }
        };

        loadProjects();
    }, []);

    const handleSelectChange = (e) => {
        const selected = projects.find(p => p._id === e.target.value);
        if (selected) {
            console.log("✅ Selected Project ID:", selected._id);
            setSelectedProject(selected); // Pass the full project object to context
        } else {
            setSelectedProject(null);
        }
    };

    return (
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-200 mb-1">
                Choose Project
            </label>
            <select
                className="w-full p-2 rounded bg-purple-800 text-yellow-500 font-bold"
                value={selectedProject?._id || ""}
                onChange={handleSelectChange}
            >
                <option value="">-- Select a Project --</option>
                {projects.map((project) => (
                    <option key={project._id} value={project._id}>
                        {project.title}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default ProjectSelector;
