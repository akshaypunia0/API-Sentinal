import express from "express"
import { forgetPassword, resetPassword } from "../../controllers/resetPasswordControllers/resetPasswordControllers.js"

const router = express.Router()

router.post("/forget-password", forgetPassword)
router.post("/reset-password", resetPassword)

export default router