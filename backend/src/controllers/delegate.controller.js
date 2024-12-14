import { Delegate } from "../models/Delegates.models.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asynchandler.js";
import { uploadOnCLoud } from "../utils/fileUpload.js";
import ApiResponse  from "../utils/ApiResponse.js"


const registerDelegate = asyncHandler(async (req, res) => {
    const { institute, address, grade, munExperience, primaryCommittee, secondaryCommittee, foodPreference, paymentMethod } = req.body;
    if ([institute, address, grade, munExperience, primaryCommittee, secondaryCommittee, foodPreference, paymentMethod].some((field) => field?.trim() === ""))
    {
        throw new ApiError(400, "All fields are required!");
    }

    // Update the field name to match frontend
    const transactionReceiptLocalPath = req.files?.transactionReceipt[0]?.path;
    if (!req.files?.transactionReceipt?.[0]) {
        throw new ApiError(
            409,
            "Transaction Receipt not found..."
        );
    }
    
    const transactionReceipt = await uploadOnCLoud(transactionReceiptLocalPath);
    
    const delegate = await Delegate.create({
        user: req.user._id, // Ensure this is being set
    institute: req.body.institute,
    address: req.body.address,
    grade: req.body.grade,
    munExperience: req.body.munExperience,
    primaryCommittee: req.body.primaryCommittee,
    secondaryCommittee: req.body.secondaryCommittee,
    foodPreference: req.body.foodPreference,
    paymentMethod: req.body.paymentMethod,
    transactionReceipt: req.files.transactionReceipt[0].path // Update field name here too
    });

    if (!delegate) {
        throw new ApiError(500, "Internal Server Error");
    }
    
    return delegate;
});
const getAllDelegates = asyncHandler(async (req, res) => {
    const delegates = await Delegate.find();
    
    return res.status(200).json({
        success: true,
        data: delegates,
        totalCount: delegates.length
    });
});

export { registerDelegate, getAllDelegates };

