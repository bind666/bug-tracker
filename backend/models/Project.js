import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "userModel",
        required: true,
    },
    teamMembers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "userModel",
        }
    ],
}, { timestamps: true });

export default mongoose.model("Project", projectSchema);
