import { Resend } from 'resend';

export const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (to: string, subject: string, html: string) => {
    if (!process.env.RESEND_API_KEY) {
        console.error('RESEND_API_KEY is missing');
        return { success: false, error: 'Missing API Key' };
    }

    try {
        const data = await resend.emails.send({
            from: 'Plainly <hello@plainly.email>',
            to,
            subject,
            html,
        });
        return { success: true, data };
    } catch (error) {
        console.error('Resend Error:', error);
        return { success: false, error };
    }
};
