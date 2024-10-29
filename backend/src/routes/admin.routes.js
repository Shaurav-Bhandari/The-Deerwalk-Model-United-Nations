// routes/admin.routes.js

import { Router } from 'express';
import { 
    registerAdmin, 
    loginAdmin, 
    removeAdmin, 
    listAdmins,
    exportTableData 
} from '../controllers/admin.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

// Public routes
router.route("/login").post(loginAdmin);

// Protected routes
router.use(verifyJWT); // Apply authentication middleware to all routes below

// Admin routes
router.route("/register").post(registerAdmin);
router.route("/remove/:adminId").delete(removeAdmin);
router.route("/list").get(listAdmins);
router.route("/export/:table").get(exportTableData);

export default router;