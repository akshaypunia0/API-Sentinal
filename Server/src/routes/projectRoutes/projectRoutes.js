import { Router } from 'express';
import authMiddleware from '../../middlewares/authMiddleware.js';
import {
    createProject,
    updateProject,
    getAllProjects,
    getProjectById,
    deleteProject
} from '../../controllers/projectControllers/projectControllers.js';


const router = Router()

router.post("/createProject", authMiddleware, createProject)
router.get("/getAllProjects", authMiddleware, getAllProjects)
router.get("/getProjectById/:id", authMiddleware, getProjectById)
router.patch("/updateProject/:id", authMiddleware, updateProject)
router.delete("/deleteProject/:id", authMiddleware, deleteProject)

export default router