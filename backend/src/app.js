import express from "express";
import cors from "cors";
import path from 'path';

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN
}));

app.use(express.json({
    limit: "30kb"
}))

app.use(express.urlencoded({
    extended: true,
    limit: "16kb"
}))

// For temporary storage before uploading to Cloudinary
app.use("/public", express.static(path.join(process.cwd(), "public")))

import userRouter from './routes/user.routes.js';

app.use("/api/v1/users", userRouter)

export { app }