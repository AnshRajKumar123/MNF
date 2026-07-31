const dns = require("dns");
dns.setDefaultResultOrder("ipv4first");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,

    family: 4,          // 👈 Force IPv4

    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const sendEmail = async ({ to, subject, html }) => {
    try {
        const info = await transporter.sendMail({
            from: `"MidNight Food" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html,
        });

        console.log("✅ Email sent");
        console.log(info.messageId);
        console.log(info);

        return info;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

module.exports = {
    sendEmail,
};