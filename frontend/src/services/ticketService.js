//Backend Api For Ticket
import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:3000/api",
    withCredentials: true,
});

export const createTicket = (data) => API.post("/tickets/", data);
export const getTicketsByProject = (projectId) => API.get(`/tickets/project/${projectId}`);
export const updateTicket = (id, data) => API.put(`/tickets/${id}`, data);
export const deleteTicket = (id) => API.delete(`/tickets/${id}`);
