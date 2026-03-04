import express from "express"
import authMiddleware from "../../middlewares/authMiddleware.js"
import { registerApi, getAllApisByProjectId, getApiById, updateApi, deleteApi } from "../../controllers/apiControllers/apiControllers.js"

const router = express.Router()


router.post("/:projectId/apis",authMiddleware, registerApi)
router.get("/:projectId/apis",authMiddleware, getAllApisByProjectId)
router.get("/:projectId/api/:apiId",authMiddleware, getApiById)
router.patch("/:projectId/api/:apiId",authMiddleware, updateApi)
router.delete("/:projectId/api/:apiId",authMiddleware, deleteApi)



export default router