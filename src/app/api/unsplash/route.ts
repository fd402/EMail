
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('query');
    const page = searchParams.get('page') || '1';

    if (!query) {
        return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    const accessKey = process.env.UNSPLASH_ACCESS_KEY;

    // Mock Mode (if no key is present)
    if (!accessKey) {
        console.warn('No UNSPLASH_ACCESS_KEY found. Serving mock data.');
        const mockImages = Array.from({ length: 12 }).map((_, i) => ({
            id: `mock-${i}-${Date.now()}`,
            urls: {
                small: `https://loremflickr.com/400/300/${encodeURIComponent(query)}?lock=${i}`,
                regular: `https://loremflickr.com/800/600/${encodeURIComponent(query)}?lock=${i}`
            },
            alt_description: `Mock image of ${query}`,
            user: {
                name: 'Mock Photographer',
                links: { html: '#' }
            }
        }));
        return NextResponse.json({ results: mockImages });
    }

    try {
        const response = await fetch(
            `https://api.unsplash.com/search/photos?page=${page}&query=${encodeURIComponent(query)}&per_page=12`,
            {
                headers: {
                    Authorization: `Client-ID ${accessKey}`,
                },
            }
        );

        if (!response.ok) {
            throw new Error(`Unsplash API error: ${response.statusText}`);
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Unsplash Route Error:', error);
        return NextResponse.json({ error: 'Failed to fetch images' }, { status: 500 });
    }
}
