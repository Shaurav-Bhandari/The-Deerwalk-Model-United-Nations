import { Router } from "express";
import { getAllDataEntries } from "../controllers/data.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route('/table/:table').get(verifyJWT, getAllDataEntries);

export default router;