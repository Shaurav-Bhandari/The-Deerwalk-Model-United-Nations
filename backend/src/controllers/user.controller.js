import { asyncHandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/Users.models.js";
import ApiResponse from "../utils/ApiResponse.js";
import registerDelegate from "./delegate.controller.js";
import registerExecutive from "./Executive.controller.js";

const registerUser = asyncHandler( async (req, res) => {
    const { fullName, email, contact, role } = req.body
    console.log("FULLNAME", fullName);

    if ([fullName, email, contact, role].some((field) => field?.trim() === "")) {
        throw new ApiError(
            400,
            `the fields are required fields`
        )
    }
    
    const checkUserExists = await User.findOne(
        {
            $or: [{ email }, { contact }]
        }
    );
    
    
    if (checkUserExists){
        throw new ApiError(
            409,
            "User with the email or contact already exists...",
        );
    } else {
        console.log("USER CREDENTIALS VERIFIED. MOVING ON TO FURTHER PROCESSES...");
        
    }
    const user = await User.create(
        {
            fullName,
            email,
            contact,
            role,
        }
    );

    
    let registeredData;
    if ( role === "Delegate"){
        req.user = user;
        registeredData = await registerDelegate(req, res);
        console.log(new ApiResponse( 200, registeredData, "delegate registered successfully!"));
        
    };
    if ( role === "Executive"){
        req.user = user;
        registeredData = await registerExecutive(req, res);
        console.log(new ApiResponse(200, registeredData, "executive registered successfully!!!"));
        
        registerExecutive(req, res);
    };
    
    if (!user) {
        throw new ApiError(500, "Internal Server Error");
    };
    return res.status(201).json(
        new ApiResponse(200, user, "Registration Success!"),
        
    );
})


export { registerUser };