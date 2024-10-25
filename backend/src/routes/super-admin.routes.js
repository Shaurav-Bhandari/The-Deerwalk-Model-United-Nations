import { Router } from 'express';
import { 
    initializeSuperAdmin, 
    transferSuperAdminRole, 
    updateSuperAdminCode 
} from '../controllers/super-admin.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/initialize', initializeSuperAdmin);
router.post('/transfer', verifyJWT, transferSuperAdminRole);
router.post('/update-code', verifyJWT, updateSuperAdminCode);

export default router;