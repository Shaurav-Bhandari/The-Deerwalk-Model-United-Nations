import { v2 as Cloudinary } from "cloudinary";
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();
Cloudinary.config(
    {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    }
    
)

const uploadOnCLoud = async (localFilePath) => {
    try {
        if (!localFilePath) return null;
        const response = await Cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
        });

        if (fs.existsSync(localFilePath)) {
                fs.unlinkSync(localFilePath);
                console.log("Local file deleted:", localFilePath);
            }
        console.log(response);
        
        return response; // Return the Cloudinary response with the file URL

    } catch (error) {
        console.error("Error uploading file to Cloudinary:", error);

        // Ensure the local file is deleted even if the upload fails
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
            console.log("Local file deleted after failure:", localFilePath);
        }

        return null; // Return null to indicate failure
    }
};

export { uploadOnCLoud };