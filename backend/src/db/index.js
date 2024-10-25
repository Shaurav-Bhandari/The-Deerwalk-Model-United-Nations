import mongoose from "mongoose";
import { DB_NAME } from "../Constants.js";

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`);
        console.log(`\nMONGODB CONNECTION SUCCESSFUL !! DBHOST: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log("MongoDB connection error. ERROR:", error);
        process.exit(1);
    }
}

export default connectDB;