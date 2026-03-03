import { prisma } from "../config/db.js"
import bcrypt from "bcryptjs"
import generateToken from "../utills/generateToken.js"

const register = async (req, res) => {
    try {

        const { fullName, email, phone, password } = req.body

        if (!fullName || !email || !password) {
            return res.status(400).json({
                error: "Missing required fields"
            })
        }

        const existingUser = await prisma.user.findUnique({
            where: {
                email
            }
        })

        if (existingUser) {
            return res.status(400).json({
                error: "User already exists"
            })
        }

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        const user = await prisma.user.create({
            data: {
                fullName,
                email,
                phone,
                password: hashPassword,
                role: "USER"
            }
        })

        const token = generateToken(user, res)

        return res.status(201).json({
            message: "User registered successfully",
            data: {
                id: user.id,
                fullName,
                email,
                phone,
                role: user.role
            },
            token
        })

    } catch (error) {
        return res.status(500).json({
            error: "user registration failed",
            details: error.message
        })
    }
}


const login = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({
                error: "Missing required fields"
            })
        }

        const user = await prisma.user.findUnique({
            where: {
                email
            }
        })

        if (!user) {
            return res.status(400).json({
                error: "Invalid credentials"
            })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return res.status(400).json({
                error: "Invalid credentials"
            })
        }

        const token = generateToken(user, res)

        return res.status(200).json({
            message: "Login successful",
            data: {
                id: user.id,
                fullName: user.fullName,
                email: user.email,
                phone: user.phone,
                role: user.role
            },
            token
        })

    } catch (error) {
        return res.status(500).json({
            error: "Login failed",
            details: error.message
        })
    }
}


const logout = async (req, res) => {
    res.clearCookie("token")
    return res.status(200).json({
        message: "Logged out successfully"
    })
}

export { register, login, logout }