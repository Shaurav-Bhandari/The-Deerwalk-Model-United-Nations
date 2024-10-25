import { asyncHandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/Users.models.js";
import ApiResponse from "../utils/ApiResponse.js";
import registerDelegate from "./delegate.controller.js";
import registerExecutive from "./Executive.controller.js";

const registerUser = asyncHandler(async (req, res) => {
    const { fullName, email, contact, role } = req.body;
    console.log("FULLNAME", fullName);

    if ([fullName, email, contact, role].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }
    
    const checkUserExists = await User.findOne({
        $or: [{ email }, { contact }]
    });
    
    if (checkUserExists) {
        throw new ApiError(409, "User with the email or contact already exists...");
    }

    console.log("USER CREDENTIALS VERIFIED. MOVING ON TO FURTHER PROCESSES...");
    
    const user = await User.create({
        fullName,
        email,
        contact,
        role,
    });

    if (!user) {
        throw new ApiError(500, "Internal Server Error while creating user");
    }

    let registeredData;
    try {
        req.user = user;
        
        if (role === "Delegate") {
            registeredData = await registerDelegate(req, res);
            return res.status(201).json(
                new ApiResponse(200, {
                    user,
                    delegate: registeredData
                }, "Delegate registered successfully!")
            );
        }
        
        if (role === "Executive") {
            registeredData = await registerExecutive(req, res);
            return res.status(201).json(
                new ApiResponse(200, {
                    user,
                    executive: registeredData
                }, "Executive registered successfully!")
            );
        }

        // If role is neither Delegate nor Executive
        return res.status(201).json(
            new ApiResponse(200, { user }, "User registration successful!")
        );

    } catch (error) {
        // If registration fails, clean up the created user
        await User.findByIdAndDelete(user._id);
        throw error;
    }
});

export { registerUser };