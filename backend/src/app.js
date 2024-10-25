import express from 'express';
import cors from 'cors';
import path from "path";
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import { config } from 'dotenv';
import morgan from 'morgan';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
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

app.use("/api/v1/users", userRouter);;
import adminRoutes from './routes/admin.routes.js';
import superAdminRoutes from './routes/super-admin.routes.js';

// Load environment variables
config();


// Security configurations
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});

// Middleware
app.use(helmet()); // Security headers
app.use(morgan('dev')); // Logging
app.use(limiter); // Rate limiting
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(express.static('public')); // If you have static files
app.use(cookieParser());

// Routes
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/super-admin', superAdminRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal server error',
        errors: err.errors || []
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});


export { app }