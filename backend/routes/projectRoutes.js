import express from "express";
import {
    createProject,
    getAllProjects,
    updateProject,
    deleteProject,
    addTeamMember,
    removeTeamMember
} from "../controllers/projectController.js";
import { auth } from "../middleware/auth.js";

const projectRouter = express.Router();

projectRouter.route("/").post(auth, createProject)
projectRouter.route("/").get(auth, getAllProjects);
    

projectRouter.route("/:id")
    .put(auth, updateProject)
    .delete(auth, deleteProject);

projectRouter.route("/:id/add-member").put(auth, addTeamMember);
projectRouter.route("/:id/remove-member").put(auth, removeTeamMember);

export { projectRouter };
