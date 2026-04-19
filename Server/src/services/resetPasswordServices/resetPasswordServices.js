import { prisma } from "../../config/db.js";
import crypto from "crypto"
import emailTransporter from "../../utills/emailService.js";
import bcrypt from "bcryptjs"
import AppError from "../../utills/appError.js";


const forgetPasswordService = async (email) => {
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
        throw new AppError("If user exist, reset link sent to your email", 200);
    }

    const rawToken = crypto.randomBytes(32).toString("hex")
    const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex")

    await prisma.user.update({
        where: { email },
        data: {
            passwordResetToken: hashedToken,
            passwordResetTokenExpiry: new Date(Date.now() + 15 * 60 * 1000)
        }
    })

    const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${rawToken}`

    const mailOptions = {
        from: process.env.SMTP_USER,
        to: email,
        subject: "Password Reset",
        html: `
            <h1>Password Reset Link</h1>
            <p>Click on the link or paste in browser to reset your password: ${resetLink}</p>
            <p>This link will expire in 15 minutes</p>
            <h6>If you did not request this reset, please ignore this email</h6>
            <br>
            <p>Thank you</p>
            <p>API Sentinel Team</p>
            `
    }
    await emailTransporter.sendMail(mailOptions)

    return { success: true }
}


const resetPasswordService = async (token, password) => {

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex")

    const user = await prisma.user.findFirst({
        where: {
            passwordResetToken: hashedToken,
            passwordResetTokenExpiry: { gt: new Date() }
        }
    })

    if (!user) {
        throw new AppError("Invalid or expired token", 400)
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    await prisma.user.update({
        where: { id: user.id },
        data: {
            password: hashedPassword,
            passwordResetToken: null,
            passwordResetTokenExpiry: null
        }
    })

    return { success: true }
}


export default {
    forgetPasswordService,
    resetPasswordService
}