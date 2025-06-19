import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    priority: {
        type: String,
        enum: ["Low", "Medium", "High"],
        default: "Low",
    },
    status: {
        type: String,
        enum: ["To Do", "In Progress", "Done"],
        default: "To Do",
    },
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
        required: true,
    },
    assignee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "userModel",
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "userModel",
        required: true,
    }
}, { timestamps: true });

export default mongoose.model("Ticket", ticketSchema);
