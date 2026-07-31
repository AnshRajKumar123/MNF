const nodemailer = require("nodemailer");

console.log("🚀 Using Brevo SMTP");
const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});
console.log(process.env.SMTP_USER);

const sendEmail = async ({ to, subject, html }) => {
    try {
        const info = await transporter.sendMail({
            from: '"MidNight Food" <b3f8b3001@smtp-brevo.com>',
            to,
            subject,
            html,
        });

        console.log("✅ Email sent");
        console.log(info.messageId);

        return info;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

module.exports = {
    sendEmail,
};