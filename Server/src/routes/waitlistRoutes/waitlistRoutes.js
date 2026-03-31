import { Router } from "express";
import { addToWaitlist, waitlistHealthCheck } from "../../controllers/waitlistControllers/waitlistControllers.js";

const router = Router()

router.post("/", addToWaitlist)
router.get("/healthCheck", waitlistHealthCheck)


export default router