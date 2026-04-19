import resetPasswordServices from "../../services/resetPasswordServices/resetPasswordServices.js"


const forgetPassword = async (req, res, next) => {
    try {
        const { email } = req.body
        await resetPasswordServices.forgetPasswordService(email)

        res.status(200).json({
            success: true,
            message: "If user exist, reset link sent to your email"
        })
    } catch (error) {
        next(error)
    }
}


const resetPassword = async (req, res, next) => {
    try {
        const { token, password } = req.body
        await resetPasswordServices.resetPasswordService(token, password)

        return res.status(200).json({
            success: true,
            message: "Password reset successfully"
        })

    } catch (error) {
        next(error)
    }
}

export {
    forgetPassword,
    resetPassword
}