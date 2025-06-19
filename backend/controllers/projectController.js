import Project from "../models/Project.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "express-async-handler";
import createError from "http-errors";
import User from "../models/User.js"

// Create project
const createProject = asyncHandler(async (req, res, next) => {
    const { title, description } = req.body;

    const project = await Project.create({
        title,
        description,
        createdBy: req.user._id,
        teamMembers: [req.user._id],
    });

    res.status(201).json(new ApiResponse(project, "Project created successfully"));
});

// Get all projects for current user
const getAllProjects = asyncHandler(async (req, res, next) => {
    const projects = await Project.find({
        teamMembers: req.user._id
    }).populate("teamMembers", "name email");

    res.status(200).json(new ApiResponse(projects, "Projects fetched successfully"));
});

// Update project (only by creator)
const updateProject = asyncHandler(async (req, res, next) => {
    const project = await Project.findById(req.params.id);
    if (!project) return next(createError(404, "Project not found"));

    if (!project.createdBy.equals(req.user._id)) {
        return next(createError(403, "You are not authorized to update this project"));
    }

    project.title = req.body.title || project.title;
    project.description = req.body.description || project.description;

    await project.save();

    res.status(200).json(new ApiResponse(project, "Project updated successfully"));
});

// Delete project (only by creator)
const deleteProject = asyncHandler(async (req, res, next) => {
    const project = await Project.findById(req.params.id);
    if (!project) return next(createError(404, "Project not found"));

    if (!project.createdBy.equals(req.user._id)) {
        return next(createError(403, "You are not authorized to delete this project"));
    }

    await project.deleteOne();
    res.status(200).json(new ApiResponse(null, "Project deleted successfully"));
});

// Add team member
const addTeamMember = asyncHandler(async (req, res, next) => {
    const { email } = req.body;

    const project = await Project.findById(req.params.id);
    if (!project) return next(createError(404, "Project not found"));

    if (!project.createdBy.equals(req.user._id)) {
        return next(createError(403, "You are not authorized to add team members"));
    }

    const user = await User.findOne({ email });
    if (!user) return next(createError(404, "User not found"));

    const userId = user._id;

    if (!project.teamMembers.includes(userId)) {
        project.teamMembers.push(userId);
        await project.save();
    }
    const populatedProject = await Project.findById(project._id).populate("teamMembers", "name email");
    res.status(200).json(new ApiResponse(populatedProject, `Added ${email} to project`));

    // res.status(200).json(new ApiResponse(project, `Added ${email} to project`));
});


// Remove team member
const removeTeamMember = asyncHandler(async (req, res, next) => {
    const { email } = req.body;

    const project = await Project.findById(req.params.id);
    if (!project) return next(createError(404, "Project not found"));

    if (!project.createdBy.equals(req.user._id)) {
        return next(createError(403, "You are not authorized to remove team members"));
    }

    const user = await User.findOne({ email });
    if (!user) return next(createError(404, "User not found"));

    const userId = user._id;

    // Prevent removing the creator
    if (userId.toString() === project.createdBy.toString()) {
        return next(createError(400, "Cannot remove the project creator"));
    }

    const originalLength = project.teamMembers.length;

    project.teamMembers = project.teamMembers.filter(
        (memberId) => memberId.toString() !== userId.toString()
    );

    if (project.teamMembers.length === originalLength) {
        return next(createError(400, "User is not a team member"));
    }

    await project.save();

    const populatedProject = await Project.findById(project._id).populate("teamMembers", "name email");
    res.status(200).json(new ApiResponse(populatedProject, `Removed ${email} from project`));
});


export {
    createProject,
    getAllProjects,
    updateProject,
    deleteProject,
    addTeamMember,
    removeTeamMember
};
