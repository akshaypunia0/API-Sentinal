import { prisma } from "../../config/db.js";
import AppError from "../../utills/appError.js";


const createProject = async ({ name, description, userId }) => {
    return await prisma.project.create({
        data: {
            name,
            description,
            userId
        }
    });
}


const getAllProjects = async ({ userId, page, limit }) => {
    const skip = (page - 1) * limit

    return await prisma.project.findMany({
        where: { userId },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" }
    });
}


const getProjectById = async ({ projectId, userId }) => {
    return await prisma.project.findFirst({
        where: {
            id: projectId,
            userId
        }
    });
}


const updateProject = async ({ projectId, userId, name, description }) => {

    const project = await prisma.project.findFirst({
        where: {
            id: projectId,
            userId
        }
    });

    if (!project) {
        throw new AppError("Project not found", 404);
    }

    const existing = await prisma.project.findFirst({
        where: {
            name,
            userId,
            NOT: { id: projectId }
        }
    })

    if (existing) {
        throw new AppError("Another project with the same name already exists", 400);
    }

    return await prisma.project.update({
        where: {
            id: projectId
        },
        data: {
            name,
            description
        }
    });
}


const deleteProject = async ({ projectId, userId }) => {
    const project = await prisma.project.findFirst({
        where: {
            id: projectId,
            userId
        }
    });

    if (!project) {
        throw new AppError("Project not found", 404);
    }

    return await prisma.project.delete({
        where: {
            id: projectId
        }
    });
}




export default {
    createProject,
    getAllProjects,
    getProjectById,
    updateProject,
    deleteProject
}