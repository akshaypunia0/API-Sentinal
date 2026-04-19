import nodemailer from "nodemailer";


// Email configuration
const emailTransporter = nodemailer.createTransport({

    service: process.env.SMTP_SERVICE || "gmail",
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

export default emailTransporter