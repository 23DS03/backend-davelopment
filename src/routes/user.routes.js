import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import { Upload } from "cloudinary";

const router = Router()

router.route("./register").post(
    Upload.field([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "cover image",
            maxCount: 1
        }
    ]),
    
    registerUser)

export default router;