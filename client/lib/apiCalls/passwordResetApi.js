import apiAuth from "./authApi";

const forgetPassword = async (email) => {
    try {
        const response = await apiAuth.post("/password/forget-password", { email });
        return response.data;
    } catch (error) {
        throw new Error("Failed to send forget password link");
    }
}

const resetPassword = async (token, password) => {
    try {
        const response = await apiAuth.post("/password/reset-password", { token, password });
        return response.data;
    } catch (error) {
        throw new Error("Failed to reset password");
    }
}

export const passwordResetApi = {
    forgetPassword,
    resetPassword
}