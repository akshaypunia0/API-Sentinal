import { prisma } from "../../config/db.js";
import axios from "axios";
import nodemailer from "nodemailer";

// Email configuration
const emailTransporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT || 587,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

// Rate limiting helper to prevent overwhelming APIs
const limit = (fn, concurrency = 5) => {
    const queue = [];
    let running = 0;

    const run = async () => {
        if (running >= concurrency || queue.length === 0) return;
        running++;
        const { fn: task, resolve, reject } = queue.shift();
        try {
            const result = await task();
            resolve(result);
        } catch (error) {
            reject(error);
        } finally {
            running--;
            run();
        }
    };

    return new Promise((resolve, reject) => {
        queue.push({ fn, resolve, reject });
        run();
    });
};

// Build authentication headers based on auth type
const buildAuthHeaders = (api) => {
    const headers = {
        "User-Agent": "API-Sentinel-Monitor/1.0"
    };

    switch (api.authType) {
        case "BEARER_TOKEN":
            if (api.authToken) headers["Authorization"] = `Bearer ${api.authToken}`;
            break;

        case "API_KEY":
            if (api.authHeaderName && api.authToken)
                headers[api.authHeaderName] = api.authToken;
            break;

        case "BASIC_AUTH":
            if (api.username && api.password) {
                const creds = Buffer.from(`${api.username}:${api.password}`).toString("base64");
                headers["Authorization"] = `Basic ${creds}`;
            }
            break;

        case "CUSTOM_HEADER":
            if (api.authHeaderName && api.authHeaderValue)
                headers[api.authHeaderName] = api.authHeaderValue;
            break;
    }

    return headers;
};

// Perform HTTP request with proper error handling
const performRequest = async (method, url, headers) => {
    return axios({
        method,
        url,
        timeout: 15000,
        headers,
        validateStatus: () => true // Don't throw on any status code
    });
};

// Check GET API (normal monitoring)
const checkGetApi = async (api, headers) => {
    return performRequest("GET", api.url, headers);
};

// Check non-GET API (dry-run monitoring)
const checkNonGetApi = async (api, headers) => {
    console.log(`🔍 Checking ${api.method} API: ${api.url} (dry-run mode)`);

    // Strategy 1: Use custom health check URL if provided
    if (api.healthCheckUrl) { 
        try {
            console.log(`   Using custom health URL: ${api.healthCheckUrl}`);
            const response = await performRequest("GET", api.healthCheckUrl, headers);
            console.log(`   ✅ Custom health check successful (${response.status})`);
            return response;
        } catch (error) {
            console.log(`   ❌ Custom health check failed: ${error.response?.status || error.code}`);
        }
    }

    // Strategy 2: Try HEAD request (best for checking availability without body)
    try {
        console.log(`   Trying HEAD request...`);
        const response = await performRequest("HEAD", api.url, headers);
        console.log(`   ✅ HEAD request successful (${response.status})`);
        return response;
    } catch (error) {
        console.log(`   ❌ HEAD request failed: ${error.response?.status || error.code}`);
    }

    // Strategy 3: Try OPTIONS request (checks CORS and method support)
    try {
        console.log(`   Trying OPTIONS request...`);
        const response = await performRequest("OPTIONS", api.url, headers);
        console.log(`   ✅ OPTIONS request successful (${response.status})`);
        return response;
    } catch (error) {
        console.log(`   ❌ OPTIONS request failed: ${error.response?.status || error.code}`);
    }

    // Strategy 4: Try GET request to the same endpoint (some APIs allow this)
    try {
        console.log(`   Trying GET request to same endpoint...`);
        const response = await performRequest("GET", api.url, headers);
        console.log(`   ✅ GET request successful (${response.status})`);
        return response;
    } catch (error) {
        console.log(`   ❌ GET request failed: ${error.response?.status || error.code}`);
    }

    // Strategy 5: Try common health endpoint patterns
    const origin = new URL(api.url).origin;
    const healthUrls = [
        `${origin}/health`,
        `${origin}/status`,
        `${origin}/ping`,
        `${origin}/api/health`,
        `${origin}/api/status`
    ];

    for (const healthUrl of healthUrls) {
        try {
            console.log(`   Trying health endpoint: ${healthUrl}`);
            const response = await performRequest("GET", healthUrl, headers);
            console.log(`   ✅ Health endpoint found: ${healthUrl} (${response.status})`);
            return response;
        } catch (error) {
            console.log(`   ❌ Health endpoint failed: ${healthUrl} (${error.response?.status || error.code})`);
        }
    }

    // If all strategies fail, throw error
    throw new Error(`No monitoring strategy succeeded for ${api.method} ${api.url}`);
};

// Create monitoring log entry
const createLog = async (apiId, statusCode, status, responseTime) => {
    return prisma.apiCheckLog.create({
        data: {
            apiId,
            statusCode,
            status,
            responseTimeMs: responseTime
        }
    });
};

// Send down alert email
const sendDownAlert = async (api, user) => {
    try {
        const mailOptions = {
            from: process.env.SMTP_USER,
            to: user.email,
            subject: `🚨 API Down Alert: ${api.title}`,
            html: `
                <h2>API Monitoring Alert</h2>
                <p><strong>API:</strong> ${api.title}</p>
                <p><strong>URL:</strong> ${api.url}</p>
                <p><strong>Method:</strong> ${api.method}</p>
                <p><strong>Status:</strong> DOWN</p>
                <p><strong>Time:</strong> ${new Date().toISOString()}</p>
                <p>Please check your API immediately.</p>
                ${api.method !== 'GET' ? '<p><em>Note: This API uses dry-run monitoring to avoid sending production data.</em></p>' : ''}
            `
        };

        await emailTransporter.sendMail(mailOptions);
        console.log(`📧 Down alert sent to ${user.email} for API: ${api.title}`);
    } catch (error) {
        console.error("❌ Failed to send down alert email:", error);
    }
};

// Send recovery alert email
const sendRecoveryAlert = async (api, user) => {
    try {
        const mailOptions = {
            from: process.env.SMTP_USER,
            to: user.email,
            subject: `✅ API Recovered: ${api.title}`,
            html: `
                <h2>API Recovery Alert</h2>
                <p><strong>API:</strong> ${api.title}</p>
                <p><strong>URL:</strong> ${api.url}</p>
                <p><strong>Method:</strong> ${api.method}</p>
                <p><strong>Status:</strong> BACK UP</p>
                <p><strong>Time:</strong> ${new Date().toISOString()}</p>
                <p>Your API is now responding normally.</p>
            `
        };

        await emailTransporter.sendMail(mailOptions);
        console.log(`📧 Recovery alert sent to ${user.email} for API: ${api.title}`);
    } catch (error) {
        console.error("❌ Failed to send recovery alert email:", error);
    }
};

// Main API checking function
const checkApi = async (api) => {
    const startTime = Date.now();
    const headers = buildAuthHeaders(api);

    try {
        let response;

        if (api.method === "GET") {
            response = await checkGetApi(api, headers);
        } else {
            response = await checkNonGetApi(api, headers);
        }

        const responseTime = Date.now() - startTime;
        const isExpected = api.expectedStatusCodes.includes(response.status);
        const status = isExpected ? "UP" : "DOWN";

        // Create log entry
        await createLog(api.id, response.status, status, responseTime);

        // Get previous status for comparison
        const previousStatus = api.currentStatus;

        // Update API status
        await prisma.api.update({
            where: { id: api.id },
            data: {
                currentStatus: status,
                lastCheckedAt: new Date(),
                lastResponseTimeMs: responseTime,
                failureCount: status === "DOWN" ? { increment: 1 } : 0
            }
        });

        // Send alerts based on status changes
        if (previousStatus === "UP" && status === "DOWN") {
            const project = await prisma.project.findUnique({
                where: { id: api.projectId },
                include: { user: true }
            });
            if (project?.user) await sendDownAlert(api, project.user);
        }

        if (previousStatus === "DOWN" && status === "UP") {
            const project = await prisma.project.findUnique({
                where: { id: api.projectId },
                include: { user: true }
            });
            if (project?.user) await sendRecoveryAlert(api, project.user);
        }

        console.log(`✅ ${api.title} (${api.method}) → ${response.status} (${responseTime}ms) [${status}]`);

    } catch (error) {
        const responseTime = Date.now() - startTime;

        // Create failure log entry
        await createLog(api.id, 0, "DOWN", responseTime);

        // Update API status
        await prisma.api.update({
            where: { id: api.id },
            data: {
                currentStatus: "DOWN",
                lastCheckedAt: new Date(),
                lastResponseTimeMs: responseTime,
                failureCount: { increment: 1 }
            }
        });

        console.log(`❌ ${api.title} (${api.method}) failed: ${error.message} (${responseTime}ms)`);

        // Send down alert if this is the first failure or it's been UP before
        if (api.currentStatus === "UP") {
            const project = await prisma.project.findUnique({
                where: { id: api.projectId },
                include: { user: true }
            });
            if (project?.user) await sendDownAlert(api, project.user);
        }
    }
};

// Check all active APIs with rate limiting
const checkAllActiveApis = async () => {
    try {
        console.log("🚀 Starting API monitoring cycle...");

        const apis = await prisma.api.findMany({
            where: { isActive: true }
        });

        console.log(`📊 Found ${apis.length} active APIs to monitor`);

        if (apis.length === 0) {
            console.log("✅ No active APIs to monitor");
            return;
        }

        // Process APIs with rate limiting to avoid overwhelming servers
        await Promise.all(
            apis.map(api => limit(() => checkApi(api)))
        );

        console.log(`✅ Monitoring cycle completed for ${apis.length} APIs`);

    } catch (error) {
        console.error('❌ Error in monitoring cycle:', error);
        throw error;
    }
};

// Get monitoring logs for an API
const getApiLogs = async ({ apiId, projectId, userId, limit = 50, days = 7 }) => {
    // Verify user owns the project
    const project = await prisma.project.findFirst({
        where: {
            id: projectId,
            userId
        }
    });

    if (!project) {
        throw new Error("Project not found or access denied");
    }

    // Verify API belongs to project
    const api = await prisma.api.findFirst({
        where: {
            id: apiId,
            projectId
        }
    });

    if (!api) {
        throw new Error("API not found");
    }

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const logs = await prisma.apiCheckLog.findMany({
        where: {
            apiId,
            checkedAt: {
                gte: startDate
            }
        },
        orderBy: {
            checkedAt: 'desc'
        },
        take: limit
    });

    return logs;
};

// Get API statistics
const getApiStats = async ({ apiId, projectId, userId, days = 7 }) => {
    // Verify access
    const project = await prisma.project.findFirst({
        where: {
            id: projectId,
            userId
        }
    });

    if (!project) {
        throw new Error("Project not found or access denied");
    }

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const logs = await prisma.apiCheckLog.findMany({
        where: {
            apiId,
            checkedAt: {
                gte: startDate
            }
        }
    });

    if (logs.length === 0) {
        return {
            totalChecks: 0,
            uptimePercentage: 0,
            averageResponseTime: 0,
            downCount: 0,
            currentStatus: null,
            lastCheckedAt: null
        };
    }

    const upCount = logs.filter(log => log.status === 'UP').length;
    const downCount = logs.filter(log => log.status === 'DOWN').length;
    const uptimePercentage = logs.length > 0 ? (upCount / logs.length) * 100 : 0;

    const totalResponseTime = logs.reduce((sum, log) => sum + log.responseTimeMs, 0);
    const averageResponseTime = logs.length > 0 ? totalResponseTime / logs.length : 0;

    // Get current API status
    const api = await prisma.api.findUnique({
        where: { id: apiId },
        select: {
            currentStatus: true,
            lastCheckedAt: true,
            failureCount: true
        }
    });

    return {
        totalChecks: logs.length,
        uptimePercentage: Math.round(uptimePercentage * 100) / 100,
        averageResponseTime: Math.round(averageResponseTime),
        downCount,
        currentStatus: api?.currentStatus || null,
        lastCheckedAt: api?.lastCheckedAt || null,
        failureCount: api?.failureCount || 0
    };
};

// Trigger manual API check
const triggerApiCheck = async (apiId, projectId, userId) => {
    // Verify access
    const project = await prisma.project.findFirst({
        where: {
            id: projectId,
            userId
        }
    });

    if (!project) {
        throw new Error("Project not found or access denied");
    }

    const api = await prisma.api.findFirst({
        where: {
            id: apiId,
            projectId
        }
    });

    if (!api) {
        throw new Error("API not found");
    }

    await checkApi(api);
    return { message: "API check completed" };
};

export default {
    checkAllActiveApis,
    checkApi,
    getApiLogs,
    getApiStats,
    triggerApiCheck,
    buildAuthHeaders
};