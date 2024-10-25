// routes/admin.routes.js
import { Router } from 'express';
import { registerAdmin, loginAdmin, removeAdmin } from '../controllers/admin.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/register', verifyJWT, registerAdmin);
router.post('/login', loginAdmin);
router.delete('/remove/:adminId', verifyJWT, removeAdmin);

export default router;

