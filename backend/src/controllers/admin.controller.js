import { Admin } from "../models/admin.model.js";
import { asyncHandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/ApiError.js";
import ApiResponse  from "../utils/ApiResponse.js";
import mongoose from "mongoose";

const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: true,
    sameSite: 'strict'
};

const registerAdmin = asyncHandler(async (req, res) => {
    // Validate super admin access
    if (req.admin?.role !== "SUPER_ADMIN") {
        throw new ApiError(403, "Unauthorized access");
    }

    const { adminName, adminEmail, password } = req.body;

    // Validate required fields
    if (!adminName?.trim() || !adminEmail?.trim() || !password?.trim()) {
        throw new ApiError(400, "All fields are required");
    }

    // Check for existing admin
    const adminExists = await Admin.findOne({
        $or: [
            { adminEmail: adminEmail.toLowerCase() },
            { adminName: adminName.trim() }
        ]
    });

    if (adminExists) {
        throw new ApiError(409, `Admin already exists with this ${adminExists.adminEmail === adminEmail.toLowerCase() ? 'email' : 'username'}`);
    }

    // Create new admin
    const admin = await Admin.create({
        adminName: adminName.trim(),
        adminEmail: adminEmail.toLowerCase(),
        password,
        role: "ADMIN"
    });

    const createdAdmin = await Admin.findById(admin._id)
        .select("-password -refreshToken");

    if (!createdAdmin) {
        throw new ApiError(500, "Error registering admin");
    }

    return res.status(201).json(
        new ApiResponse(201, createdAdmin, "Admin registered successfully")
    );
});

const loginAdmin = asyncHandler(async (req, res) => {
    const { adminEmail, password } = req.body;

    if (!adminEmail?.trim() || !password?.trim()) {
        throw new ApiError(400, "Email and password are required");
    }

    try {
        // Find active admin with password
        const admin = await Admin.findActiveAdmin(adminEmail.toLowerCase());
        
        if (!admin) {
            throw new ApiError(404, "Admin not found or account is deactivated");
        }

        const isPasswordValid = await admin.isPasswordCorrect(password);
        if (!isPasswordValid) {
            throw new ApiError(401, "Invalid credentials");
        }

        // Generate tokens
        let accessToken, refreshToken;
        try {
            accessToken = admin.generateAccessToken();
            refreshToken = admin.generateRefreshToken();
        } catch (tokenError) {
            console.error("Token generation error:", tokenError);
            throw new ApiError(500, "Error during authentication. Please contact support.");
        }

        // Update refresh token in database
        await Admin.findByIdAndUpdate(
            admin._id,
            { refreshToken },
            { new: true }
        );

        // Remove sensitive data
        const sanitizedAdmin = {
            _id: admin._id,
            adminEmail: admin.adminEmail,
            adminName: admin.adminName,
            role: admin.role
        };

        // Set cookies and send response
        return res
            .status(200)
            .cookie("accessToken", accessToken, COOKIE_OPTIONS)
            .cookie("refreshToken", refreshToken, COOKIE_OPTIONS)
            .json(
                new ApiResponse(
                    200,
                    { admin: sanitizedAdmin, accessToken, refreshToken },
                    "Login successful"
                )
            );
    } catch (error) {
        if (error instanceof ApiError) throw error;
        console.error("Login error:", error);
        throw new ApiError(500, "Error during login process");
    }
});

const removeAdmin = asyncHandler(async (req, res) => {
    // Validate super admin access
    if (req.admin?.role !== "SUPER_ADMIN") {
        throw new ApiError(403, "Unauthorized access");
    }

    const { adminId } = req.params;

    if (!adminId?.trim()) {
        throw new ApiError(400, "Admin ID is required");
    }

    // Validate if adminId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(adminId)) {
        throw new ApiError(400, "Invalid admin ID format");
    }

    const adminToRemove = await Admin.findById(adminId);

    if (!adminToRemove) {
        throw new ApiError(404, "Admin not found");
    }

    if (adminToRemove.role === "SUPER_ADMIN") {
        throw new ApiError(403, "Cannot remove super admin");
    }

    // Soft delete the admin
    await Admin.findByIdAndUpdate(
        adminId,
        { isActive: false },
        { new: true }
    );

    // Clear any existing sessions
    res.clearCookie("accessToken", COOKIE_OPTIONS)
       .clearCookie("refreshToken", COOKIE_OPTIONS);

    return res.status(200).json(
        new ApiResponse(200, null, "Admin removed successfully")
    );
});

export {
    registerAdmin,
    loginAdmin,
    removeAdmin
};