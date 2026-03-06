import dotenv from "dotenv"
dotenv.config()

import monitoringServices from "./src/services/monitoringServices/monitoringServices.js"
import { connectDB } from "./src/config/db.js"

// Test script to manually trigger API monitoring
const testMonitoring = async () => {
    try {
        console.log("🔧 Connecting to database...")
        await connectDB()

        console.log("🧪 Running manual API monitoring check...")
        const results = await monitoringServices.checkAllActiveApis()

        console.log(`✅ Test completed. Checked ${results.length} APIs`)
        process.exit(0)

    } catch (error) {
        console.error("❌ Test failed:", error)
        process.exit(1)
    }
}

// Run the test
testMonitoring()