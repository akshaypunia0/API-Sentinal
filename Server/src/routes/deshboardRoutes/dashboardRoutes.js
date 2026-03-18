import { Router } from 'express';
import authMiddleware from '../../middlewares/authMiddleware.js';
import { dashboardData, getRecentActivities } from '../../controllers/dashboardControllers/dashboardControllers.js';

const router = Router()

router.get("/dashboard", authMiddleware, dashboardData)
router.get("/dashboard/recent", authMiddleware, getRecentActivities)


export default router