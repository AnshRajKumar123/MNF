const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
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