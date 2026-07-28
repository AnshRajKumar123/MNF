const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// TEMPORARY - verify connection
transporter.verify((error, success) => {
    if (error) {
        console.log("❌ Email configuration error:");
        console.log(error);
        console.error(error.code);
        console.error(error.message);
        console.error(error.response);
    } else {
        console.log("✅ Email server is ready.");
    }
});

const sendEmail = async ({ to, subject, html }) => {
    await transporter.sendMail({
        from: `"MidNight Food" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html,
    });
};

module.exports = {
    sendEmail,
};