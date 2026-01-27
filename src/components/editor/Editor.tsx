'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { SlashCommand, getSuggestionItems, renderItems } from './extensions/slash-command';
import { EmailButton } from './extensions/EmailButton';
import { uploadImage } from '@/lib/upload';
import Image from '@tiptap/extension-image';
import { useEffect, useState } from 'react';

const Editor = ({ onUpdate }: { onUpdate: (json: any) => void }) => {
    const [mounted, setMounted] = useState(false);

    const editor = useEditor({
        immediatelyRender: false,
        onUpdate: ({ editor }) => {
            onUpdate(editor.getJSON());
        },
        extensions: [
            StarterKit,
            EmailButton,
            Image,
            Placeholder.configure({
                placeholder: 'Press "/" for commands...',
            }),
            SlashCommand.configure({
                suggestion: {
                    items: getSuggestionItems,
                    render: renderItems,
                },
            }),
        ],
        content: '<p>Hello World! 🌎</p>',
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[500px]',
            },
            handleDrop: (view, event, slice, moved) => {
                if (!moved && event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files[0]) {
                    const file = event.dataTransfer.files[0];
                    if (file.type.startsWith('image/')) {
                        event.preventDefault();

                        const coordinates = view.posAtCoords({ left: event.clientX, top: event.clientY });

                        // Upload and insert
                        uploadImage(file).then((url) => {
                            const { schema } = view.state;
                            const node = schema.nodes.image.create({ src: url });
                            const transaction = view.state.tr.insert(coordinates?.pos || 0, node);
                            view.dispatch(transaction);
                        });
                        return true;
                    }
                }
                return false;
            },
        },
    });

    // Hydration fix
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className="max-w-4xl mx-auto p-8">
            <EditorContent editor={editor} />
        </div>
    );
};

export default Editor;
