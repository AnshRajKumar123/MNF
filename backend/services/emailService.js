const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async ({ to, subject, html }) => {
    try {
        const { data, error } = await resend.emails.send({
            from: "MidNight Food <onboarding@resend.dev>",
            to,
            subject,
            html,
        });

        if (error) {
            throw new Error(error.message);
        }

        console.log("✅ Email sent successfully");
        console.log(data);

        return data;
    } catch (error) {
        console.error("❌ Resend Error:");
        console.error(error);
        throw error;
    }
};

module.exports = {
    sendEmail,
};