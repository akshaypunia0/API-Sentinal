import dotenv from "dotenv"
dotenv.config()

import express from "express"
import cors from "cors"
import authRoutes from "./routes/authRoutes.js"
import projectRoutes from "./routes/projectRoutes/projectRoutes.js"
import apiRoutes from "./routes/apiRoutes/apiRoutes.js"

const app = express()

app.use(cors())
app.use(express.json()) 

app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/user/projects", projectRoutes)
app.use("/api/v1/user/apis", apiRoutes)


import globalErrorHandler from "./middlewares/errorMiddleware.js"
app.use(globalErrorHandler)



export default app