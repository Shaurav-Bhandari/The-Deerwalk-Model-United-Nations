import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { Admin } from '../models/admin.model.js';
import { ApiError } from '../utils/ApiError.js';
import ApiResponse  from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asynchandler.js';

const generateSuperAdminCode = () => {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
};

const initializeSuperAdmin = asyncHandler(async (req, res) => {
    const { adminName, adminEmail, password, initialSetupCode } = req.body;

    // Validate setup code
    if (!initialSetupCode || initialSetupCode !== process.env.INITIAL_SETUP_CODE) {
        throw new ApiError(401, "Invalid setup code");
    }

    // Check required fields
    if (!adminName?.trim() || !adminEmail?.trim() || !password?.trim()) {
        throw new ApiError(400, "All fields are required");
    }

    // Check if super admin exists
    const existingSuperAdmin = await Admin.findOne({ role: "SUPER_ADMIN" });
    if (existingSuperAdmin) {
        throw new ApiError(400, "Super admin already exists");
    }

    const superAdminCode = generateSuperAdminCode();

    // Create super admin
    await Admin.create({
        adminName: adminName.trim(),
        adminEmail: adminEmail.toLowerCase(),
        password,
        role: "SUPER_ADMIN",
        superAdminCode
    });

    return res.status(201).json(
        new ApiResponse(
            201,
            { superAdminCode },
            "Super admin initialized successfully. Please save the super admin code securely."
        )
    );
});

const transferSuperAdminRole = asyncHandler(async (req, res) => {
    const { newSuperAdminId, superAdminCode } = req.body;

    if (!newSuperAdminId?.trim() || !superAdminCode?.trim()) {
        throw new ApiError(400, "All fields are required");
    }

    // Get current super admin with code
    const currentSuperAdmin = await Admin.findOne({ role: "SUPER_ADMIN" })
                                       .select("+superAdminCode");
    
    if (!currentSuperAdmin) {
        throw new ApiError(404, "Super admin not found");
    }

    // Verify code
    const isValidCode = await currentSuperAdmin.isValidSuperAdminCode(superAdminCode);
    if (!isValidCode) {
        throw new ApiError(401, "Invalid super admin code");
    }

    // Find new admin
    const newSuperAdmin = await Admin.findById(newSuperAdminId);
    if (!newSuperAdmin) {
        throw new ApiError(404, "New admin not found");
    }

    if (!newSuperAdmin.isActive) {
        throw new ApiError(400, "Cannot transfer role to inactive admin");
    }

    const newSuperAdminCode = generateSuperAdminCode();

    // Use transaction for role transfer
    const session = await mongoose.startSession();
    try {
        await session.withTransaction(async () => {
            // Remove current super admin role
            await Admin.findByIdAndUpdate(
                currentSuperAdmin._id,
                {
                    role: "ADMIN",
                    $unset: { superAdminCode: 1 }
                },
                { session }
            );

            // Set new super admin
            await Admin.findByIdAndUpdate(
                newSuperAdmin._id,
                {
                    role: "SUPER_ADMIN",
                    superAdminCode: await bcrypt.hash(newSuperAdminCode, 10)
                },
                { session }
            );
        });

        return res.status(200).json(
            new ApiResponse(200, {
                message: "Super admin role transferred successfully",
                newSuperAdminCode
            })
        );
    } catch (error) {
        throw new ApiError(500, "Error transferring super admin role");
    } finally {
        session.endSession();
    }
});

const updateSuperAdminCode = asyncHandler(async (req, res) => {
    const { currentCode, newCode } = req.body;

    if (!currentCode?.trim() || !newCode?.trim()) {
        throw new ApiError(400, "All fields are required");
    }

    // Get super admin with code
    const superAdmin = await Admin.findOne({ role: "SUPER_ADMIN" })
                                .select("+superAdminCode");
    
    if (!superAdmin) {
        throw new ApiError(404, "Super admin not found");
    }

    // Verify current code
    const isValidCode = await superAdmin.isValidSuperAdminCode(currentCode);
    if (!isValidCode) {
        throw new ApiError(401, "Invalid current super admin code");
    }

    // Update code
    superAdmin.superAdminCode = newCode;
    await superAdmin.save();

    return res.status(200).json(
        new ApiResponse(200, null, "Super admin code updated successfully")
    );
});

export {
    initializeSuperAdmin,
    transferSuperAdminRole,
    updateSuperAdminCode
};