//Backend Api For Project
import axios from "axios";

// Use VITE_API_URL if available, else fallback to localhost
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const API = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// ✅ Project APIs
export const fetchProjects = () => API.get("/projects");

export const createProject = (data) => API.post("/projects", data);

export const updateProject = (id, data) => API.put(`/projects/${id}`, data);

export const deleteProject = (id) => API.delete(`/projects/${id}`);

// ✅ Team Member APIs
export const addTeamMember = (projectId, email) =>
  API.put(`/projects/${projectId}/add-member`, { email });

export const removeTeamMember = (projectId, email) =>
  API.put(`/projects/${projectId}/remove-member`, { email });

