import { Admin } from "../models/admin.model.js";
import { Delegate } from "../models/Delegates.models.js";
import { Executive } from "../models/Executives.models.js";
import { ApiError } from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asynchandler.js";

const exportTableData = asyncHandler(async (req, res) => {
    // Check if user is authenticated and is an admin
    if (!req.admin || !["ADMIN", "SUPER_ADMIN"].includes(req.admin.role)) {
        throw new ApiError(403, "Unauthorized access");
    }

    const { table } = req.params;
    let data;
    let sanitizedData;

    try {
        switch (table.toLowerCase()) {
            case 'delegates':
                data = await Delegate.find()
                    .select('-__v')
                    .lean();
                sanitizedData = data.map(delegate => ({
                    ...delegate,
                    transactionRecipt: delegate.transactionRecipt ? 'Available' : 'Not Available'
                }));
                break;

            case 'executives':
                data = await Executive.find()
                    .select('-__v')
                    .lean();
                sanitizedData = data.map(executive => ({
                    ...executive,
                    cv: executive.cv ? 'Available' : 'Not Available'
                }));
                break;

            case 'admins':
                // Only SUPER_ADMIN can view admin list
                if (req.admin.role !== "SUPER_ADMIN") {
                    throw new ApiError(403, "Unauthorized to view admin data");
                }
                data = await Admin.find()
                    .select('-password -refreshToken -superAdminCode -__v')
                    .lean();
                sanitizedData = data;
                break;

            default:
                throw new ApiError(400, "Invalid table specified");
        }

        // Add metadata to response
        const responseData = {
            data: sanitizedData,
            totalCount: sanitizedData.length,
            exportedAt: new Date().toISOString(),
            exportedBy: req.admin.adminName
        };

        return res.status(200).json(
            new ApiResponse(200, responseData, `${table} data exported successfully`)
        );

    } catch (error) {
        throw new ApiError(500, `Error exporting ${table} data: ${error.message}`);
    }
});

export { exportTableData };

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
        const admin = await Admin.findActiveAdmin(adminEmail.toLowerCase());
        
        if (!admin) {
            throw new ApiError(404, "Admin not found or account is deactivated");
        }

        const isPasswordValid = await admin.isPasswordCorrect(password);
        if (!isPasswordValid) {
            throw new ApiError(401, "Invalid credentials");
        }

        const accessToken = admin.generateAccessToken();
        const refreshToken = admin.generateRefreshToken();

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

        // Ensure cookie options are properly set for your environment
        const COOKIE_OPTIONS = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Only use secure in production
            sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
            path: '/',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        };

        // Set cookies and send response
        return res
            .status(200)
            .cookie("accessToken", accessToken, COOKIE_OPTIONS)
            .cookie("refreshToken", refreshToken, COOKIE_OPTIONS)
            .json(
                new ApiResponse(
                    200,
                    { 
                        admin: sanitizedAdmin,
                        accessToken, // Include tokens in response body for local storage backup
                        refreshToken 
                    },
                    "Login successful"
                )
            );
    } catch (error) {
        if (error instanceof ApiError) throw error;
        console.error("Login error:", error);
        throw new ApiError(500, "Error during login process");
    }
});

// 2. Then, modify the AdminDashboard.jsx component to handle authentication more robustly

// Add this utility function at the top of AdminDashboard.jsx
const getAuthToken = () => {
    // Try getting token from cookie first
    const cookieToken = document.cookie
        .split('; ')
        .find(row => row.startsWith('accessToken='))
        ?.split('=')[1];

    if (cookieToken) {
        return cookieToken;
    }

    // Fallback to localStorage if cookie is not available
    const adminData = JSON.parse(localStorage.getItem('adminData'));
    return adminData?.accessToken;
};

// Update the fetch functions to use the new getAuthToken utility
const fetchRegistrationData = async (table) => {
    try {
        setLoading(true);
        setError('');
        
        const accessToken = getAuthToken();

        if (!accessToken) {
            // Redirect to login if no token is found
            window.location.href = '/login';
            throw new Error('No access token found. Please log in again.');
        }

        const response = await fetch(`${API_BASE_URL}/api/v1/data/table/${table}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
            credentials: 'include'
        });
        
        if (response.status === 401) {
            // Handle unauthorized access
            window.location.href = '/login';
            throw new Error('Session expired. Please log in again.');
        }

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Failed to fetch ${table} data: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data || !data.data) {
            throw new Error('Invalid data format received from server');
        }

        setRegistrationData(data.data);
        setActiveDataTab(table);
    } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message || `Error fetching ${table} data. Please try again.`);
        setRegistrationData([]);
    } finally {
        setLoading(false);
    }
};

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

const listAdmins = asyncHandler(async (req, res) => {
    try {
        const admins = await Admin.find()
            .select('-password -refreshToken -superAdminCode')
            .sort({ role: 1, adminName: 1 });

        return res.status(200).json(
            new ApiResponse(200, admins, "Admins fetched successfully")
        );
    } catch (error) {
        throw new ApiError(500, "Error fetching admins");
    }
});

// Update the exports in admin.controller.js
export {
    registerAdmin,
    loginAdmin,
    removeAdmin,
    listAdmins
};