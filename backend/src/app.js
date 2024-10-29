import express from 'express';
import cors from 'cors';
import path from "path";
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import { config } from 'dotenv';
import morgan from 'morgan';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

// Load environment variables
config();

const app = express();

// Security configurations
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});

// CORS Configuration
const allowedOrigins = [
    'http://localhost:5173',  // Vite/React frontend
    'http://localhost:3000',  // Express backend
    process.env.CORS_ORIGIN   // Any additional origins from env
].filter(Boolean); // Remove falsy values

const corsOptions = {
    origin: function (origin, callback) {
        // Check if the origin is in our allowedOrigins array
        // null origin is allowed to support same-origin requests
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    exposedHeaders: ['Set-Cookie'],
};

// Middleware
app.use(cors(corsOptions)); // Apply CORS with options
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
})); // Security headers with cross-origin resource policy
app.use(morgan('dev')); // Logging
app.use(limiter); // Rate limiting
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(express.static('public')); // If you have static files
app.use(cookieParser());

// For temporary storage before uploading to Cloudinary
app.use("/public", express.static(path.join(process.cwd(), "public")));

// Import routes
import userRouter from './routes/user.routes.js';
import adminRoutes from './routes/admin.routes.js';
import superAdminRoutes from './routes/super-admin.routes.js';

// Routes
app.use("/api/v1/users", userRouter);
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

import dataRouter from './routes/data.routes.js';

app.use("/api/v1/data", dataRouter);
// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});


export { app };