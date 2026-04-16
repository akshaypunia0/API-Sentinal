import apiServices from "../../services/apiServices/apiServices.js"
import monitoringServices from "../../services/monitoringServices/monitoringServices.js"


const totalApisOfUser = async (req, res, next) => {
    try {
        const userId = req.user.id

        const totalApis = await apiServices.totalApisOfUser(userId)
        return res.status(200).json({
            status: "success",
            message: "Total APIs fetched successfully",
            totalApis
        })

    } catch (error) {
        next(error)
    }
}


const registerApi = async (req, res, next) => {
    try {
        const { projectId } = req.params
        const {
            title,
            url,
            method,
            intervalMinutes,
            expectedStatusCodes,
            isActive,
            // Authentication fields
            authType = 'NONE',
            authToken,
            authHeaderName,
            authHeaderValue,
            username,
            password,
            // Optional health check URL
            healthCheckUrl
        } = req.body
        const userId = req.user.id

        // Validate required fields
        if (!title || title.trim() === "" || !url || url.trim() === "" || !method) {
            return res.status(400).json({ message: "Missing required fields: title, url, method" })
        }

        // Validate interval minutes (allowed: 1, 5, 10, 15, 30, 60)
        const allowedIntervals = [1, 5, 10, 15, 30, 60]
        if (!allowedIntervals.includes(intervalMinutes)) {
            return res.status(400).json({
                message: "Invalid interval. Allowed values: 1, 5, 10, 15, 30, 60 minutes"
            })
        }

        // Validate expected status codes
        if (!expectedStatusCodes || !Array.isArray(expectedStatusCodes) || expectedStatusCodes.length === 0) {
            return res.status(400).json({ message: "Expected status codes must be a non-empty array" })
        }

        // Validate authentication configuration
        if (authType !== 'NONE') {
            switch (authType) {
                case 'BEARER_TOKEN':
                    if (!authToken) {
                        return res.status(400).json({ message: "Bearer token is required" })
                    }
                    break
                case 'API_KEY':
                    if (!authHeaderName || !authToken) {
                        return res.status(400).json({ message: "API key header name and token are required" })
                    }
                    break
                case 'BASIC_AUTH':
                    if (!username || !password) {
                        return res.status(400).json({ message: "Username and password are required for Basic Auth" })
                    }
                    break
                case 'CUSTOM_HEADER':
                    if (!authHeaderName || !authHeaderValue) {
                        return res.status(400).json({ message: "Custom header name and value are required" })
                    }
                    break
                default:
                    return res.status(400).json({ message: "Invalid auth type" })
            }
        }

        const newApi = await apiServices.registerApi({
            projectId,
            title,
            url,
            method,
            intervalMinutes,
            expectedStatusCodes,
            isActive,
            userId,
            // Authentication fields
            authType,
            authToken,
            authHeaderName,
            authHeaderValue,
            username,
            password,
            // Optional health check URL
            healthCheckUrl
        })

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
        const {
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
            password,
            // Optional health check URL
            healthCheckUrl
        } = req.body
        const userId = req.user.id

        // Validate required fields
        if (!title || title.trim() === "" || !url || url.trim() === "" || !method) {
            return res.status(400).json({ message: "Missing required fields: title, url, method" })
        }

        // Validate interval minutes (allowed: 1, 5, 10, 15, 30, 60)
        const allowedIntervals = [1, 5, 10, 15, 30, 60]
        if (!allowedIntervals.includes(intervalMinutes)) {
            return res.status(400).json({
                message: "Invalid interval. Allowed values: 1, 5, 10, 15, 30, 60 minutes"
            })
        }

        // Validate expected status codes
        if (!expectedStatusCodes || !Array.isArray(expectedStatusCodes) || expectedStatusCodes.length === 0) {
            return res.status(400).json({ message: "Expected status codes must be a non-empty array" })
        }

        // Validate authentication configuration if provided
        if (authType && authType !== 'NONE') {
            switch (authType) {
                case 'BEARER_TOKEN':
                    if (!authToken) {
                        return res.status(400).json({ message: "Bearer token is required" })
                    }
                    break
                case 'API_KEY':
                    if (!authHeaderName || !authToken) {
                        return res.status(400).json({ message: "API key header name and token are required" })
                    }
                    break
                case 'BASIC_AUTH':
                    if (!username || !password) {
                        return res.status(400).json({ message: "Username and password are required for Basic Auth" })
                    }
                    break
                case 'CUSTOM_HEADER':
                    if (!authHeaderName || !authHeaderValue) {
                        return res.status(400).json({ message: "Custom header name and value are required" })
                    }
                    break
                default:
                    return res.status(400).json({ message: "Invalid auth type" })
            }
        }

        const updatedApi = await apiServices.updateApi({
            apiId,
            projectId,
            title,
            url,
            method,
            intervalMinutes,
            expectedStatusCodes,
            isActive,
            userId,
            // Authentication fields
            authType,
            authToken,
            authHeaderName,
            authHeaderValue,
            username,
            password,
            // Optional health check URL
            healthCheckUrl
        })

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

        return res.status(200).json({
            status: "success",
            message: "API deleted successfully"
        })

    } catch (error) {
        next(error)
    }
}


const getApiLogs = async (req, res, next) => {
    try {
        const { apiId, projectId } = req.params
        const userId = req.user.id
        const limit = Number(req.query.limit) || 50
        const days = Number(req.query.days) || 7

        const logs = await monitoringServices.getApiLogs({ apiId, projectId, userId, limit, days })

        return res.status(200).json({
            status: "success",
            message: "API logs fetched successfully",
            logs
        })

    } catch (error) {
        next(error)
    }
}


const getApiStats = async (req, res, next) => {
    try {
        const { apiId, projectId } = req.params
        const userId = req.user.id
        const days = Number(req.query.days) || 7

        const stats = await monitoringServices.getApiStats({ apiId, projectId, userId, days })

        return res.status(200).json({
            status: "success",
            message: "API stats fetched successfully",
            stats
        })

    } catch (error) {
        next(error)
    }
}


// const triggerApiCheck = async (req, res, next) => {
//     try {

//         const {api} = req.body

//         // Perform immediate check
//         const logEntry = await monitoringServices.checkApi(api)

//         return res.status(200).json({
//             status: "success",
//             message: "API check completed",
//             result: logEntry
//         })

//     } catch (error) {
//         next(error)
//     }
// }

const checkInstantApi = async (req, res, next) => {
    try {
        const { url, method, authType, authToken, authHeaderName, authHeaderValue, username, password, body } = req.body

        if (!url || !method) {
            return res.status(400).json({
                message: "URL and method are required"
            })
        }

        switch (authType) {
            case "NONE":
                break
            case "BEARER_TOKEN":
                if (!authToken) {
                    return res.status(400).json({
                        message: "Bearer token is required"
                    })
                }
                break
            case "API_KEY":
                if (!authHeaderName || !authToken) {
                    return res.status(400).json({
                        message: "API key header name and token are required"
                    })
                }
                break
            case "BASIC_AUTH":
                if (!username || !password) {
                    return res.status(400).json({
                        message: "Username and password are required for Basic Auth"
                    })
                }
                break
            case "CUSTOM_HEADER":
                if (!authHeaderName || !authHeaderValue) {
                    return res.status(400).json({
                        message: "Custom header name and value are required"
                    })
                }
                break
            default:
                return res.status(400).json({
                    message: "Invalid auth type"
                })
        }

        // Perform immediate check
        const logEntry = await monitoringServices.instantApiCheck({
            url,
            method,
            authType,
            authToken,
            authHeaderName,
            authHeaderValue,
            username,
            password,
            body
        })

        return res.status(200).json({
            status: true,
            message: "API check completed",
            result: logEntry
        })

    } catch (error) {
        next(error)
    }
}





export {
    registerApi,
    getAllApisByProjectId,
    getApiById,
    updateApi,
    deleteApi,
    getApiLogs,
    getApiStats,
    totalApisOfUser,
    checkInstantApi
}