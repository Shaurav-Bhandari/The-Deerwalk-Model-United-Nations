import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";


const router = Router();

router.route('/register').post(
    upload.fields([
        {
            name: "transactionRecipt",
            maxCount: 1,
        }, 
        {
            name: "cv",
            maxCount: 1,
        }
    ]),
    (req, res, next) => {
        console.log("Files uploaded:", req.files);
        next();
    },
    registerUser
)



export default router;