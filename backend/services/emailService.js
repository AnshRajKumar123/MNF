const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: process.env.EMAIL_PORT == 465, // false for port 587
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    connectionTimeout: 10000, // 10 seconds timeout
});

transporter.verify((err) => {
    if (err) {
        console.error(err);
    } else {
        console.log("SMTP Ready");
    }
});

const sendEmail = async ({ to, subject, html }) => {
    return await transporter.sendMail({
        from: `"MidNight Food" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html,
    });
};

module.exports = {
    sendEmail,
};