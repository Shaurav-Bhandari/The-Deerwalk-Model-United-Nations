import mongoose from "mongoose";

const ExecutiveSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        
        committee: {
            type: String,
            required: true,
            enum: ["UNSC", "FPN", "DISEC", "UNHRC", "ECOFIN", "Other"],
        },
        position: {
            type: String,
            required: true,
            enum: ["Chairperson", "Vice-Chairperson"],
        },
       cv: {
        type: String,// Cloudinary pdf url
        required: true,
        unique: true,
       }
    }, {timestamps: true}
);

export const Executive = mongoose.model("Executive", ExecutiveSchema);