import dotenv from "dotenv"
dotenv.config()

import monitoringServices from "./src/services/monitoringServices/monitoringServices.js"
import { prisma } from "./src/config/db.js"

// Debug script to test POST API monitoring
const debugPostApi = async () => {
    try {
        console.log("🔧 Connecting to database...")
        await prisma.$connect()

        // Find the POST API you registered
        const postApis = await prisma.api.findMany({
            where: {
                method: 'POST',
                title: {
                    contains: 'Third POST API'
                }
            }
        })

        if (postApis.length === 0) {
            console.log("❌ No POST APIs found with title containing 'Third POST API'")
            return
        }

        const api = postApis[0]
        console.log(`📋 Found API: ${api.title}`)
        console.log(`📍 URL: ${api.url}`)
        console.log(`🔐 Auth Type: ${api.authType}`)
        console.log(`⏱️  Interval: ${api.intervalMinutes} minutes`)
        console.log(`🏥 Health Check URL: ${api.healthCheckUrl || 'Not set'}`)

        console.log("\n🧪 Testing monitoring strategies...")

        // Test each monitoring strategy manually
        const authHeaders = monitoringServices.buildAuthHeaders(api)
        console.log("🔑 Auth Headers:", JSON.stringify(authHeaders, null, 2))

        // You can add more detailed testing here if needed

    } catch (error) {
        console.error("❌ Debug failed:", error)
    } finally {
        await prisma.$disconnect()
    }
}

// Run the debug
debugPostApi()