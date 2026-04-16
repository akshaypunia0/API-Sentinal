import dotenv from "dotenv"
dotenv.config()

import cookieParser from "cookie-parser"

import express from "express"
import cors from "cors"
import authRoutes from "./routes/authRoutes.js"
import projectRoutes from "./routes/projectRoutes/projectRoutes.js"
import apiRoutes from "./routes/apiRoutes/apiRoutes.js"
import dasboardRoutes from "./routes/deshboardRoutes/dashboardRoutes.js"
import waitlistRoute from "./routes/waitlistRoutes/waitlistRoutes.js"

const app = express()

app.use(cookieParser())

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}))

app.use(express.json())

app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/user", dasboardRoutes)
app.use("/api/v1/user/projects", projectRoutes)
app.use("/api/v1/user/apis", apiRoutes)
app.use("/api/v1/waitlist", waitlistRoute)


import globalErrorHandler from "./middlewares/errorMiddleware.js"
app.use(globalErrorHandler)



export default app