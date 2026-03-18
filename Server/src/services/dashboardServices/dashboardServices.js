import { prisma } from "../../config/db.js";

const getDashboardData = async (userId) => {
    // Edge case: auth middleware didn't attach a user id
    if (!userId) {
        return {
            stats: {
                totalProjects: 0,
                totalApis: 0,
                avgResponseTime: 0,
                activeAlerts: 0
            },
            charts: {
                responseTimeTrend: [],
                statusDistribution: {
                    healthy: 0,
                    slow: 0,
                    down: 0
                }
            }
        }
    }

    const totalProjects = await prisma.project.count({
        where: { userId }
    })

    const totalApis = await prisma.api.findMany({
        where: {
            project: {
                userId
            }
        }
    })


    const safeLogs = Array.isArray(totalApis) ? totalApis : []

    const avgResponseTime = safeLogs.reduce((sum, log) => {
        return sum + log.lastResponseTimeMs / safeLogs.length
    }, 0)

    let healthy = 0
    let slow = 0
    let down = 0

    safeLogs.forEach((log) => {
        const status = log?.currentStatus
        const responseTimeMs = Number(log?.lastResponseTimeMs)

        // If the check reported DOWN, count as down regardless of latency.
        if (status === "DOWN") {
            down++
            return
        }

        // If response time is missing/invalid, treat as an issue.
        if (!Number.isFinite(responseTimeMs)) {
            down++
            return
        }

        if (responseTimeMs < 400) healthy++
        else if (responseTimeMs >= 400 && responseTimeMs < 1000) slow++
        else down++
    })


    // ApiCheckLog does not have userId; scope logs via api -> project -> userId
    const logs = await prisma.apiCheckLog.findMany({
        where: {
            api: {
                project: {
                    userId
                }
            }
        },
        orderBy: { checkedAt: "desc" },
        take: 100
    })


    const responseTimeTrend = logs
        .slice(0, 10)
        .map((log) => ({
            time: log.checkedAt,
            responseTime: Number.isFinite(Number(log?.responseTimeMs)) ? Number(log.responseTimeMs) : null
        }))


    return {

        stats: {
            totalProjects,
            totalApis: totalApis.length,
            avgResponseTime: Number(avgResponseTime.toFixed(2)),
            activeAlerts: down
        },

        charts: {
            responseTimeTrend,
            statusDistribution: {
                healthy,
                slow,
                down
            }
        }

    }
}

const getRecentActivities = async (userId) => {

    const latestProject = await prisma.project.findFirst({
        where: { userId },
        orderBy: {
            createdAt: "desc"
        }
    })

    const latestApi = await prisma.api.findFirst({
        where: {
            project: {
                userId
            }
        },
        orderBy: {
            createdAt: "desc"
        }
    })

    return { 
        latestProject,
        latestApi
    }
}



export default {
    getDashboardData,
    getRecentActivities
}