import Ticket from "../models/Ticket.js";
import Project from "../models/Project.js";
import asyncHandler from "express-async-handler";
import createError from "http-errors";
import ApiResponse from "../utils/ApiResponse.js";

// Create a ticket
const createTicket = asyncHandler(async (req, res, next) => {
    const { title, description, priority, status, assignee, projectId } = req.body;
    console.log("🎯 createTicket called with:", req.body, req.user);

    const project = await Project.findById(projectId);
    if (!project) return next(createError(404, "Project not found"));

    if (!project.teamMembers.includes(req.user._id)) {
        return next(createError(403, "You are not part of this project"));
    }

    const ticket = await Ticket.create({
        title,
        description,
        priority,
        status,
        assignee,
        projectId,
        createdBy: req.user._id,
    });

    res.status(201).json(new ApiResponse(ticket, "Ticket created successfully"));
});

// Get all tickets for a project
const listTicketsByProject = asyncHandler(async (req, res, next) => {
    const projectId = req.params.projectId;

    const project = await Project.findById(projectId);
    if (!project) return next(createError(404, "Project not found"));

    if (!project.teamMembers.includes(req.user._id)) {
        return next(createError(403, "Access denied"));
    }

    const tickets = await Ticket.find({ projectId }).populate("assignee", "name email");
    res.status(200).json(new ApiResponse(tickets, "Tickets fetched successfully"));
});

// Update a ticket
const updateTicket = asyncHandler(async (req, res, next) => {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return next(createError(404, "Ticket not found"));

    const project = await Project.findById(ticket.projectId);
    if (!project.teamMembers.includes(req.user._id)) {
        return next(createError(403, "Access denied"));
    }

    const allowedFields = ["title", "description", "priority", "status", "assignee"];
    allowedFields.forEach(field => {
        if (req.body[field] !== undefined) ticket[field] = req.body[field];
    });

    await ticket.save();
    res.status(200).json(new ApiResponse(ticket, "Ticket updated successfully"));
});

// Delete a ticket
const deleteTicket = asyncHandler(async (req, res, next) => {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return next(createError(404, "Ticket not found"));

    const project = await Project.findById(ticket.projectId);
    if (!project.teamMembers.includes(req.user._id)) {
        return next(createError(403, "Access denied"));
    }

    await ticket.deleteOne();
    res.status(200).json(new ApiResponse(null, "Ticket deleted successfully"));
});

export {
    createTicket,
    listTicketsByProject,
    updateTicket,
    deleteTicket
};
