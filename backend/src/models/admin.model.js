import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const SALT_ROUNDS = 10;
const USERNAME_REGEX = /^[a-zA-Z0-9_]+$/;
const EMAIL_REGEX = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const adminSchema = new mongoose.Schema({
    adminName: {
        type: String,
        required: [true, "Username is required"],
        unique: true,
        trim: true,
        index: true,
        minLength: [3, "Username must be at least 3 characters"],
        maxLength: [30, "Username cannot exceed 30 characters"],
        match: [USERNAME_REGEX, "Username can only contain letters, numbers and underscores"]
    },
    adminEmail: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        trim: true,
        index: true,
        lowercase: true,
        match: [EMAIL_REGEX, "Please enter a valid email address"]
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        select: false, // Don't return password in queries by default
        validate: {
            validator: (password) => PASSWORD_REGEX.test(password),
            message: "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number and one special character"
        }
    },
    role: {
        type: String,
        enum: {
            values: ["SUPER_ADMIN", "ADMIN"],
            message: "{VALUE} is not a valid role"
        },
        default: "ADMIN",
        index: true // Add index for role queries
    },
    superAdminCode: {
        type: String,
        select: false,
        sparse: true
    },
    isActive: {
        type: Boolean,
        default: true,
        index: true // Add index for active status queries
    },
    refreshToken: {
        type: String,
        select: false
    }
}, {
    timestamps: true
});

// Ensure only one SUPER_ADMIN exists
adminSchema.index(
    { role: 1 },
    {
        partialFilterExpression: { role: "SUPER_ADMIN" },
        unique: true,
        name: "single_super_admin_constraint"
    }
);

// Add compound index for login queries
adminSchema.index({ adminEmail: 1, isActive: 1 });

// Pre-save middleware
adminSchema.pre("save", async function(next) {
    try {
        if (!this.isModified('password') && !this.isModified('superAdminCode')) {
            return next();
        }

        if (this.isModified('password')) {
            this.password = await bcrypt.hash(this.password, SALT_ROUNDS);
        }

        if (this.role === "SUPER_ADMIN" && this.isModified('superAdminCode')) {
            this.superAdminCode = await bcrypt.hash(this.superAdminCode, SALT_ROUNDS);
        }

        next();
    } catch (error) {
        next(error);
    }
});

// Instance methods
adminSchema.methods = {
    async isPasswordCorrect(password) {
        try {
            return await bcrypt.compare(password, this.password);
        } catch (error) {
            throw new Error(`Error verifying password: ${error.message}`);
        }
    },

    async isValidSuperAdminCode(code) {
        try {
            if (!this.superAdminCode) return false;
            return await bcrypt.compare(code, this.superAdminCode);
        } catch (error) {
            throw new Error(`Error verifying super admin code: ${error.message}`);
        }
    },

    generateAccessToken() {
        try {
            const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || DEFAULT_JWT_CONFIG.accessTokenSecret;
            const accessTokenExpiry = process.env.ACCESS_TOKEN_EXPIRY || DEFAULT_JWT_CONFIG.accessTokenExpiry;

            if (!accessTokenSecret) {
                throw new Error("ACCESS_TOKEN_SECRET environment variable is not configured");
            }

            return jwt.sign(
                {
                    _id: this._id,
                    email: this.adminEmail,
                    adminName: this.adminName,
                    role: this.role
                },
                accessTokenSecret,
                { expiresIn: accessTokenExpiry }
            );
        } catch (error) {
            throw new Error(`Error generating access token: ${error.message}`);
        }
    },

    generateRefreshToken() {
        try {
            const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
            const refreshTokenExpiry = process.env.REFRESH_TOKEN_EXPIRY;

            if (!refreshTokenSecret) {
                throw new Error("REFRESH_TOKEN_SECRET environment variable is not configured");
            }

            return jwt.sign(
                { _id: this._id },
                refreshTokenSecret,
                { expiresIn: refreshTokenExpiry }
            );
        } catch (error) {
            throw new Error(`Error generating refresh token: ${error.message}`);
        }
    }
};

// Static methods
adminSchema.statics = {
    async findActiveAdmin(email) {
        return this.findOne({ adminEmail: email, isActive: true })
                  .select("+password");
    }
};

export const Admin = mongoose.model("Admin", adminSchema);