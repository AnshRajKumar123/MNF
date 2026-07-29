import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendResetEmail = async (toEmail, resetLink) => {
    try {
        const data = await resend.emails.send({
            from: 'onboarding@resend.dev', // Testing sender provided by Resend
            to: toEmail,
            subject: 'Password Reset Request',
            html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2>Password Reset Request</h2>
          <p>Click the link below to reset your password:</p>
          <a href="${resetLink}" style="background: #2563eb; color: #fff; padding: 10px 15px; border-radius: 5px; text-decoration: none;">Reset Password</a>
        </div>
      `,
        });
        return data;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};