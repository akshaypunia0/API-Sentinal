import express from "express"
import authMiddleware from "../../middlewares/authMiddleware.js"
import { registerApi, getAllApisByProjectId, getApiById, updateApi, deleteApi, getApiLogs, getApiStats, totalApisOfUser } from "../../controllers/apiControllers/apiControllers.js"

const router = express.Router()

router.get("/totalApis", authMiddleware, totalApisOfUser)
router.post("/:projectId/apis",authMiddleware, registerApi)
router.get("/:projectId/apis",authMiddleware, getAllApisByProjectId)
router.get("/:projectId/api/:apiId",authMiddleware, getApiById)
router.patch("/:projectId/api/:apiId",authMiddleware, updateApi)
router.delete("/:projectId/api/:apiId",authMiddleware, deleteApi)

// Monitoring routes
router.get("/:projectId/api/:apiId/logs",authMiddleware, getApiLogs)
router.get("/:projectId/api/:apiId/stats",authMiddleware, getApiStats)
// router.post("/triggerApi",authMiddleware, triggerApiCheck)



export default router