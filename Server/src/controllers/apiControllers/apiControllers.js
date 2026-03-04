import apiServices from "../../services/apiServices/apiServices.js"

const registerApi = async (req, res, next) => {
    try {
        const { projectId } = req.params
        const { title, url, method, intervalMinutes, expectedStatusCodes, isActive } = req.body
        const userId = req.user.id

        if (!title || title.trim() === "" || !url || url.trim() === "" || !method || !intervalMinutes || !expectedStatusCodes || !Array.isArray(expectedStatusCodes) || expectedStatusCodes.length === 0) {
            return res.status(400).json({ message: "Missing required fields" })
        }

        const newApi = await apiServices.registerApi({ projectId, title, url, method, intervalMinutes, expectedStatusCodes, isActive, userId })

        return res.status(201).json({
            status: "success",
            message: "API registered successfully",
            apiData: newApi
        })

    } catch (error) {

        if (error.code === "P2002") {
            return res.status(400).json({
                error: "API with this title already exists in this project"
            });
        }

        next(error)
    }
}


const getAllApisByProjectId = async (req, res, next) => {
    try {
        const { projectId } = req.params
        const page = Number(req.query.page) || 1
        const limit = Number(req.query.limit) || 10
        const userId = req.user.id

        const apis = await apiServices.getAllApisByProjectId({ projectId, userId, page, limit })

        return res.status(200).json({
            status: "success",
            message: "APIs fetched successfully",
            apis
        })


    } catch (error) {
        next(error)
    }
}


const getApiById = async (req, res, next) => {
    try {
        const { apiId, projectId } = req.params
        const userId = req.user.id

        const api = await apiServices.getApiById({ apiId, projectId, userId })

        return res.status(200).json({
            status: "success",
            message: "API fetched successfully",
            apiData: api
        })

    } catch (error) {
        next(error)
    }
}


const updateApi = async (req, res, next) => {
    try {
        const { apiId, projectId } = req.params
        const { title, url, method, intervalMinutes, expectedStatusCodes, isActive } = req.body
        const userId = req.user.id

        if (!title || title.trim() === "" || !url || url.trim() === "" || !method || !intervalMinutes || !expectedStatusCodes || !Array.isArray(expectedStatusCodes) || expectedStatusCodes.length === 0) {
            return res.status(400).json({ message: "Missing required fields" })
        }

        const updatedApi = await apiServices.updateApi({ apiId, projectId, title, url, method, intervalMinutes, expectedStatusCodes, isActive, userId })

        return res.status(200).json({
            status: "success",
            message: "API updated successfully",
            apiData: updatedApi
        })

    } catch (error) {
        next(error)
    }
}


const deleteApi = async (req, res, next) => {
    try {
        const { apiId, projectId } = req.params
        const userId = req.user.id

        await apiServices.deleteApi({ apiId, projectId, userId })

    } catch (error) {
        next(error)
    }
}



export {
    registerApi,
    getAllApisByProjectId,
    getApiById,
    updateApi,
    deleteApi
}