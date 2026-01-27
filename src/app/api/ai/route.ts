import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { text, action } = await req.json();

        if (!text) {
            return NextResponse.json({ error: 'Text is required' }, { status: 400 });
        }

        const apiKey = process.env.OPENAI_API_KEY;

        if (!apiKey) {
            return NextResponse.json({ error: 'API Key not configured' }, { status: 500 });
        }

        let prompt = '';
        switch (action) {
            case 'shorter':
                prompt = `Make the following text concise while keeping its core meaning: "${text}"`;
                break;
            case 'longer':
                prompt = `Expand the following text with more details, examples, and elaboration while maintaining the same tone and key message: "${text}"`;
                break;
            case 'grammar':
                prompt = `Correct any grammatical or spelling errors in the following text. Only return the corrected text: "${text}"`;
                break;
            case 'friendlier':
                prompt = `Rewrite the following text in a warm, welcoming, and friendly tone: "${text}"`;
                break;
            case 'generate-template':
                prompt = `
You are an expert email designer. Create a JSON structure for a professional email template based on this request: "${text}".

Return ONLY a valid JSON array of Block objects. Do not include markdown formatting or explanation.

Block Types & Structure:
1. HEADER: { id: "...", type: "text", content: { text: "Big Title" }, styles: { fontSize: "32px", fontWeight: "bold", textAlign: "center", padding: "20px" } }
2. TEXT: { id: "...", type: "text", content: { text: "Paragraph..." }, styles: { fontSize: "16px", padding: "10px 20px" } }
3. IMAGE: { id: "...", type: "image", content: { src: "https://placehold.co/600x300", alt: "..." }, styles: { width: "100%", padding: "10px" } }
4. BUTTON: { id: "...", type: "button", content: { text: "Click Me", url: "#" }, styles: { backgroundColor: "#6366f1", color: "#fff", padding: "12px 24px", borderRadius: "8px", margin: "0 auto", display: "table" } }
5. DIVIDER: { id: "...", type: "divider", content: {}, styles: { padding: "20px 0" } }
6. SOCIAL: { id: "...", type: "social", content: { networks: { facebook: true, instagram: true } }, styles: { textAlign: "center", padding: "20px" } }

Rules:
- Generate realistic, professional content (not just "Text here").
- Use modern hex colors.
- Ensure IDs are unique strings.
- Return strictly an Array: [ { rule 1... }, { rule 2... } ]
- For the Hero section, usage a large Text block followed by an Image.
- Always end with a Footer (Text block with small gray text).
`;
                break;
            default:
                prompt = `Refine this text: "${text}"`;
        }

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [
                    { role: 'system', content: 'You are a helpful copywriting assistant for email marketing. Return only the revised text, no explanations.' },
                    { role: 'user', content: prompt }
                ],
                temperature: 0.7,
            }),
        });

        const data = await response.json();

        if (data.error) {
            console.error('OpenAI Error:', data.error);
            return NextResponse.json({ error: data.error.message }, { status: 500 });
        }

        const result = data.choices[0].message.content.trim();
        return NextResponse.json({ result });
    } catch (error) {
        console.error('AI Route Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
