'use server';

import * as cheerio from 'cheerio';

export interface ScrapedProduct {
    title?: string;
    image?: string;
    description?: string;
    price?: string;
    currency?: string;
    originalPrice?: string;
    url?: string;
}

export async function scrapeProduct(url: string): Promise<ScrapedProduct | { error: string }> {
    try {
        if (!url) return { error: 'URL is required' };

        // Ensure URL has protocol
        const targetUrl = url.startsWith('http') ? url : `https://${url}`;

        const response = await fetch(targetUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.9,de;q=0.8',
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache',
            },
            next: { revalidate: 3600 } // Cache for 1 hour
        });

        if (!response.ok) {
            return { error: `Failed to fetch page: ${response.status} ${response.statusText}` };
        }

        const html = await response.text();
        const $ = cheerio.load(html);

        const data: ScrapedProduct = { url: targetUrl };

        // 1. Image
        data.image =
            $('meta[property="og:image"]').attr('content') ||
            $('meta[name="twitter:image"]').attr('content') ||
            $('link[rel="image_src"]').attr('href') ||
            $('#imgTagWrapperId img').attr('src') || // Amazon specific
            undefined;

        // 2. Title
        data.title =
            $('meta[property="og:title"]').attr('content') ||
            $('meta[name="twitter:title"]').attr('content') ||
            $('title').text() ||
            undefined;

        // 3. Description
        data.description =
            $('meta[property="og:description"]').attr('content') ||
            $('meta[name="description"]').attr('content') ||
            undefined;

        // 4. Extract Price
        // Helper to clean price
        const cleanPrice = (str: string) => str.replace(/[^0-9.,]/g, '').trim();

        // Try structured data first (JSON-LD)
        $('script[type="application/ld+json"]').each((_, el) => {
            try {
                const json = JSON.parse($(el).html() || '{}');
                const product = Array.isArray(json) ? json.find(i => i['@type'] === 'Product') : (json['@type'] === 'Product' ? json : null);

                if (product) {
                    if (!data.image && product.image) data.image = Array.isArray(product.image) ? product.image[0] : product.image;
                    if (!data.title && product.name) data.title = product.name;

                    const offers = product.offers;
                    if (offers) {
                        const offer = Array.isArray(offers) ? offers[0] : offers;
                        if (offer.price) {
                            data.price = cleanPrice(String(offer.price));
                            data.currency = offer.priceCurrency;
                        }
                    }
                }
            } catch (e) { }
        });

        // Amazon specific selectors if still missing
        if (!data.price) {
            const amazonPrice = $('.a-price .a-offscreen').first().text();
            if (amazonPrice) {
                data.price = cleanPrice(amazonPrice);
                // Amazon usually infers currency from domain, but let's try to find symbol
                const symbol = $('.a-price-symbol').first().text();
                if (symbol.includes('€')) data.currency = '€';
                else if (symbol.includes('$')) data.currency = '$';
                else if (symbol.includes('£')) data.currency = '£';
            }
        }

        // Fallback: Open Graph
        if (!data.price) {
            const amount = $('meta[property="product:price:amount"]').attr('content');
            const currency = $('meta[property="product:price:currency"]').attr('content');
            if (amount) {
                data.price = cleanPrice(amount);
                data.currency = currency;
            }
        }

        // Convert currency codes to symbols for consistency with our UI
        const currencyMap: Record<string, string> = { 'EUR': '€', 'USD': '$', 'GBP': '£', 'CHF': 'CHF', 'JPY': '¥' };
        if (data.currency && currencyMap[data.currency]) {
            data.currency = currencyMap[data.currency];
        }

        // Cleanups
        if (data.title) data.title = data.title.trim();
        if (data.description) data.description = data.description.trim();

        return data;

    } catch (error) {
        console.error('Scraping error:', error);
        return { error: 'Failed to scrape product data' };
    }
}
