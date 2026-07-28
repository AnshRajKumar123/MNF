const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    family: 4,
});

transporter.verify((err) => {
    if (err) {
        console.error(err);
    } else {
        console.log("SMTP Ready");
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