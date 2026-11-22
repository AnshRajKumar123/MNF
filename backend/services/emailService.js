const nodemailer = require("nodemailer");

// 📧 Gmail Direct Transporter with App Password
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Verify SMTP connection on server startup
transporter.verify((error, success) => {
    if (error) {
        console.error("❌ Gmail SMTP Connection Error:", error);
    } else {
        console.log(`✅ Gmail Transporter Ready: Sending OTPs via ${process.env.EMAIL_USER}`);
    }
});

const sendEmail = async ({ to, subject, html }) => {
    try {
        const mailOptions = {
            from: `"MidNight Food" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`📨 Email dispatched to ${to}: Message ID: ${info.messageId}`);
        return info;
    } catch (error) {
        console.error("❌ sendEmail Error:", error);
        throw error;
    }
};

module.exports = { sendEmail };