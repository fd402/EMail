import { Block } from '@/store/useEmailStore';
import { render } from '@react-email/render';
import { Html, Head, Preview, Body, Container, Section, Text, Button, Img } from '@react-email/components';
import React from 'react';

export const renderEmail = async (blocks: Block[], settings: { backgroundColor: string; workbenchColor: string; containerWidth?: string } = { backgroundColor: '#f3f4f6', workbenchColor: '#f3f4f6', containerWidth: '600px' }) => {
    const html = await render(<EmailTemplate blocks={blocks} settings={settings} />);
    return html;
};

const EmailTemplate = ({ blocks, settings }: { blocks: Block[], settings: { backgroundColor: string; workbenchColor?: string; containerWidth?: string } }) => {
    return (
        <Html>
            <Head>
                <style>{`
                  * { box-sizing: border-box; }
                  html, body { margin: 0; padding: 0; min-height: 100%; width: 100%; vertical-align: top; }
                  td { vertical-align: top; }
                  @media only screen and (max-width:480px) {
                    .mobile-stack { display: block !important; width: 100% !important; box-sizing: border-box !important; }
                  } 
                `}</style>
            </Head>

            <Body style={{ backgroundColor: settings.workbenchColor || '#f3f4f6', fontFamily: 'Arial, sans-serif', margin: '0 auto', padding: '20px 0', minHeight: '100%', verticalAlign: 'top' }}>
                <Container style={{ backgroundColor: settings.backgroundColor, margin: '0 auto', maxWidth: settings.containerWidth || '600px', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', verticalAlign: 'top' }}>
                    {blocks.map((block) => (
                        <React.Fragment key={block.id}>
                            {block.type === 'text' && (
                                <Section style={{ ...block.styles, wordBreak: 'break-word', padding: block.styles.padding || '10px 40px' }}>
                                    <div
                                        style={{
                                            whiteSpace: 'pre-wrap',
                                            fontFamily: block.content.fontFamily || block.styles.fontFamily || 'Arial, sans-serif',
                                            fontSize: block.styles.fontSize || '16px',
                                            fontWeight: block.styles.fontWeight || '400',
                                            color: block.styles.color || '#1e293b',
                                            lineHeight: block.styles.lineHeight || '1.5',
                                            textAlign: (block.styles.textAlign as any) || 'left',
                                            fontStyle: block.content.fontStyle || block.styles.fontStyle || 'normal'
                                        }}
                                    >
                                        {block.content.text}
                                    </div>
                                </Section>
                            )}
                            {block.type === 'button' && (
                                <Section style={{ textAlign: (block.styles.textAlign || 'center') as any, padding: block.styles.padding || '10px 0' }}>
                                    {/* Bulletproof Button - Works in all email clients including Outlook */}
                                    <table border={0} cellSpacing="0" cellPadding="0" align={(block.styles.textAlign || 'center') as any}>
                                        <tbody>
                                            <tr>
                                                <td align="center" style={{
                                                    backgroundColor: block.styles.backgroundColor || '#6366f1',
                                                    borderRadius: block.styles.borderRadius || '12px',
                                                } as React.CSSProperties & { msoHide?: string }}>
                                                    <a href={block.content.url} target="_blank" style={{
                                                        display: 'inline-block',
                                                        // Match Editor: padding '12px 24px' is default in CanvasBlock
                                                        padding: block.styles.height && block.styles.height !== 'auto'
                                                            ? `0 ${block.styles.padding?.split(' ')[1] || '24px'}`
                                                            : (block.styles.padding || '12px 24px'),
                                                        backgroundColor: block.styles.backgroundColor || '#6366f1',
                                                        borderRadius: block.styles.borderRadius || '12px',
                                                        color: block.styles.color || '#ffffff',
                                                        fontSize: block.styles.fontSize || '16px',
                                                        fontWeight: block.styles.fontWeight || 'bold',
                                                        fontFamily: block.styles.fontFamily || 'Arial, sans-serif',
                                                        textDecoration: 'none',
                                                        // Match Editor: lineHeight '1.2'
                                                        lineHeight: '1.2',
                                                        // Ensure text wrapping matches Editor
                                                        whiteSpace: 'normal',
                                                        wordBreak: 'normal', // Don't break words arbitrarily
                                                        overflowWrap: 'break-word', // Only break long words if necessary
                                                        maxWidth: '100%',
                                                        minWidth: '100px', // Match Editor constraint
                                                        width: block.styles.width || 'auto', // Default to auto width
                                                        textAlign: 'center',
                                                        boxSizing: 'border-box'
                                                    }}>
                                                        {block.content.text}
                                                    </a>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>

                                    {/* VML Button for Outlook 2007-2019 */}
                                    <div dangerouslySetInnerHTML={{
                                        __html: `<!--[if mso]>
                                        <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${block.content.url}" style="height:auto;v-text-anchor:middle;width:${parseInt(block.styles.width as string) < 100 ? '100px' : (block.styles.width || 'auto')};" arcsize="${Math.min(100, parseInt(block.styles.borderRadius || '12') * 2.5)}%" strokecolor="${block.styles.backgroundColor || '#6366f1'}" fillcolor="${block.styles.backgroundColor || '#6366f1'}">
                                            <w:anchorlock/>
                                            <center style="color:${block.styles.color || '#ffffff'};font-family:${block.styles.fontFamily || 'Arial, sans-serif'};font-size:${block.styles.fontSize || '16px'};font-weight:${block.styles.fontWeight || 'bold'};mso-line-height-rule:exactly;line-height:${block.styles.lineHeight || '1.4'};">${block.content.text}</center>
                                        </v:roundrect>
                                        <![endif]-->`
                                    }} />
                                </Section>
                            )}
                            {block.type === 'image' && (
                                <Section style={{ padding: '10px 0', textAlign: (block.styles.textAlign || 'center') as any }}>
                                    <Img
                                        src={block.content.src}
                                        alt={block.content.alt}
                                        style={{ maxWidth: '100%', display: 'inline-block', ...block.styles, height: 'auto' }}
                                    />
                                </Section>
                            )}
                            {block.type === 'social' && (
                                <Section style={{ padding: '10px 0', textAlign: 'center' }}>
                                    {block.content.networks?.facebook && (
                                        <Button href={block.content.urls?.facebook} style={{ padding: '0 8px', textDecoration: 'none' }}>
                                            <Img
                                                src={block.content.variant === 'color' ? 'https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/circle-color/facebook@2x.png' : 'https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/circle-dark-gray/facebook@2x.png'}
                                                width="32" height="32" alt="Facebook" style={{ display: 'inline-block' }}
                                            />
                                        </Button>
                                    )}
                                    {block.content.networks?.instagram && (
                                        <Button href={block.content.urls?.instagram} style={{ padding: '0 8px', textDecoration: 'none' }}>
                                            <Img
                                                src={block.content.variant === 'color' ? 'https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/circle-color/instagram@2x.png' : 'https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/circle-dark-gray/instagram@2x.png'}
                                                width="32" height="32" alt="Instagram" style={{ display: 'inline-block' }}
                                            />
                                        </Button>
                                    )}
                                    {block.content.networks?.linkedin && (
                                        <Button href={block.content.urls?.linkedin} style={{ padding: '0 8px', textDecoration: 'none' }}>
                                            <Img
                                                src={block.content.variant === 'color' ? 'https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/circle-color/linkedin@2x.png' : 'https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/circle-dark-gray/linkedin@2x.png'}
                                                width="32" height="32" alt="LinkedIn" style={{ display: 'inline-block' }}
                                            />
                                        </Button>
                                    )}
                                    {block.content.networks?.x && (
                                        <Button href={block.content.urls?.x} style={{ padding: '0 8px', textDecoration: 'none' }}>
                                            <Img
                                                src={block.content.variant === 'color' ? 'https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/circle-color/twitter@2x.png' : 'https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/circle-dark-gray/twitter@2x.png'}
                                                width="32" height="32" alt="X" style={{ display: 'inline-block' }}
                                            />
                                        </Button>
                                    )}
                                </Section>
                            )}
                            {block.type === 'video' && (
                                <Section style={{ padding: '10px 0', textAlign: 'center' }}>
                                    <div style={{ position: 'relative', display: 'inline-block', maxWidth: '100%', backgroundColor: '#ffffff', padding: '10px', border: '1px solid #e5e7eb', borderRadius: '12px', boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)' }}>
                                        <a href={block.content.url} target="_blank" style={{ display: 'block', position: 'relative' }}>
                                            <Img
                                                src={block.content.thumbnail}
                                                alt="Video"
                                                width="600"
                                                style={{ maxWidth: '100%', height: 'auto', display: 'block', borderRadius: '4px' }}
                                            />
                                            {/* Play Button Overlay - Using negative margin technique for better email client support (Gmail etc.) */}
                                            {/* Aspect Ratio 16:9 is ~56% height. Center is ~28%. We pull it up by ~30% of width. */}
                                            <div style={{ width: '100%', maxHeight: '0px', marginTop: '-30%', textAlign: 'center', position: 'relative', pointerEvents: 'none' }}>
                                                <div style={{ display: 'inline-block', width: '64px', height: '64px', backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: '50%', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', lineHeight: '64px' }}>
                                                    {/* Vertically center the triangle manually since flex might be flaky */}
                                                    <span style={{ display: 'inline-block', width: '0', height: '0', borderTop: '10px solid transparent', borderBottom: '10px solid transparent', borderLeft: '18px solid #000', marginLeft: '4px', verticalAlign: 'middle' }}></span>
                                                </div>
                                            </div>
                                            {/* Spacer to restore flow if needed, but maxHeight 0 should handle it */}
                                            <div style={{ height: '30px' }}></div>
                                        </a>
                                    </div>
                                </Section>
                            )}
                            {block.type === 'html' && (
                                <Section style={{ padding: '0' }}>
                                    <div dangerouslySetInnerHTML={{ __html: block.content.html }} />
                                </Section>
                            )}
                            {block.type === 'menu' && (
                                <Section style={{ padding: '10px 0', textAlign: 'center' }}>
                                    <Text style={{ margin: '0', color: block.styles.color, fontSize: '14px', fontFamily: 'sans-serif' }}>
                                        {block.content.items?.map((item: any, i: number) => (
                                            <React.Fragment key={i}>
                                                <a href={item.url} style={{ textDecoration: 'none', color: block.styles.color, fontWeight: '500' }}>{item.text}</a>
                                                {i < block.content.items.length - 1 && (
                                                    <span style={{ margin: '0 10px', color: '#cccccc' }}>{block.content.separator}</span>
                                                )}
                                            </React.Fragment>
                                        ))}
                                    </Text>
                                </Section>
                            )}

                            {block.type === 'product-card' && (
                                <Section style={{ padding: '10px', textAlign: 'center', border: '1px solid #eee', borderRadius: '8px', maxWidth: '300px', margin: '0 auto', backgroundColor: '#fff' }}>
                                    <Img src={block.content.image} alt={block.content.title} width="100%" style={{ borderRadius: '4px 4px 0 0', objectFit: 'cover', height: 'auto' }} />
                                    <div style={{ padding: '15px' }}>
                                        <Text style={{ margin: '0 0 5px 0', fontSize: '16px', fontWeight: 'bold', color: '#333' }}>{block.content.title}</Text>
                                        <Text style={{ margin: '0 0 15px 0', color: '#666' }}>
                                            {block.content.originalPrice ? (
                                                <>
                                                    <span style={{ textDecoration: 'line-through', marginRight: '8px', color: '#999' }}>{block.content.originalPrice} {block.content.currency}</span>
                                                    <span style={{ color: block.content.priceColor || '#000', fontWeight: 'bold' }}>{block.content.price} {block.content.currency}</span>
                                                </>
                                            ) : (
                                                <span style={{ color: block.content.priceColor || '#000', fontWeight: 'bold' }}>{block.content.price} {block.content.currency}</span>
                                            )}
                                        </Text>
                                        <table border={0} cellSpacing="0" cellPadding="0" align="center" style={{ width: '100%' }}>
                                            <tbody>
                                                <tr>
                                                    <td align="center" style={{
                                                        backgroundColor: '#2563eb',
                                                        borderRadius: '4px'
                                                    } as React.CSSProperties}>
                                                        <a href={block.content.btnUrl} target="_blank" style={{
                                                            display: 'block', // Editor has w-full
                                                            padding: '8px 16px', // match py-2 px-4
                                                            backgroundColor: '#2563eb',
                                                            borderRadius: '4px',
                                                            color: '#fff',
                                                            fontSize: '12px', // match text-xs
                                                            fontWeight: '500', // likely default
                                                            textDecoration: 'none',
                                                            width: '100%',
                                                            boxSizing: 'border-box'
                                                        }}>
                                                            {block.content.btnText}
                                                        </a>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </Section>
                            )}

                            {block.type === 'nps' && (
                                <Section style={{ padding: '10px 0', textAlign: 'center' }}>
                                    {(!block.content.variant || block.content.variant === 'numbers') && (
                                        <div style={{ display: 'inline-block' }}>
                                            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                                                <a
                                                    key={n}
                                                    href={`${block.content.baseUrl || '#'}${n}`}
                                                    style={{ display: 'inline-block', width: '30px', height: '30px', lineHeight: '30px', border: '1px solid #ddd', borderRadius: '4px', margin: '0 2px', textDecoration: 'none', color: '#555', fontSize: '12px', fontWeight: 'bold', backgroundColor: '#fff' }}
                                                >
                                                    {n}
                                                </a>
                                            ))}
                                        </div>
                                    )}
                                    {block.content.variant === 'stars' && (
                                        <div style={{ display: 'inline-block' }}>
                                            {[1, 2, 3, 4, 5].map(n => (
                                                <a key={n} href={`${block.content.baseUrl || '#'}${n}`} style={{ textDecoration: 'none', margin: '0 2px' }}>
                                                    <Img src="https://img.icons8.com/fluency/48/star.png" width="32" height="32" alt={`${n} Stars`} style={{ display: 'inline-block' }} />
                                                </a>
                                            ))}
                                        </div>
                                    )}
                                    {block.content.variant === 'smileys' && (
                                        <div style={{ display: 'inline-block' }}>
                                            <a href={`${block.content.baseUrl || '#'}1`} style={{ textDecoration: 'none', margin: '0 4px' }} title="Very Unhappy">
                                                <Img src="https://img.icons8.com/fluency/48/angry.png" width="32" height="32" alt="Very Unhappy" style={{ display: 'inline-block' }} />
                                            </a>
                                            <a href={`${block.content.baseUrl || '#'}2`} style={{ textDecoration: 'none', margin: '0 4px' }} title="Unhappy">
                                                <Img src="https://img.icons8.com/fluency/48/sad.png" width="32" height="32" alt="Unhappy" style={{ display: 'inline-block' }} />
                                            </a>
                                            <a href={`${block.content.baseUrl || '#'}3`} style={{ textDecoration: 'none', margin: '0 4px' }} title="Neutral">
                                                <Img src="https://img.icons8.com/fluency/48/neutral-emoticon.png" width="32" height="32" alt="Neutral" style={{ display: 'inline-block' }} />
                                            </a>
                                            <a href={`${block.content.baseUrl || '#'}4`} style={{ textDecoration: 'none', margin: '0 4px' }} title="Happy">
                                                <Img src="https://img.icons8.com/fluency/48/happy.png" width="32" height="32" alt="Happy" style={{ display: 'inline-block' }} />
                                            </a>
                                            <a href={`${block.content.baseUrl || '#'}5`} style={{ textDecoration: 'none', margin: '0 4px' }} title="Very Happy">
                                                <Img src="https://img.icons8.com/fluency/48/lol.png" width="32" height="32" alt="Very Happy" style={{ display: 'inline-block' }} />
                                            </a>
                                        </div>
                                    )}
                                </Section>
                            )}

                            {block.type === 'countdown' && (
                                <Section style={{ padding: '10px 0', textAlign: 'center' }}>
                                    <table align="center" style={{ margin: '0 auto', backgroundColor: block.content.backgroundColor || '#f3f4f6', borderRadius: '8px', borderCollapse: 'separate', padding: '10px' }}>
                                        <tbody>
                                            <tr>
                                                <td style={{ padding: '0 10px', textAlign: 'center' }}>
                                                    <div style={{ fontSize: '24px', fontWeight: 'bold', fontFamily: 'monospace', color: block.content.numberColor || '#1f2937' }}>{block.content.days || '00'}</div>
                                                    <div style={{ fontSize: '10px', textTransform: 'uppercase', color: block.content.labelColor || '#6b7280' }}>Days</div>
                                                </td>
                                                <td style={{ fontSize: '20px', fontWeight: 'bold', color: '#9ca3af', padding: '0 5px', verticalAlign: 'top' }}>:</td>
                                                <td style={{ padding: '0 10px', textAlign: 'center' }}>
                                                    <div style={{ fontSize: '24px', fontWeight: 'bold', fontFamily: 'monospace', color: block.content.numberColor || '#1f2937' }}>{block.content.hours || '00'}</div>
                                                    <div style={{ fontSize: '10px', textTransform: 'uppercase', color: block.content.labelColor || '#6b7280' }}>Hours</div>
                                                </td>
                                                <td style={{ fontSize: '20px', fontWeight: 'bold', color: '#9ca3af', padding: '0 5px', verticalAlign: 'top' }}>:</td>
                                                <td style={{ padding: '0 10px', textAlign: 'center' }}>
                                                    <div style={{ fontSize: '24px', fontWeight: 'bold', fontFamily: 'monospace', color: block.content.numberColor || '#1f2937' }}>{block.content.minutes || '00'}</div>
                                                    <div style={{ fontSize: '10px', textTransform: 'uppercase', color: block.content.labelColor || '#6b7280' }}>Mins</div>
                                                </td>
                                                <td style={{ fontSize: '20px', fontWeight: 'bold', color: '#9ca3af', padding: '0 5px', verticalAlign: 'top' }}>:</td>
                                                <td style={{ padding: '0 10px', textAlign: 'center' }}>
                                                    <div style={{ fontSize: '24px', fontWeight: 'bold', fontFamily: 'monospace', color: block.content.numberColor || '#1f2937' }}>{block.content.seconds || '00'}</div>
                                                    <div style={{ fontSize: '10px', textTransform: 'uppercase', color: block.content.labelColor || '#6b7280' }}>Secs</div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </Section>
                            )}

                            {block.type === 'qr' && (
                                <Section style={{ padding: '10px 0', textAlign: 'center' }}>
                                    <div style={{ display: 'inline-block', padding: '10px', backgroundColor: '#fff', border: '1px solid #eee', borderRadius: '4px' }}>
                                        <Img
                                            src={`https://api.qrserver.com/v1/create-qr-code/?size=${block.content.size}x${block.content.size}&data=${encodeURIComponent(block.content.value)}&color=${block.content.color.replace('#', '')}`}
                                            width={block.content.size}
                                            height={block.content.size}
                                            alt="QR Code"
                                            style={{ display: 'block' }}
                                        />
                                    </div>
                                </Section>
                            )}

                            {block.type === 'table' && (
                                <Section style={{ padding: '10px 0' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                                        <tbody>
                                            {block.content.rows?.map((row: any, i: number) => (
                                                <tr key={i} style={{ backgroundColor: block.content.striped && i % 2 === 1 ? '#f9fafb' : 'transparent' }}>
                                                    <td style={{ padding: '8px', borderBottom: '1px solid #eee', fontWeight: 'bold', color: block.content.textColor }}>{row.label}</td>
                                                    <td style={{ padding: '8px', borderBottom: '1px solid #eee', textAlign: 'right', color: block.content.textColor }}>{row.value}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </Section>
                            )}

                            {block.type === 'image-text' && (
                                <Section style={{ padding: '0', backgroundColor: block.content.backgroundColor }}>
                                    <table width="100%" cellPadding="0" cellSpacing="0" border={0}>
                                        <tbody>
                                            <tr style={{ direction: block.content.isReversed ? 'rtl' : 'ltr' }}>
                                                {/* Image Column */}
                                                <td
                                                    className="mobile-stack"
                                                    width={block.content.layout === '30-70' ? '30%' : block.content.layout === '70-30' ? '70%' : '50%'}
                                                    style={{
                                                        verticalAlign: 'top',
                                                        direction: 'ltr',
                                                        padding: '0'
                                                    }}
                                                >
                                                    <Img
                                                        src={block.content.image || 'https://placehold.co/600x400/f3f4f6/9ca3af?text=Media'}
                                                        alt="Media"
                                                        width="100%"
                                                        style={{ display: 'block', width: '100%', maxWidth: '100%', height: 'auto', objectFit: 'cover' }}
                                                    />
                                                </td>
                                                {/* Text Column */}
                                                <td
                                                    className="mobile-stack"
                                                    width={block.content.layout === '30-70' ? '70%' : block.content.layout === '70-30' ? '30%' : '50%'}
                                                    style={{
                                                        verticalAlign: 'middle',
                                                        direction: 'ltr',
                                                        padding: '20px'
                                                    }}
                                                >
                                                    <div
                                                        style={{
                                                            whiteSpace: 'pre-wrap',
                                                            fontSize: block.styles.fontSize || '16px',
                                                            lineHeight: block.styles.lineHeight || '1.5',
                                                            color: block.styles.color || '#374151',
                                                            fontFamily: block.content.fontFamily || block.styles.fontFamily || 'Arial, sans-serif',
                                                            fontWeight: block.styles.fontWeight || '400',
                                                            textAlign: (block.styles.textAlign as any) || 'left',
                                                            fontStyle: block.content.fontStyle || block.styles.fontStyle || 'normal'
                                                        }}
                                                    >
                                                        {block.content.text}
                                                    </div>

                                                    {block.content.button && (
                                                        <div style={{ marginTop: '16px' }}>
                                                            {/* Bulletproof Button for Image-Text Block */}
                                                            <table border={0} cellSpacing="0" cellPadding="0">
                                                                <tbody>
                                                                    <tr>
                                                                        <td align="center" style={{
                                                                            backgroundColor: block.content.button.backgroundColor,
                                                                            borderRadius: block.content.button.borderRadius || '4px'
                                                                        } as React.CSSProperties}>
                                                                            <a href={block.content.button.url} target="_blank" style={{
                                                                                display: 'inline-block',
                                                                                padding: '10px 20px', // Match Editor
                                                                                backgroundColor: block.content.button.backgroundColor,
                                                                                borderRadius: block.content.button.borderRadius || '4px',
                                                                                color: block.content.button.color,
                                                                                fontSize: '14px', // Match Editor
                                                                                fontWeight: '500', // Match Editor (not bold)
                                                                                textDecoration: 'none'
                                                                            }}>
                                                                                {block.content.button.text}
                                                                            </a>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>

                                                            {/* VML for Image-Text Button */}
                                                            <div dangerouslySetInnerHTML={{
                                                                __html: `<!--[if mso]>
                                                                <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${block.content.button.url}" style="height:40px;v-text-anchor:middle;width:150px;" arcsize="${Math.min(100, parseInt(block.content.button.borderRadius || '4') * 2.5)}%" strokecolor="${block.content.button.backgroundColor}" fillcolor="${block.content.button.backgroundColor}">
                                                                    <w:anchorlock/>
                                                                    <center style="color:${block.content.button.color};font-family:Arial, sans-serif;font-size:14px;font-weight:500;">${block.content.button.text}</center>
                                                                </v:roundrect>
                                                                <![endif]-->`
                                                            }} />
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>

                                </Section>
                            )}
                            {block.type === 'event' && (
                                <Section style={{ padding: '10px 0', textAlign: block.styles.textAlign as any }}>
                                    <table width="100%" cellPadding="0" cellSpacing="0" style={{ border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#fff', maxWidth: '400px', display: 'inline-block', textAlign: 'left' }}>
                                        <tbody>
                                            <tr>
                                                <td width="100" style={{ backgroundColor: block.content.itemColor, padding: '16px', textAlign: 'center', color: '#fff' }}>
                                                    <div style={{ fontSize: '30px', fontWeight: 'bold', lineHeight: '1' }}>{block.content.day}</div>
                                                    <div style={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', marginTop: '4px', opacity: 0.9 }}>{block.content.month}</div>
                                                </td>
                                                <td style={{ padding: '16px', textAlign: 'left' }}>
                                                    <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#111827', marginBottom: '4px' }}>{block.content.title}</div>
                                                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>{block.content.time}</div>
                                                    {/* Bulletproof Button for Event Block */}
                                                    <table border={0} cellSpacing="0" cellPadding="0">
                                                        <tbody>
                                                            <tr>
                                                                <td align="center" style={{
                                                                    backgroundColor: '#f3f4f6',
                                                                    borderRadius: '4px'
                                                                } as React.CSSProperties}>
                                                                    <a href={block.content.accessUrl} target="_blank" style={{
                                                                        display: 'inline-block',
                                                                        padding: '6px 12px',
                                                                        backgroundColor: '#f3f4f6',
                                                                        color: '#374151',
                                                                        fontSize: '12px',
                                                                        fontWeight: '500',
                                                                        textDecoration: 'none',
                                                                        borderRadius: '4px'
                                                                    }}>
                                                                        {block.content.btnText}
                                                                    </a>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </Section>
                            )}

                            {block.type === 'alert' && (
                                <Section style={{ padding: '10px 0', textAlign: block.styles.textAlign as any }}>
                                    <table width="100%" cellPadding="0" cellSpacing="0" style={{
                                        borderRadius: '8px',
                                        backgroundColor: block.content.variant === 'warning' ? '#fffbeb' :
                                            block.content.variant === 'success' ? '#f0fdf4' :
                                                block.content.variant === 'tip' ? '#f3f4f6' : '#eff6ff',
                                        color: block.content.variant === 'warning' ? '#92400e' :
                                            block.content.variant === 'success' ? '#166534' :
                                                block.content.variant === 'tip' ? '#1f2937' : '#1e40af',
                                        maxWidth: '100%',
                                        display: 'inline-block',
                                        textAlign: 'left'
                                    }}>
                                        <tbody>
                                            <tr>
                                                <td width="40" style={{ padding: '16px 0 16px 16px', fontSize: '20px', verticalAlign: 'top' }}>
                                                    {block.content.variant === 'warning' ? '⚠️' :
                                                        block.content.variant === 'success' ? '✅' :
                                                            block.content.variant === 'tip' ? '🔥' : 'ℹ️'}
                                                </td>
                                                <td style={{ padding: '16px', fontSize: '14px', lineHeight: '1.5', fontWeight: '500', textAlign: 'left' }}>
                                                    {block.content.text}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </Section>
                            )}

                            {block.type === 'code' && (
                                <Section style={{ padding: '10px 0', textAlign: block.styles.textAlign as any }}>
                                    <div style={{ backgroundColor: '#1e1e1e', borderRadius: '8px', overflow: 'hidden', padding: '16px', textAlign: 'left', display: 'inline-block', width: '100%' }}>
                                        {/* Fake Terminal Dots */}
                                        <div style={{ marginBottom: '12px', borderBottom: '1px solid #333', paddingBottom: '12px' }}>
                                            <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#ef4444', marginRight: '6px' }}></span>
                                            <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#eab308', marginRight: '6px' }}></span>
                                            <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#22c55e' }}></span>
                                        </div>
                                        <pre style={{ margin: '0', fontSize: '12px', fontFamily: 'monospace', color: '#fff', whiteSpace: 'pre-wrap', lineHeight: '1.5' }}>
                                            {block.content.code}
                                        </pre>
                                    </div>
                                </Section>
                            )}

                            {block.type === 'pros-cons' && (
                                <Section style={{ padding: '10px 0', textAlign: block.styles.textAlign as any }}>
                                    <table width="100%" cellPadding="0" cellSpacing="0" style={{ textAlign: 'left' }}>
                                        <tbody>
                                            <tr>
                                                <td width="50%" valign="top" style={{ paddingRight: '10px' }}>
                                                    <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #dcfce7', borderRadius: '8px', padding: '16px', textAlign: 'left' }}>
                                                        <div style={{ color: '#15803d', fontWeight: 'bold', marginBottom: '12px' }}>✅ Pros</div>
                                                        <ul style={{ padding: '0', margin: '0', listStyleType: 'none' }}>
                                                            {block.content.pros?.map((item: string, i: number) => (
                                                                <li key={i} style={{ marginBottom: '8px', fontSize: '14px', color: '#374151', paddingLeft: '20px', position: 'relative' }}>
                                                                    <span style={{ position: 'absolute', left: '0', color: '#22c55e' }}>✓</span>
                                                                    {item}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </td>
                                                <td width="50%" valign="top" style={{ paddingLeft: '10px' }}>
                                                    <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fee2e2', borderRadius: '8px', padding: '16px', textAlign: 'left' }}>
                                                        <div style={{ color: '#b91c1c', fontWeight: 'bold', marginBottom: '12px' }}>❌ Cons</div>
                                                        <ul style={{ padding: '0', margin: '0', listStyleType: 'none' }}>
                                                            {block.content.cons?.map((item: string, i: number) => (
                                                                <li key={i} style={{ marginBottom: '8px', fontSize: '14px', color: '#374151', paddingLeft: '20px', position: 'relative' }}>
                                                                    <span style={{ position: 'absolute', left: '0', color: '#ef4444' }}>✕</span>
                                                                    {item}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </Section>
                            )}

                            {block.type === 'audio' && (
                                <Section style={{ padding: '10px 0', textAlign: (block.styles.textAlign || 'left') as any }}>
                                    <table cellPadding="0" cellSpacing="0" style={{ width: '100%', border: '1px solid #e5e7eb', borderRadius: '12px', overflow: 'hidden', backgroundColor: '#fff', maxWidth: '450px', display: 'inline-block', textAlign: 'left', boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)' }}>
                                        <tbody>
                                            <tr>
                                                <td style={{ width: '1%', whiteSpace: 'nowrap', padding: '12px 0 12px 12px', textAlign: 'left', verticalAlign: 'middle' }}>
                                                    <Img src={block.content.cover} alt="Cover" width="64" height="64" style={{ borderRadius: '6px', display: 'block', objectFit: 'cover' }} />
                                                </td>
                                                <td style={{ padding: '12px 16px', textAlign: 'left', verticalAlign: 'middle' }}>
                                                    <div style={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', color: '#9ca3af', marginBottom: '4px', letterSpacing: '0.025em' }}>Podcast</div>
                                                    <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#111827', marginBottom: '8px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{block.content.title}</div>
                                                    {/* Fake Progress */}
                                                    <div style={{ height: '6px', width: '100%', backgroundColor: '#f3f4f6', borderRadius: '3px', position: 'relative', marginBottom: '4px' }}>
                                                        <div style={{ height: '100%', width: `${block.content.progress}%`, backgroundColor: '#2563eb', borderRadius: '3px' }}></div>
                                                    </div>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#9ca3af', fontFamily: 'monospace' }}>
                                                        <span>12:40</span>
                                                        <span style={{ float: 'right' }}>{block.content.duration}</span>
                                                    </div>
                                                </td>
                                                <td style={{ width: '1%', whiteSpace: 'nowrap', padding: '12px 12px 12px 0', textAlign: 'center', verticalAlign: 'middle' }}>
                                                    <a href={block.content.url} style={{ display: 'inline-block', width: '40px', height: '40px', backgroundColor: '#000', borderRadius: '50%', lineHeight: '40px', color: '#fff', textAlign: 'center', textDecoration: 'none', fontSize: '14px' }}>
                                                        ▶
                                                    </a>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </Section>
                            )}

                            {block.type === 'divider' && (
                                <Section style={{ padding: block.styles.padding || '20px 0' }}>
                                    <hr style={{
                                        border: 'none',
                                        borderTop: `${block.content.thickness || 1}px ${block.content.style || 'solid'} ${block.content.color || '#E0E0E0'}`,
                                        margin: 0
                                    }} />
                                </Section>
                            )}

                        </React.Fragment>
                    ))}
                </Container>
                {/* Footer Spacer */}
                <Section style={{ height: '40px' }} />
            </Body>
        </Html >
    );
};


