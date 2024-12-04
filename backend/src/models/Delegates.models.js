// Delegate.models.js
import mongoose from "mongoose";

const DelegateSchema = new mongoose.Schema(
    {
        user: {
            
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true
            
            
        },
        institute: {
            type: String,
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
        grade: {
            type: String,
            required: true,
        },
        munExperience: {
            type: Number,
            default: 0,
            required: true,
        },
        primaryCommittee: {
            type: String,
            enum: ["UNSC", "FPN", "DISEC", "UNHRC", "ECOFIN", "Other"],
            required: true,
        },
        secondaryCommittee: {
            type: String,
            enum: ["UNSC", "FPN", "DISEC", "UNHRC", "ECOFIN", "Other"],
            required: true,
        },
        foodPreference: {
            type: String,
            enum: ["Vegetarian", "Non-Vegetarian"],
            required: true,
        },
        paymentMethod: {
            type: String,
            enum: ["eSewa", "Khalti", "Bank Transfer"],
            required: true,
        },
        transactionReceipt: {
            type: String, //Cloudinary url
            unique: true,
            required: true,
        }
    }, 
    {
        timestamps: true
    }
);

export const Delegate = mongoose.model("Delegate", DelegateSchema);

// User.models.js remains unchanged