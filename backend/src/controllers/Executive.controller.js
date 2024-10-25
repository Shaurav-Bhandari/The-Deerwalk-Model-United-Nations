import { Executive } from "../models/Executives.models.js";
import { ApiError } from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asynchandler.js";
import { uploadOnCLoud } from "../utils/fileUpload.js";

const registerExecutive = asyncHandler(async (req, res) => {
    const { user, committee, position } = req.body;
    if ([user, committee, position].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required!");
    }

    const cvLocalPath = req.files?.cv[0]?.path;
    if (!cvLocalPath) {
        throw new ApiError(409, "CV not found...");
    }

    let cv;
    try{
        cv = await uploadOnCLoud(cvLocalPath);
        if (!cv) {
            return next(new ApiError(500, "file upload fail"))
        }
    } catch (error) {
        return next(new ApiError(500, "file upload fail"))
    }
    

    const executive = await Executive.create({
        user,
        committee,
        position,
        cv: cv.url, // Use the uploaded URL from Cloudinary
    });

    if (!executive) {
        throw new ApiError(500, "Internal Server Error");
    }

   return executive;
});

export default registerExecutive;
