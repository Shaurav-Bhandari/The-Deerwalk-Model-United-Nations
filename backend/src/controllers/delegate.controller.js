import { Delegate } from "../models/Delegates.models.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asynchandler.js";
import { uploadOnCLoud } from "../utils/fileUpload.js";
import ApiResponse  from "../utils/ApiResponse.js"


const registerDelegate = asyncHandler( async (req, res) => {
    const { institute, address, grade, munExperience, primaryCommittee, secondaryCommittee, foodPreference, paymentMethod } = req.body;
    if ([institute, address, grade, munExperience, primaryCommittee, secondaryCommittee, foodPreference, paymentMethod].some((field) => field?.trim() === ""))
    {
        throw new ApiError(400, "All fields are required!");
    }
    // const existedDelegate = await Delegate.findOne(
    //     {

    //     }
    // )
    const transactionReciptLocalPath = req.files?.transactionRecipt[0]?.path;
    if(!(req.files?.transactionRecipt[0])){
        throw new ApiError(
            409,
            "Transaction Recipt not found..."
        );
    }
    
    
    const transactionRecipt = await uploadOnCLoud(transactionReciptLocalPath);
    

    const delegate = await Delegate.create(
        {
            institute,
            address, 
            grade, 
            munExperience, 
            primaryCommittee, 
            secondaryCommittee, 
            foodPreference, 
            paymentMethod,
            transactionRecipt : transactionRecipt.url,
        }
    )
    if (!delegate) {
        throw new ApiError(500, "Internal Server Error");
    }
    
    // Send response and immediately return
    return delegate;
})

export default registerDelegate;