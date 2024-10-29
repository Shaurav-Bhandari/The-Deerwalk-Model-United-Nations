import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asynchandler.js';
import { Admin } from '../models/admin.model.js';
import { JWT_CONFIG } from '../Constants.js';
import dotenv from "dotenv";

dotenv.config();

export const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        // Get token from either cookies or Authorization header
        const token = req.cookies?.accessToken || 
                     req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            throw new ApiError(401, "Unauthorized request");
        }

        // Verify token
        const decodedToken = jwt.verify(token, JWT_CONFIG.accessTokenSecret);

        // Get admin from token
        const admin = await Admin.findById(decodedToken._id)
            .select("-password -refreshToken");

        if (!admin) {
            throw new ApiError(401, "Invalid Access Token");
        }

        if (!admin.isActive) {
            throw new ApiError(403, "Admin account is deactivated");
        }

        req.admin = admin;
        next();
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token");
    }
});