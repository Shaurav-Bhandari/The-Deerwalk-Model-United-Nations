import dotenv from 'dotenv';
import connectDB from "./db/index.js";  // Note the full path including .js
import { app } from './app.js';

dotenv.config();
connectDB()
.then(() => {
    app.listen(process.env.PORT || 3000, () => {
        console.log(`Server running at port ${process.env.PORT}`);
        
    })
})
.catch((err) => {
    console.log("MONGODB CONNECTION FAILED. ERROR:", err);
    
})