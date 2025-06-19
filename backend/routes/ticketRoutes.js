import express from "express";
import {
    createTicket,
    listTicketsByProject,
    updateTicket,
    deleteTicket
} from "../controllers/ticketController.js";
import { auth } from "../middleware/auth.js";

const ticketRouter = express.Router();

ticketRouter.route("/").post(auth, createTicket);
ticketRouter.route("/project/:projectId").get(auth, listTicketsByProject);
ticketRouter.route("/:id").put(auth, updateTicket)
ticketRouter.route("/:id").delete(auth, deleteTicket);


export { ticketRouter };
