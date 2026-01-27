export type NodeType =
    | 'doc'
    | 'paragraph'
    | 'heading'
    | 'text'
    | 'image'
    | 'emailButton' // Custom Block
    | 'bulletList'
    | 'orderedList'
    | 'listItem'
    | 'hardBreak'   // Shift+Enter
    | 'horizontalRule'; // Divider

export type MarkType =
    | 'bold'
    | 'italic'
    | 'strike'
    | 'link';

export interface Mark {
    type: MarkType;
    attrs?: Record<string, any>;
}

export interface EditorNode {
    type: NodeType;
    attrs?: Record<string, any>;
    content?: EditorNode[];
    text?: string;
    marks?: Mark[];
}

export interface EmailContent {
    type: 'doc';
    content: EditorNode[];
}
