import { Router } from "express";
import { addToWaitlist } from "../../controllers/waitlistControllers/waitlistControllers.js";

const router = Router()

router.post("/", addToWaitlist)


export default router