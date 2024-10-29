import { User } from "../models/Users.models.js";
import { Delegate } from "../models/Delegates.models.js";
import { Executive } from "../models/Executives.models.js";
import { asyncHandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

const getAllDataEntries = asyncHandler(async (req, res) => {
    const { table } = req.params;
    
    let data;
    switch (table) {
        case 'users':
            data = await User.find({});
            break;
        case 'delegates':
            data = await Delegate.find({}).populate('user');
            break;
        case 'executives':
            data = await Executive.find({}).populate('user');
            break;
        default:
            throw new ApiError(400, "Invalid table name");
    }

    return res.status(200).json(
        new ApiResponse(200, data, `${table} data fetched successfully`)
    );
});

export { getAllDataEntries };