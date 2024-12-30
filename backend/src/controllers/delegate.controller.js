import { Delegate } from "../models/Delegates.models.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asynchandler.js";
import { uploadOnCLoud } from "../utils/fileUpload.js";
import ApiResponse  from "../utils/ApiResponse.js";

const registerDelegate = asyncHandler(async (req, res) => {
    const {
        institute,
        address,
        grade,
        munExperience,
        primaryCommittee,
        secondaryCommittee,
        foodPreference,
        paymentMethod
    } = req.body;

    // Validation
    if (
        [
            institute,
            address,
            grade,
            munExperience,
            primaryCommittee,
            secondaryCommittee,
            foodPreference,
            paymentMethod
        ].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required");
    }

    // Check for transaction receipt
    let transactionReceiptLocalPath;
    if (req.files && Array.isArray(req.files.transactionReceipt) && req.files.transactionReceipt.length > 0){
        transactionReceiptLocalPath = req.files.transactionReceipt[0].path;
    }
    if (!transactionReceiptLocalPath) {
        throw new ApiError(400, "Transaction Receipt is required");
    }

    // Upload to cloudinary
    let transactionReceipt;
    try {
        transactionReceipt = await uploadOnCLoud(transactionReceiptLocalPath);
        if (!transactionReceipt){return next(new ApiError(500, "file upload fail."));}
    }
    catch
    {
        return next(new ApiError(500, "file upload fail"));
    }

    // Create delegate entry in db
    const createdDelegate = await Delegate.create({
        user: req.user._id,
        institute,
        address,
        grade,
        munExperience,
        primaryCommittee,
        secondaryCommittee,
        foodPreference,
        paymentMethod,
        transactionReceipt: transactionReceipt.url,
    });

    if (!createdDelegate) {
        throw new ApiError(500, "Something went wrong while registering the delegate");
    }

    return Delegate;
});


export { registerDelegate };