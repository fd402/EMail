import { Block } from '@/store/useEmailStore';

export interface EmailTemplate {
    id: string;
    name: string;
    description: string;
    category: string;
    thumbnail: string;
    backgroundColor?: string;
    blocks: Block[];
}

export const EMAIL_TEMPLATES: EmailTemplate[] = [
    {
        id: 'welcome',
        name: 'Welcome Email',
        description: 'Onboard new users with a warm welcome',
        category: 'Onboarding',
        thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80',
        blocks: [
            {
                id: 'welcome-text-1',
                type: 'text',
                content: { text: 'Welcome to the Future! ✨' },
                styles: { padding: '40px 30px 10px', textAlign: 'center', fontSize: '36px', fontWeight: '800', color: '#6366f1' }
            },
            {
                id: 'welcome-text-1-sub',
                type: 'text',
                content: { text: 'We\'re thrilled to have you on board. Your journey to creating stunning emails starts now.' },
                styles: { padding: '0px 30px 20px', textAlign: 'center', fontSize: '18px', color: '#64748b', lineHeight: '1.6' }
            },
            {
                id: 'welcome-button-1',
                type: 'button',
                content: { text: '🚀 Get Started', url: '#' },
                styles: {
                    backgroundColor: '#6366f1',
                    color: '#ffffff',
                    padding: '12px 32px',
                    textAlign: 'center',
                    borderRadius: '12px',
                    fontWeight: '700',
                    fontFamily: 'Arial',
                }
            },
            {
                id: 'welcome-image-1',
                type: 'image',
                content: { src: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80', alt: 'Welcome Team' },
                styles: { padding: '30px 0', textAlign: 'center', width: '100%', borderRadius: '12px' }
            },
            {
                id: 'welcome-divider-1',
                type: 'divider',
                content: { thickness: 1, color: '#e2e8f0', style: 'solid' },
                styles: { padding: '30px 0' }
            },
            {
                id: 'welcome-text-2-header',
                type: 'text',
                content: { text: 'What You Can Do ⚡' },
                styles: { padding: '10px 30px 10px', textAlign: 'left', fontSize: '24px', fontWeight: '700', color: '#1e293b' }
            },
            {
                id: 'welcome-text-2-body',
                type: 'text',
                content: { text: '🎨 Create Beautiful Emails - Design stunning emails in minutes\n📱 Mobile Optimized - Looks perfect on every device\n🎯 Pre-built Templates - Start with professional designs' },
                styles: { padding: '0px 30px 10px', textAlign: 'left', color: '#475569', lineHeight: '1.8', fontSize: '15px' }
            },
            {
                id: 'welcome-social-1',
                type: 'social',
                content: {
                    networks: { facebook: true, instagram: true, linkedin: true },
                    urls: { facebook: 'https://facebook.com', instagram: 'https://instagram.com', linkedin: 'https://linkedin.com' },
                    variant: 'color'
                },
                styles: { padding: '30px 0', textAlign: 'center' }
            }
        ]
    },
    {
        id: 'newsletter',
        name: 'Newsletter',
        description: 'Engage your audience with news and updates',
        category: 'Marketing',
        thumbnail: 'https://images.unsplash.com/photo-1557426272-fc759fdf7a8d?auto=format&fit=crop&w=400&q=80',
        blocks: [
            {
                id: 'newsletter-text-1',
                type: 'text',
                content: { text: '📰 The Daily Digest' },
                styles: { padding: '40px 30px 5px', textAlign: 'center', fontSize: '32px', fontWeight: '800', color: '#0f172a' }
            },
            {
                id: 'newsletter-text-1-sub',
                type: 'text',
                content: { text: 'Your weekly dose of insights, trends, and inspiration' },
                styles: { padding: '0px 30px 20px', textAlign: 'center', fontSize: '16px', color: '#64748b' }
            },
            {
                id: 'newsletter-image-1',
                type: 'image',
                content: { src: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80', alt: 'Modern Office' },
                styles: { padding: '20px 0', textAlign: 'center', width: '100%', borderRadius: '12px' }
            },
            {
                id: 'newsletter-text-2-header',
                type: 'text',
                content: { text: 'The Future of Email Design 🚀' },
                styles: { padding: '20px 30px 5px', textAlign: 'left', fontSize: '22px', fontWeight: '700', color: '#1e293b' }
            },
            {
                id: 'newsletter-text-2-body',
                type: 'text',
                content: { text: 'Modern email builders are revolutionizing how we connect with our audience. From drag-and-drop simplicity to AI-powered personalization, the future has never looked brighter.' },
                styles: { padding: '0px 30px 20px', textAlign: 'left', fontSize: '15px', color: '#475569', lineHeight: '1.8' }
            },
            {
                id: 'newsletter-divider-1',
                type: 'divider',
                content: { thickness: 2, color: '#3b82f6', style: 'solid' },
                styles: { padding: '25px 0' }
            },
            {
                id: 'newsletter-text-3-header',
                type: 'text',
                content: { text: 'Quick Bites 🔥' },
                styles: { padding: '20px 30px 5px', textAlign: 'left', fontSize: '20px', fontWeight: '700', color: '#1e293b' }
            },
            {
                id: 'newsletter-text-3-body',
                type: 'text',
                content: { text: 'New: Template library is now live!\nTip: Use dividers to organize your content\nTrending: Minimalist email designs' },
                styles: { padding: '0px 30px 20px', textAlign: 'left', fontSize: '15px', color: '#475569', lineHeight: '1.8' }
            },
            {
                id: 'newsletter-button-1',
                type: 'button',
                content: { text: '📖 Read More', url: '#' },
                styles: {
                    backgroundColor: '#6366f1',
                    color: '#ffffff',
                    padding: '12px 32px',
                    textAlign: 'center',
                    borderRadius: '12px',
                    fontWeight: '700',
                    fontFamily: 'Arial',
                }
            },
            {
                id: 'newsletter-social-1',
                type: 'social',
                content: {
                    networks: { facebook: true, x: true, linkedin: true },
                    urls: { facebook: '#', x: '#', linkedin: '#' },
                    variant: 'color'
                },
                styles: { padding: '30px 0', textAlign: 'center' }
            }
        ]
    },
    {
        id: 'product-launch',
        name: 'Product Launch',
        description: 'Announce your new product with impact',
        category: 'Product',
        thumbnail: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80',
        blocks: [
            {
                id: 'product-text-1',
                type: 'text',
                content: { text: 'Introducing Nova 🌟' },
                styles: { padding: '50px 30px 5px', textAlign: 'center', fontSize: '38px', fontWeight: '900', color: '#0f172a', letterSpacing: '-0.02em' }
            },
            {
                id: 'product-text-1-sub',
                type: 'text',
                content: { text: 'The Future of Productivity Starts Here' },
                styles: { padding: '0px 30px 20px', textAlign: 'center', fontSize: '18px', color: '#10b981', fontWeight: '600' }
            },
            {
                id: 'product-image-1',
                type: 'image',
                content: { src: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80', alt: 'Product Nova' },
                styles: { padding: '20px 0', textAlign: 'center', width: '100%', borderRadius: '12px' }
            },
            {
                id: 'product-text-2-header',
                type: 'text',
                content: { text: 'Game-Changing Innovation' },
                styles: { padding: '20px 30px 10px', textAlign: 'center', fontSize: '26px', fontWeight: '700', color: '#1e293b' }
            },
            {
                id: 'product-text-2-body',
                type: 'text',
                content: { text: 'Experience unparalleled performance with our revolutionary new platform. Built for creators, designed for success.' },
                styles: { padding: '0px 30px 20px', textAlign: 'center', fontSize: '16px', color: '#475569', lineHeight: '1.7' }
            },
            {
                id: 'product-button-1',
                type: 'button',
                content: { text: '🛒 Shop Now', url: '#' },
                styles: {
                    backgroundColor: '#10b981',
                    color: '#ffffff',
                    padding: '12px 32px',
                    textAlign: 'center',
                    borderRadius: '12px',
                    fontWeight: '700',
                    fontFamily: 'Arial',
                }
            },
            {
                id: 'product-divider-1',
                type: 'divider',
                content: { thickness: 1, color: '#d1fae5', style: 'solid' },
                styles: { padding: '35px 0' }
            },
            {
                id: 'product-text-3-header',
                type: 'text',
                content: { text: 'Why You\'ll Love It 💚' },
                styles: { padding: '10px 35px 15px', textAlign: 'left', fontSize: '22px', fontWeight: '700', color: '#1e293b' }
            },
            {
                id: 'product-text-3-body',
                type: 'text',
                content: { text: '✨ Intuitive Interface - So easy, anyone can use it\n⚡ Lightning Fast - Blazing performance, every time\n🔒 Secure & Private - Your data, protected\n🎨 Beautiful Design - Crafted with love' },
                styles: { padding: '0px 35px 20px', textAlign: 'left', fontSize: '15px', color: '#475569', lineHeight: '1.9' }
            },
            {
                id: 'product-button-2',
                type: 'button',
                content: { text: 'Learn More →', url: '#' },
                styles: {
                    backgroundColor: '#f0fdf4',
                    color: '#10b981',
                    padding: '14px 32px',
                    textAlign: 'center',
                    borderRadius: '10px',
                    width: '200px',
                    height: '52px',
                    fontWeight: '600',
                    border: '2px solid #10b981'
                }
            }
        ]
    },
    {
        id: 'event-invitation',
        name: 'Event Invitation',
        description: 'Invite attendees to your next event',
        category: 'Events',
        thumbnail: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=400&q=80',
        blocks: [
            {
                id: 'event-text-1',
                type: 'text',
                content: { text: 'You\'re Invited! 🎉' },
                styles: { padding: '45px 30px 10px', textAlign: 'center', fontSize: '36px', fontWeight: '800', color: '#0f172a' }
            },
            {
                id: 'event-text-1-sub',
                type: 'text',
                content: { text: 'Join us for an unforgettable experience' },
                styles: { padding: '0px 30px 20px', textAlign: 'center', fontSize: '17px', color: '#8b5cf6', fontWeight: '600' }
            },
            {
                id: 'event-image-1',
                type: 'image',
                content: { src: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80', alt: 'Tech Summit' },
                styles: { padding: '20px 0', textAlign: 'center', width: '100%', borderRadius: '12px' }
            },
            {
                id: 'event-block-1',
                type: 'event',
                content: {
                    title: 'Tech Summit 2024',
                    day: '15',
                    month: 'MAR',
                    time: '14:00 - 18:00',
                    accessUrl: '#',
                    itemColor: '#8b5cf6',
                    btnText: '📅 Add to Calendar'
                },
                styles: { padding: '25px 0', textAlign: 'center' }
            },
            {
                id: 'event-button-1',
                type: 'button',
                content: { text: '🎫 RSVP Now', url: '#' },
                styles: {
                    backgroundColor: '#6366f1',
                    color: '#ffffff',
                    padding: '12px 32px',
                    textAlign: 'center',
                    borderRadius: '12px',
                    fontWeight: '700',
                    fontFamily: 'Arial',
                }
            },
            {
                id: 'event-divider-1',
                type: 'divider',
                content: { thickness: 1, color: '#e9d5ff', style: 'dashed' },
                styles: { padding: '35px 0' }
            },
            {
                id: 'event-text-2-header',
                type: 'text',
                content: { text: 'What to Expect 🌟' },
                styles: { padding: '10px 35px 15px', textAlign: 'left', fontSize: '22px', fontWeight: '700', color: '#1e293b' }
            },
            {
                id: 'event-text-2-body',
                type: 'text',
                content: { text: '🎤 Expert Speakers - Industry leaders share insights\n🤝 Networking - Connect with like-minded innovators\n🚀 Live Demos - See cutting-edge technology\n☕ Refreshments - Premium food & beverages' },
                styles: { padding: '0px 35px 20px', textAlign: 'left', fontSize: '15px', color: '#475569', lineHeight: '1.9' }
            },
            {
                id: 'event-social-1',
                type: 'social',
                content: {
                    networks: { facebook: true, instagram: true, linkedin: true },
                    urls: { facebook: '#', instagram: '#', linkedin: '#' },
                    variant: 'color'
                },
                styles: { padding: '30px 0', textAlign: 'center' }
            }
        ]
    },
    {
        id: 'promotional',
        name: 'Promotional Campaign',
        description: 'Drive sales with limited-time offers',
        category: 'Sales',
        thumbnail: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=400&q=80',
        blocks: [
            {
                id: 'promo-text-1-header',
                type: 'text',
                content: { text: '⚡ Flash Sale!' },
                styles: { padding: '45px 30px 5px', textAlign: 'center', fontSize: '38px', fontWeight: '900', color: '#0f172a', letterSpacing: '-0.02em' }
            },
            {
                id: 'promo-text-1-sub',
                type: 'text',
                content: { text: 'Limited Time Only - Don\'t Miss Out!' },
                styles: { padding: '0px 30px 20px', textAlign: 'center', fontSize: '18px', color: '#ef4444', fontWeight: '700' }
            },
            {
                id: 'promo-image-1',
                type: 'image',
                content: { src: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=800&q=80', alt: 'Flash Sale' },
                styles: { padding: '20px 0', textAlign: 'center', width: '100%', borderRadius: '12px' }
            },
            {
                id: 'promo-text-2-header',
                type: 'text',
                content: { text: '50% OFF' },
                styles: { padding: '20px 30px 5px', textAlign: 'center', fontSize: '42px', fontWeight: '900', color: '#ef4444' }
            },
            {
                id: 'promo-text-2-sub',
                type: 'text',
                content: { text: 'Premium features at an unbeatable price' },
                styles: { padding: '0px 30px 20px', textAlign: 'center', fontSize: '17px', color: '#475569', fontWeight: '500' }
            },
            {
                id: 'promo-button-1',
                type: 'button',
                content: { text: '🎁 Claim Discount', url: '#' },
                styles: {
                    backgroundColor: '#ef4444',
                    color: '#ffffff',
                    padding: '12px 32px',
                    textAlign: 'center',
                    borderRadius: '12px',
                    fontWeight: '700',
                    fontFamily: 'Arial',
                }
            },
            {
                id: 'promo-countdown-1',
                type: 'countdown',
                content: {
                    days: '02',
                    hours: '14',
                    minutes: '30',
                    seconds: '00',
                    backgroundColor: '#fef2f2',
                    numberColor: '#ef4444',
                    labelColor: '#7f1d1d'
                },
                styles: { padding: '35px 0', textAlign: 'center' }
            },
            {
                id: 'promo-divider-1',
                type: 'divider',
                content: { thickness: 2, color: '#fecaca', style: 'solid' },
                styles: { padding: '25px 0' }
            },
            {
                id: 'promo-text-3',
                type: 'text',
                content: { text: '*Terms and conditions apply. Offer valid while stocks last. Cannot be combined with other promotions. Discount automatically applied at checkout.' },
                styles: { padding: '10px 35px', textAlign: 'center', fontSize: '12px', color: '#94a3b8', lineHeight: '1.6', fontStyle: 'italic' }
            }
        ]
    },
    {
        id: 'webinar-invite',
        name: 'Webinar Invitation',
        description: 'Professional tech webinar invite with speaker details',
        category: 'Events',
        thumbnail: '',
        blocks: [
            { id: 'web-logo', type: 'image', content: { src: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200&h=60&fit=crop&auto=format' }, styles: { padding: '30px 0', textAlign: 'center', width: '140px' } },
            { id: 'web-header', type: 'text', content: { text: 'Mastering AI Agents' }, styles: { padding: '10px 40px 5px', textAlign: 'center', color: '#0f172a', fontSize: '32px', fontWeight: '800', lineHeight: '1.2' } },
            { id: 'web-header-sub', type: 'text', content: { text: 'Join us for an exclusive deep dive into the future of autonomous coding.' }, styles: { padding: '0px 40px 20px', textAlign: 'center', color: '#64748b', fontSize: '18px' } },
            { id: 'web-image', type: 'image', content: { src: 'https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=600&h=300&fit=crop' }, styles: { padding: '20px 0', width: '100%', borderRadius: '12px' } },
            { id: 'web-details', type: 'event', content: { title: 'Live Webinar', day: '24', month: 'OCT', time: '2:00 PM EST • 60 Min', itemColor: '#2563eb', btnText: 'Register Free' }, styles: { padding: '20px 40px', textAlign: 'center' } },
            { id: 'web-speaker-title', type: 'text', content: { text: 'Featured Speakers' }, styles: { padding: '30px 0 10px', textAlign: 'center', color: '#334155', fontSize: '16px', fontWeight: '600', letterSpacing: '1px' } },
            { id: 'web-speaker-1', type: 'image-text', content: { layout: '30-70', image: 'https://images.unsplash.com/photo-1560250097-92937f3f6400?w=150', text: 'Alex Chen\nSenior AI Researcher', backgroundColor: '#f8fafc' }, styles: { padding: '15px' } },
            { id: 'web-speaker-2', type: 'image-text', content: { layout: '30-70', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150', text: 'Sarah Miller\nProduct Lead', backgroundColor: '#f8fafc' }, styles: { padding: '15px' } },
            { id: 'web-btn', type: 'button', content: { text: 'Save My Spot', url: '#' }, styles: { backgroundColor: '#2563eb', color: '#fff', padding: '16px 48px', borderRadius: '50px', fontWeight: 'bold' } }
        ]
    },
    {
        id: 'order-confirmed',
        name: 'Order Confirmation',
        description: 'Clean transactional email with receipt table',
        category: 'Transactional',
        thumbnail: '',
        blocks: [
            { id: 'oc-icon', type: 'text', content: { text: '✅' }, styles: { padding: '40px 0 10px', textAlign: 'center', fontSize: '48px' } },
            { id: 'oc-title', type: 'text', content: { text: 'Order Confirmed!' }, styles: { padding: '0 40px 5px', textAlign: 'center', fontSize: '28px', color: '#111', fontWeight: '700' } },
            { id: 'oc-sub', type: 'text', content: { text: 'Thanks for shopping with Plainly. Your order #4921 is on its way.' }, styles: { padding: '0 40px 30px', textAlign: 'center', color: '#666', fontSize: '16px' } },
            { id: 'oc-table', type: 'table', content: { rows: [{ label: 'Premium Plan (Yearly)', value: '199.00 €' }, { label: 'Add-on: AI Credits', value: '49.00 €' }, { label: 'Tax (19%)', value: '47.12 €' }, { label: 'Total', value: '295.12 €' }], textColor: '#333', striped: true }, styles: { padding: '20px 40px' } },
            { id: 'oc-track', type: 'button', content: { text: 'Track Order', url: '#' }, styles: { backgroundColor: '#111', color: '#fff', padding: '14px 28px', borderRadius: '6px', fontWeight: '600', width: '100%' } },
            { id: 'oc-help', type: 'text', content: { text: 'Need help? Contact Support' }, styles: { padding: '20px 0', textAlign: 'center', fontSize: '13px', color: '#888' } }
        ]
    },
    {
        id: 'blog-digest',
        name: 'Weekly Digest',
        description: 'Curated content list for bloggers and writers',
        category: 'Newsletter',
        thumbnail: '',
        backgroundColor: '#fffbeb',
        blocks: [
            { id: 'bd-logo', type: 'text', content: { text: 'The Sunday Reader' }, styles: { padding: '30px 40px', textAlign: 'left', borderBottom: '1px solid #e0e7ff', fontFamily: 'serif', fontSize: '24px', fontStyle: 'italic', color: '#4338ca' } },
            { id: 'bd-intro-header', type: 'text', content: { text: 'Design trends to watch in 2026' }, styles: { padding: '30px 40px 10px', fontFamily: 'serif', color: '#1e1b4b', fontSize: '28px', fontWeight: '700' } },
            { id: 'bd-intro-body', type: 'text', content: { text: 'Design is evolving faster than ever. This week, we explore the shift towards agentic interfaces and what it means for UX designers.' }, styles: { padding: '0px 40px 10px', color: '#4b5563', lineHeight: '1.6', fontSize: '16px' } },
            { id: 'bd-img', type: 'image', content: { src: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&h=300&fit=crop' }, styles: { padding: '0 40px 20px', borderRadius: '4px' } },
            { id: 'bd-btn', type: 'button', content: { text: 'Read Full Story →', url: '#' }, styles: { backgroundColor: 'transparent', color: '#4338ca', padding: '10px 0', textAlign: 'left', fontWeight: '600' } },
            { id: 'bd-divider', type: 'divider', content: { thickness: 1, color: '#e5e7eb' }, styles: { padding: '30px 40px' } },
            { id: 'bd-list-1', type: 'text', content: { text: '🔥 Also this week:\n• Why Figma is betting on AI\n• The death of the hamburger menu\n• Color palettes for 2026' }, styles: { padding: '0 40px 40px', color: '#4b5563', lineHeight: '1.6', fontSize: '14px' } }
        ]
    },
    {
        id: 'black-friday',
        name: 'Black Friday Sale',
        description: 'High-contrast sales template with countdown',
        category: 'Sales',
        thumbnail: '',
        backgroundColor: '#000000',
        blocks: [
            { id: 'bf-header', type: 'text', content: { text: 'Black\nFriday' }, styles: { backgroundColor: '#000', padding: '60px 20px 10px', textAlign: 'center', fontSize: '60px', fontWeight: '900', color: '#fbbf24', lineHeight: '0.9' } },
            { id: 'bf-sub', type: 'text', content: { text: 'Up to 80% Off Everything' }, styles: { backgroundColor: '#000', padding: '0 20px 40px', textAlign: 'center', color: '#fff', fontSize: '20px', letterSpacing: '2px', fontWeight: '500' } },
            { id: 'bf-code', type: 'code', content: { code: 'USE CODE: BF2026' }, styles: { padding: '0 20px', backgroundColor: '#000' } },
            { id: 'bf-timer', type: 'countdown', content: { days: '00', hours: '04', minutes: '59', seconds: '12', backgroundColor: '#fbbf24', numberColor: '#000', labelColor: '#000' }, styles: { padding: '40px 20px', backgroundColor: '#000', textAlign: 'center' } },
            { id: 'bf-btn', type: 'button', content: { text: 'SHOP NOW', url: '#' }, styles: { backgroundColor: '#fff', color: '#000', padding: '20px 60px', borderRadius: '0', fontWeight: '900', fontSize: '20px', letterSpacing: '1px' } },
        ]
    },
    {
        id: 'feedback-req',
        name: 'Feedback Request',
        description: 'Simple customer satisfaction survey',
        category: 'Feedback',
        thumbnail: '',
        blocks: [
            { id: 'fr-logo', type: 'image', content: { src: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=100&h=100&fit=crop' }, styles: { padding: '40px 0 20px', textAlign: 'center', width: '80px', borderRadius: '50%' } },
            { id: 'fr-header', type: 'text', content: { text: 'How did we do, Felix?' }, styles: { padding: '0 40px 5px', textAlign: 'center', color: '#333', fontSize: '24px', fontWeight: '700' } },
            { id: 'fr-sub', type: 'text', content: { text: 'We’d love to hear about your recent experience with our support team.' }, styles: { padding: '0 40px 30px', textAlign: 'center', color: '#666', fontSize: '16px' } },
            { id: 'fr-nps', type: 'nps', content: { variant: 'smileys', question: 'How would you rate your experience?' }, styles: { padding: '20px 0', textAlign: 'center' } },
            { id: 'fr-comment', type: 'text', content: { text: 'Only takes 30 seconds' }, styles: { padding: '10px 0 40px', textAlign: 'center', fontSize: '14px', color: '#999' } },
            { id: 'fr-btn', type: 'button', content: { text: 'Leave a Review', url: '#' }, styles: { backgroundColor: '#f3f4f6', color: '#4b5563', padding: '12px 24px', borderRadius: '8px', fontWeight: '500' } }
        ]
    },
    {
        id: 'midnight-noir',
        name: 'Midnight Noir',
        description: 'High-energy dark mode for electronics and tech',
        category: 'Tech',
        thumbnail: '',
        backgroundColor: '#0f172a',
        blocks: [
            { id: 'mn-header', type: 'text', content: { text: 'NEXT GEN\nREADY.' }, styles: { padding: '60px 40px 20px', textAlign: 'left', color: '#6366f1', fontSize: '42px', fontWeight: '900', letterSpacing: '-1px' } },
            { id: 'mn-img', type: 'image', content: { src: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80', alt: 'Tech Gear' }, styles: { padding: '20px 0', width: '100%' } },
            { id: 'mn-text', type: 'text', content: { text: 'Level up your setup with the ultimate productivity kit. Limited stock available.' }, styles: { padding: '20px 40px', color: '#94a3b8', fontSize: '18px', lineHeight: '1.6' } },
            { id: 'mn-btn', type: 'button', content: { text: 'SHOP THE DROP', url: '#' }, styles: { backgroundColor: '#6366f1', color: '#fff', padding: '16px 40px', borderRadius: '4px', fontWeight: '900' } }
        ]
    },
    {
        id: 'serene-morning',
        name: 'Serene Morning',
        description: 'Minimalist, soft-toned wellness and lifestyle blog',
        category: 'Wellness',
        thumbnail: '',
        backgroundColor: '#fdfbf7',
        blocks: [
            { id: 'sm-title-header', type: 'text', content: { text: 'Serene' }, styles: { padding: '50px 40px 5px', textAlign: 'center', fontFamily: 'serif', color: '#4338ca', fontSize: '32px', fontStyle: 'italic' } },
            { id: 'sm-title-sub', type: 'text', content: { text: 'Wellness & Balance' }, styles: { padding: '0 40px 30px', textAlign: 'center', color: '#7c9a92', letterSpacing: '3px', fontSize: '12px', fontWeight: '700' } },
            { id: 'sm-img', type: 'image', content: { src: 'https://images.unsplash.com/photo-1544161515-4ae6ce6ea858?w=800&q=80', alt: 'Zen Meditation' }, styles: { padding: '0 40px 30px', borderRadius: '100px 100px 0 0' } },
            { id: 'sm-text-header', type: 'text', content: { text: 'Finding Stillness' }, styles: { padding: '10px 40px 10px', textAlign: 'center', fontFamily: 'serif', color: '#1e1b4b', fontSize: '24px', fontWeight: '700' } },
            { id: 'sm-text-body', type: 'text', content: { text: 'In the rush of modern life, finding a moment of true silence is a superpower. Here is how we practice it every morning.' }, styles: { padding: '0 40px 20px', textAlign: 'center', color: '#4b5563', lineHeight: '1.8' } },
            { id: 'sm-btn', type: 'button', content: { text: 'Read the Guide', url: '#' }, styles: { backgroundColor: '#7c9a92', color: '#fff', padding: '12px 32px', borderRadius: '50px', fontWeight: '500' } }
        ]
    },
    {
        id: 'aero-enterprise',
        name: 'Aero Enterprise',
        description: 'Clean, tech-focused enterprise dashboard look',
        category: 'SaaS',
        thumbnail: '',
        backgroundColor: '#ffffff',
        blocks: [
            { id: 'ae-header-pre', type: 'text', content: { text: 'Aero Dashboard' }, styles: { padding: '40px 40px 5px', color: '#0047ff', fontWeight: '800', fontSize: '14px' } },
            { id: 'ae-header', type: 'text', content: { text: 'Weekly Performance Metrics' }, styles: { padding: '0 40px 20px', color: '#0f172a', fontSize: '32px', fontWeight: '900' } },
            { id: 'ae-table', type: 'table', content: { rows: [{ label: 'Total Revenue', value: '84,200 €' }, { label: 'Active Users', value: '12,400' }, { label: 'Conversion Rate', value: '3.2%' }], textColor: '#334155', striped: true }, styles: { padding: '0 40px 30px' } },
            { id: 'ae-text', type: 'text', content: { text: 'Growth is up by 12% this week. Keep hitting those targets!' }, styles: { padding: '0 40px 20px', color: '#64748b', fontSize: '14px' } },
            { id: 'ae-btn', type: 'button', content: { text: 'View Full Report', url: '#' }, styles: { backgroundColor: '#0047ff', color: '#ffffff', padding: '12px 24px', borderRadius: '8px', fontWeight: 'bold' } }
        ]
    },
    {
        id: 'vintage-gazette',
        name: 'Vintage Gazette',
        description: 'Retro news clipping style for unique storytelling',
        category: 'Newsletter',
        thumbnail: '',
        backgroundColor: '#f4f1ea',
        blocks: [
            { id: 'vg-header-main', type: 'text', content: { text: 'The Gazette' }, styles: { padding: '40px 40px 5px', textAlign: 'center', fontFamily: 'serif', fontSize: '48px', fontWeight: '900' } },
            { id: 'vg-header-date', type: 'text', content: { text: 'Friday, January 22, 1926 • Vol. LXIX' }, styles: { padding: '0 40px 20px', textAlign: 'center', fontFamily: 'serif', fontSize: '13px', fontWeight: 'bold', borderTop: '1px solid #000', borderBottom: '1px solid #000' } },
            { id: 'vg-title', type: 'text', content: { text: 'MARVELOUS DISCOVERIES IN THE REALM OF CODE' }, styles: { padding: '10px 40px', fontFamily: 'serif', fontSize: '28px', fontWeight: '900', lineHeight: '1.1' } },
            { id: 'vg-text', type: 'text', content: { text: 'Today, engineers have unveiled a set of tools so versatile, they might just redefine the art of digital communication. Witnesses describe the experience as "truly futuristic."' }, styles: { padding: '10px 40px', fontFamily: 'serif', fontSize: '16px', lineHeight: '1.5', textAlign: 'justify' } },
            { id: 'vg-divider', type: 'divider', content: { thickness: 1, color: '#000', style: 'solid' }, styles: { padding: '20px 40px' } }
        ]
    },
    {
        id: 'neon-pulse',
        name: 'Neon Pulse',
        description: 'Vibrant, high-energy gaming or social event invite',
        category: 'Events',
        thumbnail: '',
        backgroundColor: '#2e1065',
        blocks: [
            { id: 'np-header', type: 'text', content: { text: 'UPGRADE\nLOCKED.' }, styles: { padding: '50px 40px 20px', color: '#22d3ee', fontSize: '48px', fontWeight: '900', fontStyle: 'italic', lineHeight: '1.1' } },
            { id: 'np-img', type: 'image', content: { src: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80', alt: 'Esports Arena' }, styles: { padding: '0', width: '100%', borderRadius: '0' } },
            { id: 'np-text', type: 'text', content: { text: 'The tournament begins tomorrow. Are you in?' }, styles: { padding: '30px 40px 10px', color: '#e9d5ff', fontSize: '18px', fontWeight: 'bold' } },
            { id: 'np-btn', type: 'button', content: { text: 'JOIN THE LOUNGE', url: '#' }, styles: { backgroundColor: '#d946ef', color: '#ffffff', padding: '16px 40px', borderRadius: '0', fontWeight: '900', textAlign: 'center' } }
        ]
    },
    {
        id: 'sunset-glow',
        name: 'Sunset Glow',
        description: 'Vibrant high-saturation design for music and summer events',
        category: 'Events',
        thumbnail: '',
        backgroundColor: '#ff4d00',
        blocks: [
            { id: 'sg-header', type: 'text', content: { text: 'Sunset\nSessions.' }, styles: { padding: '60px 40px 20px', textAlign: 'left', color: '#ffffff', fontSize: '56px', fontWeight: '900', lineHeight: '0.9' } },
            { id: 'sg-img', type: 'image', content: { src: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&q=80', alt: 'DJ Deck' }, styles: { padding: '20px 0', width: '100%', borderRadius: '0' } },
            { id: 'sg-card', type: 'text', content: { text: 'Beach Stage • 8PM\n\nThe biggest party of the summer is finally here. Grab your tickets before they\'re gone.' }, styles: { padding: '20px 40px', color: '#fff', fontSize: '16px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '24px' } },
            { id: 'sg-btn', type: 'button', content: { text: 'GET TICKETS', url: '#' }, styles: { backgroundColor: '#ffffff', color: '#ff4d00', padding: '16px 40px', borderRadius: '50px', fontWeight: '900', textAlign: 'center' } }
        ]
    },
    {
        id: 'electric-hazard',
        name: 'Electric Hazard',
        description: 'High-contrast hazard style for extreme products',
        category: 'Product',
        thumbnail: '',
        backgroundColor: '#0047ff',
        blocks: [
            { id: 'eh-header-danger', type: 'text', content: { text: 'DANGER.' }, styles: { padding: '60px 40px 5px', color: '#000', backgroundColor: '#fbff00', fontSize: '48px', fontWeight: '900', display: 'inline-block' } },
            { id: 'eh-header-gear', type: 'text', content: { text: 'EXTREME GEAR.' }, styles: { padding: '0 40px 20px', color: '#fff', fontSize: '36px', fontWeight: '900' } },
            { id: 'eh-img', type: 'image', content: { src: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80', alt: 'Red Sneakers' }, styles: { padding: '0', width: '100%', borderRadius: '0' } },
            { id: 'eh-text', type: 'text', content: { text: 'BUILT FOR POWER.\nBUILT FOR SPEED.' }, styles: { padding: '30px 40px', color: '#fff', fontSize: '20px', fontWeight: '700', lineHeight: '1.2' } },
            { id: 'eh-btn', type: 'button', content: { text: 'BUY NOW', url: '#' }, styles: { backgroundColor: '#fbff00', color: '#000', padding: '16px 48px', borderRadius: '0', fontWeight: '900', fontSize: '20px' } }
        ]
    },
    {
        id: 'tropical-bloom',
        name: 'Tropical Bloom',
        description: 'Deep forest greens with vibrant floral accents for nature and travel',
        category: 'Travel',
        thumbnail: '',
        backgroundColor: '#064e3b',
        blocks: [
            { id: 'tb-header-pre', type: 'text', content: { text: 'Escape to Paradise' }, styles: { padding: '50px 40px 5px', color: '#fbbf24', fontSize: '14px', fontWeight: '800', letterSpacing: '4px' } },
            { id: 'tb-header', type: 'text', content: { text: 'The Hidden\nGardens.' }, styles: { padding: '0 40px 20px', color: '#ffffff', fontSize: '44px', fontWeight: '900', lineHeight: '1.1' } },
            { id: 'tb-img', type: 'image', content: { src: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=800&q=80', alt: 'Tropical Forest' }, styles: { padding: '20px 0', width: '100%', borderRadius: '40px' } },
            { id: 'tb-text', type: 'text', content: { text: 'Experience the lush beauty of the tropics. Our curated tours now include the mythical valley of pink blooms.' }, styles: { padding: '20px 40px', color: '#d1fae5', fontSize: '17px', lineHeight: '1.8' } },
            { id: 'tb-btn', type: 'button', content: { text: 'EXPLORE NOW', url: '#' }, styles: { backgroundColor: '#fbbf24', color: '#064e3b', padding: '16px 40px', borderRadius: '50px', fontWeight: '900' } }
        ]
    },
    {
        id: 'candy-glaze',
        name: 'Candy Glaze',
        description: 'Playful pastel-saturated palette for gifts and social events',
        category: 'Special Events',
        thumbnail: '',
        backgroundColor: '#ecfdf5',
        blocks: [
            { id: 'cg-title', type: 'text', content: { text: 'Sweet\nSurprise! 🍭' }, styles: { padding: '60px 40px 20px', textAlign: 'center', color: '#f472b6', fontSize: '52px', fontWeight: '900', lineHeight: '1.1' } },
            { id: 'cg-img', type: 'image', content: { src: 'https://images.unsplash.com/photo-1533910534207-90f31029a78e?w=800&q=80', alt: 'Colorful Candy' }, styles: { padding: '0 40px 30px', width: '100%', borderRadius: '100%' } },
            { id: 'cg-card', type: 'text', content: { text: '20% OFF ALL TREATS\nUse code: CANDY2026' }, styles: { padding: '20px 40px', textAlign: 'center', backgroundColor: '#fff', border: '4px solid #f472b6', borderRadius: '40px', color: '#f472b6', fontSize: '22px', fontWeight: '900' } },
            { id: 'cg-btn', type: 'button', content: { text: 'UNWRAP JOY', url: '#' }, styles: { backgroundColor: '#fbbf24', color: '#7c2d12', padding: '16px 48px', borderRadius: '24px', fontWeight: '900' } }
        ]
    }
];
