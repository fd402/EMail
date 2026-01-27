import {
    Html,
    Head,
    Preview,
    Body,
    Container,
    Section,
    Text,
    Heading,
    Button,
    Img,
    Hr,
} from '@react-email/components';
import React from 'react';
import { EditorNode, EmailContent } from '@/types/editor';

interface EmailPreviewProps {
    content: EmailContent | null;
}

export const EmailPreview: React.FC<EmailPreviewProps> = ({ content }) => {
    if (!content || !content.content) return <div>Empty</div>;

    return (
        <div className="bg-gray-100 p-8 min-h-[600px] overflow-y-auto">
            <div className="bg-white mx-auto max-w-[600px] shadow-lg">
                {/* We render the React Email structure but inside a div for preview (not full HTML doc yet, or maybe yes?) */}
                {/* Actually for preview we might just render the Body content? 
             But React Email Components work best when rendering the full tree or specific parts.
             However, Html/Head tags might conflict if rendered inside a div in Next.js page.
             For a "Live Preview" in the app, we usually just render the inner content: Container/Section/Text.
             For "Export", we render the full Html.
         */}
                <Container className="bg-white p-8 font-sans">
                    {renderNodes(content.content)}
                </Container>
            </div>
        </div>
    );
};

const renderNodes = (nodes: EditorNode[]) => {
    return nodes.map((node, index) => {
        switch (node.type) {
            case 'heading':
                const Level = `h${node.attrs?.level || 1}` as any;
                return (
                    <Heading key={index} as={Level} className="text-gray-800 my-4">
                        {renderText(node.content)}
                    </Heading>
                );
            case 'paragraph':
                return (
                    <Text key={index} className="text-gray-700 text-base leading-relaxed my-3">
                        {renderText(node.content)}
                    </Text>
                );
            case 'emailButton':
                const { text, url, alignment, variant } = node.attrs || {};
                const alignClass = alignment === 'left' ? 'text-left' : alignment === 'right' ? 'text-right' : 'text-center';
                const btnColor = variant === 'secondary' ? 'bg-gray-200 text-gray-800' : 'bg-blue-600 text-white';

                return (
                    <Section key={index} className={`my-4 ${alignClass}`}>
                        <Button href={url} className={`px-6 py-3 rounded-md font-medium no-underline ${btnColor}`}>
                            {text}
                        </Button>
                    </Section>
                );
            case 'image':
                return (
                    <Img
                        key={index}
                        src={node.attrs?.src}
                        alt={node.attrs?.alt || ''}
                        className="max-w-full h-auto rounded-md my-4"
                    />
                );
            case 'bulletList':
                return (
                    <ul key={index} className="list-disc pl-5 my-3 text-gray-700">
                        {node.content?.map((li, i) => (
                            <li key={i} className="mb-1">
                                {renderText(li.content?.[0]?.content)} {/* listItem -> paragraph -> text usually */}
                            </li>
                        ))}
                    </ul>
                );
            case 'orderedList':
                return (
                    <ol key={index} className="list-decimal pl-5 my-3 text-gray-700">
                        {node.content?.map((li, i) => (
                            <li key={i} className="mb-1">
                                {renderText(li.content?.[0]?.content)}
                            </li>
                        ))}
                    </ol>
                );
            case 'horizontalRule': // Divider
                return <Hr key={index} className="border-gray-300 my-6" />;
            default:
                return null;
        }
    });
};

const renderText = (content?: EditorNode[]) => {
    if (!content) return null;
    return content.map((node, index) => {
        if (node.type === 'text') {
            let textEl: React.ReactNode = node.text || '';

            if (node.marks) {
                node.marks.forEach(mark => {
                    if (mark.type === 'bold') textEl = <strong key={mark.type}>{textEl}</strong>;
                    if (mark.type === 'italic') textEl = <em key={mark.type}>{textEl}</em>;
                    if (mark.type === 'strike') textEl = <s key={mark.type}>{textEl}</s>;
                    if (mark.type === 'link') {
                        textEl = <a href={mark.attrs?.href} target="_blank" className="text-blue-600 underline" key={mark.type}>{textEl}</a>;
                    }
                });
            }
            return <span key={index}>{textEl}</span>;
        }
        return null;
    });
};

export default EmailPreview;
