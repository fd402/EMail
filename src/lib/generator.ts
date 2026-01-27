import { render } from '@react-email/components';
import { EmailPreview } from '@/components/preview/EmailPreview';
import { EmailContent } from '@/types/editor';
import React from 'react';

export const generateHTML = async (content: EmailContent) => {
    if (!content) return '';

    // We need to render the EmailPreview component to HTML
    // Note: render is an async function in some versions or sync in others.
    // @react-email/components v0.0.12+ exports render

    const html = await render(React.createElement(EmailPreview, { content }), {
        pretty: true,
    });

    return html;
};

export const copyToClipboard = async (html: string) => {
    try {
        const type = 'text/html';
        const blob = new Blob([html], { type });
        const data = [new ClipboardItem({ [type]: blob })];
        await navigator.clipboard.write(data);
        return true;
    } catch (error) {
        console.warn('ClipboardItem API not supported or failed, falling back to text', error);
        try {
            await navigator.clipboard.writeText(html);
            return true;
        } catch (e) {
            return false;
        }
    }
};
