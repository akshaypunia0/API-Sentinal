import { prisma } from "../../config/db.js";
import AppError from "../../utills/appError.js";

const registerApi = async ({ projectId, title, url, method, intervalMinutes, expectedStatusCodes, isActive, userId, authType, authToken, authHeaderName, authHeaderValue, username, password }) => {

    const existingProject = await prisma.project.findFirst({
        where: {
            id: projectId,
            userId
        }
    })

    if (!existingProject) {
        throw new AppError("Project not found or you do not have permission to add APIs to this project", 404)
    }

    const newApi = await prisma.api.create({
        data: {
            projectId,
            title,
            url,
            method,
            intervalMinutes,
            expectedStatusCodes,
            isActive,
            // Authentication fields
            authType: authType || 'NONE',
            authToken,
            authHeaderName,
            authHeaderValue,
            username,
            password
        }
    })
    return newApi
}


const getAllApisByProjectId = async ({ projectId, userId, page, limit }) => {

    const skip = (page - 1) * limit

    const existingProject = await prisma.project.findFirst({
        where: {
            id: projectId,
            userId
        }
    })

    if (!existingProject) {
        throw new AppError("Project not found or you do not have permission to view APIs of this project", 404)
    }

    const apis = await prisma.api.findMany({
        where: {
            projectId
        },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" }
    })

    return apis
}


const getApiById = async ({ apiId, projectId, userId }) => {

    const existingProject = await prisma.project.findFirst({
        where: {
            id: projectId,
            userId
        }
    })

    if (!existingProject) {
        throw new AppError("Project not found or you do not have permission to view this API", 404)
    }

    const api = await prisma.api.findFirst({
        where: {
            id: apiId,
            projectId
        }
    })

    if (!api) {
        throw new AppError("API not found", 404)
    }

    return api
}


const updateApi = async ({ apiId, projectId, title, url, method, intervalMinutes, expectedStatusCodes, isActive, userId, authType, authToken, authHeaderName, authHeaderValue, username, password }) => {
    const existingProject = await prisma.project.findFirst({
        where: {
            id: projectId,
            userId
        }
    })

    if (!existingProject) {
        throw new AppError("Project not found or you do not have permission to update this API", 404)
    }

    const updatedApi = await prisma.api.update({
        where: {
            id: apiId,
            projectId
        },
        data: {
            title,
            url,
            method,
            intervalMinutes,
            expectedStatusCodes,
            isActive,
            // Authentication fields
            authType,
            authToken,
            authHeaderName,
            authHeaderValue,
            username,
            password
        }
    })

    return updatedApi
}


const deleteApi = async ({ apiId, projectId, userId }) => {
    const existingProject = await prisma.project.findFirst({
        where: {
            id: projectId,
            userId
        }
    })

    if (!existingProject) {
        throw new AppError("Project not found or you do not have permission to delete this API", 404)
    }

    await prisma.api.delete({
        where: {
            id: apiId,
            projectId
        }
    })
}



export default {
    registerApi,
    getAllApisByProjectId,
    getApiById,
    updateApi,
    deleteApi
}