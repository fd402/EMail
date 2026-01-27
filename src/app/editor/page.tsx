'use client';

import { Toolbox } from '@/components/workbench/Toolbox';
import { Canvas } from '@/components/workbench/Canvas';
import { SettingsPanel } from '@/components/workbench/SettingsPanel';
import { DndContext, DragOverlay, useSensor, useSensors, PointerSensor, DragStartEvent, DragEndEvent } from '@dnd-kit/core';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useEmailStore } from '@/store/useEmailStore';
import { Header } from '@/components/workbench/Header';
import { renderEmail } from '@/lib/renderEmail';
import { Monitor, Smartphone } from 'lucide-react';
import { TemplateGallery } from '@/components/workbench/TemplateGallery';
import { OnboardingTour } from '@/components/onboarding/OnboardingTour';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';

export default function Home() {
  // Enable keyboard shortcuts (Cmd/Ctrl+Z for undo, Cmd/Ctrl+Shift+Z for redo)
  useKeyboardShortcuts();

  const [activeId, setActiveId] = useState<string | null>(null);
  const { addBlock, moveBlock, updateBlock } = useEmailStore();
  const blocks = useEmailStore((state) => state.blocks);
  const settings = useEmailStore((state) => state.settings);
  const [isMounted, setIsMounted] = useState(false);
  const [viewMode, setViewMode] = useState<'editor' | 'preview'>('editor');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [previewHtml, setPreviewHtml] = useState('');
  const [showTemplates, setShowTemplates] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Prevent Hydration Mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Update preview when switching to preview mode OR when blocks/settings change
  useEffect(() => {
    if (viewMode === 'preview') {
      const generate = async () => {
        const html = await renderEmail(blocks, settings);
        setPreviewHtml(html);
      };
      generate();
    }
  }, [viewMode, blocks, settings]);

  // Sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Require 8px movement to start drag
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    // 1. Reordering within Canvas
    // If it's NOT a toolbox item, it must be a reorder
    if (active.id !== over.id && !active.data.current?.isToolboxItem) {
      const currentBlocks = useEmailStore.getState().blocks;
      const oldIndex = currentBlocks.findIndex((b) => b.id === active.id);

      // If dropping on the main canvas container, move to the end
      if (over.id === 'canvas-droppable') {
        moveBlock(oldIndex, currentBlocks.length - 1);
        return;
      }

      const newIndex = currentBlocks.findIndex((b) => b.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        moveBlock(oldIndex, newIndex);
      }
      return;
    }

    // 2. Drag from Toolbox to Canvas
    if (active.data.current?.isToolboxItem) {
      const type = active.data.current.type;

      // Special Case: Dropping a Button onto an Image-Text block
      if (over.id.toString().startsWith('drop-zone-')) {
        const targetBlockId = over.id.toString().replace('drop-zone-', '');

        // Only allow dropping 'button' type onto this zone for now
        if (type === 'button') {
          const targetBlock = useEmailStore.getState().blocks.find(b => b.id === targetBlockId);
          if (targetBlock && targetBlock.type === 'image-text') {
            updateBlock(targetBlockId, {
              content: {
                ...targetBlock.content,
                button: {
                  text: 'Learn More',
                  url: '#',
                  backgroundColor: '#000000',
                  color: '#ffffff',
                  borderRadius: '4px'
                }
              }
            });
          }
          return;
        }
      }

      // If dropped on canvas-droppable or over any other block
      const newBlockId = `block-${Date.now()}`;

      // Create the block
      const newBlock = {
        id: newBlockId,
        type: type,
        content: {
          ...getDefaultContent(type),
          ...(active.data.current.payload || {}) // Merge payload (e.g. src from Unsplash)
        },
        styles: getDefaultStyles(type),
      };
      addBlock(newBlock);
      return;
    }

    // Reorder blocks on canvas
    const oldIndex = useEmailStore.getState().blocks.findIndex(b => b.id === active.id);
    const newIndex = useEmailStore.getState().blocks.findIndex(b => b.id === over.id);

    if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
      moveBlock(oldIndex, newIndex);
    }
  };

  const getDefaultContent = (type: string) => {
    // ... rest of getDefaultContent
    if (type === 'text') return { text: 'Start crafting your message here. Bold your key ideas or use bullet points to drive engagement.', fontFamily: 'Arial' };
    if (type === 'image') return { src: 'https://placehold.co/600x300/f8fafc/6366f1?text=Your+Amazing+Story', alt: 'Premium Image Placeholder' };
    if (type === 'button') return { text: 'Get Started Today', url: '#' };
    if (type === 'row') return { columns: 2 };
    if (type === 'social') return {
      networks: { facebook: true, x: true, instagram: true, linkedin: true },
      variant: 'color',
      align: 'center'
    };
    if (type === 'video') return { url: '', thumbnail: 'https://placehold.co/600x340/0f172a/6366f1?text=Video+Presentation' };
    if (type === 'html') return { code: '<div style="padding: 20px; text-align: center; color: #6366f1; font-weight: bold; border: 2px dashed #e2e8f0; border-radius: 12px;">\n  Your Custom HTML Snippet\n</div>' };
    if (type === 'menu') return {
      items: [
        { text: 'Home', url: '#' },
        { text: 'Solutions', url: '#' },
        { text: 'Pricing', url: '#' },
        { text: 'Company', url: '#' }
      ],
      separator: '|',
      itemColor: '#64748B'
    };
    if (type === 'product-card') return {
      image: 'https://placehold.co/600x600/f8fafc/6366f1?text=Featured+Product',
      title: 'Premium Product Name',
      price: '99.00',
      currency: '$',
      btnText: 'Shop the Collection',
      badge: true,
      badgeText: 'New Arrival',
      priceColor: '#6366f1'
    };
    if (type === 'nps') return { variant: 'smileys', itemColor: '#6366f1' };
    if (type === 'countdown') return { days: '05', hours: '12', minutes: '45', seconds: '30', labelColor: '#94A3B8', numberColor: '#6366f1' };
    if (type === 'qr') return { value: 'https://plainly.io', size: 150, color: '#6366f1' };
    if (type === 'table') return {
      rows: [
        { label: 'Feature Access', value: 'Full Suite' },
        { label: 'Monthly Growth', value: '+45%' },
        { label: 'Support Tier', value: 'Priority' }
      ],
      textColor: '#334155',
      striped: true
    };
    if (type === 'image-text') return {
      image: 'https://placehold.co/600x600/f8fafc/6366f1?text=Feature+Highlight',
      text: 'Engage with Purpose\n\nDeliver personalized experiences that convert. Our new editor makes it easier than ever to build stunning emails.',
      layout: '50-50',
      isReversed: false,
      backgroundColor: 'transparent'
    };
    if (type === 'event') return {
      title: 'Global Performance Summit',
      day: '24',
      month: 'MAR',
      time: '10:00 AM EST',
      btnText: 'RSVP Now',
      itemColor: '#6366f1'
    };
    if (type === 'alert') return {
      variant: 'info',
      text: 'Pro Tip: Personalize your subject lines for 3x higher open rates.'
    };
    if (type === 'code') return {
      code: '{\n  "success": true,\n  "message": "Performance Optimized",\n  "status": 200\n}',
      language: 'json'
    };
    if (type === 'pros-cons') return {
      pros: ['Intuitive Design', 'Real-time Preview', 'High Conversion'],
      cons: ['Only 24 Hours/Day', 'Too Many Features']
    };
    if (type === 'audio') return {
      title: 'SaaS Growth Secrets - Ep. 42',
      duration: '45min',
      cover: 'https://placehold.co/300x300/6366f1/ffffff?text=Podcast',
      progress: 65
    };
    if (type === 'divider') return {
      thickness: 1,
      color: '#E2E8F0',
      style: 'solid'
    };
    return {};
  };

  const getDefaultStyles = (type: string) => {
    if (type === 'text') return { padding: '10px', textAlign: 'left' };
    if (type === 'image') return { padding: '10px', textAlign: 'center' };
    if (type === 'button') return { padding: '10px', textAlign: 'center', backgroundColor: '#6366f1', color: '#ffffff', borderRadius: '12px', fontFamily: 'Arial', width: 'auto' };
    if (type === 'row') return { padding: '10px' };
    if (type === 'social') return { padding: '10px', textAlign: 'center' };
    if (type === 'video') return { padding: '10px', textAlign: 'center' };
    if (type === 'html') return { padding: '10px' };
    if (type === 'menu') return { padding: '10px', backgroundColor: '#ffffff' };
    if (type === 'product-card') return { padding: '10px', backgroundColor: '#ffffff' };
    if (type === 'nps') return { padding: '10px', backgroundColor: '#ffffff' };
    if (type === 'countdown') return { padding: '10px', backgroundColor: '#ffffff', textAlign: 'center' };
    if (type === 'qr') return { padding: '10px', textAlign: 'center' };
    if (type === 'table') return { padding: '10px', backgroundColor: '#ffffff' };
    if (type === 'image-text') return { padding: '10px', backgroundColor: '#ffffff' };
    if (type === 'event') return { padding: '10px', backgroundColor: '#ffffff' };
    if (type === 'alert') return { padding: '10px' };
    if (type === 'code') return { padding: '10px', backgroundColor: '#1e1e1e', color: '#ffffff', fontFamily: 'monospace', textAlign: 'left' };
    if (type === 'pros-cons') return { padding: '10px', backgroundColor: '#ffffff' };
    if (type === 'audio') return { padding: '10px', backgroundColor: '#ffffff' };
    if (type === 'video') return { padding: '10px', backgroundColor: '#ffffff' };
    if (type === 'divider') return { padding: '20px 0' };
    return { padding: '10px' };
  };

  if (!isMounted) return null;

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-50 text-slate-900 font-sans antialiased selection:bg-indigo-100 selection:text-indigo-900">
      <Header
        viewMode={viewMode}
        setViewMode={setViewMode}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        onOpenTemplates={() => setShowTemplates(true)}
      />

      {viewMode === 'editor' ? (
        <DndContext
          id="workbench-dnd"
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <main className="flex-1 flex overflow-hidden relative">
            {/* Workbench Grid Background */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#6366f1 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>

            {/* Left: Toolbox */}
            <Toolbox />

            {/* Center: Canvas */}
            <Canvas isDarkMode={isDarkMode} />

            {/* Right: Settings */}
            <SettingsPanel />

            {/* Drag Overlay */}
            {typeof window !== 'undefined' && createPortal(
              <DragOverlay>
                {activeId ? (
                  <div className="bg-white/90 backdrop-blur-md p-4 border border-indigo-100 shadow-premium rounded-2xl w-[180px] flex items-center gap-3 opacity-90 cursor-grabbing animate-in fade-in zoom-in duration-200">
                    {activeId.startsWith('toolbox-') ? (
                      <>
                        <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                          {activeId.split('-')[1].charAt(0).toUpperCase()}
                        </div>
                        <span className="font-bold text-slate-900 capitalize tracking-tight">
                          {activeId.split('-')[1]}
                        </span>
                      </>
                    ) : (
                      <div className="font-bold text-indigo-500 pl-2">Moving Block...</div>
                    )}
                  </div>
                ) : null}
              </DragOverlay>,
              document.body
            )}
          </main>
        </DndContext>
      ) : (
        <div className="flex-1 bg-[#F4F2EE] h-full flex flex-col items-center justify-center p-8 overflow-auto">
          {/* Desktop Preview Only */}
          {/* Preview Controls */}
          <div className="flex flex-col items-center gap-6 w-full max-w-5xl h-full">
            <div className="bg-white p-1.5 rounded-2xl shadow-sm border border-slate-200 flex gap-1">
              <button
                onClick={() => setPreviewDevice('desktop')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${previewDevice === 'desktop'
                  ? 'bg-indigo-50 text-indigo-600 shadow-sm ring-1 ring-indigo-100'
                  : 'text-slate-500 hover:bg-slate-50'
                  }`}
              >
                <Monitor className="w-4 h-4" />
                <span>Desktop</span>
              </button>
              <button
                onClick={() => setPreviewDevice('mobile')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${previewDevice === 'mobile'
                  ? 'bg-indigo-50 text-indigo-600 shadow-sm ring-1 ring-indigo-100'
                  : 'text-slate-500 hover:bg-slate-50'
                  }`}
              >
                <Smartphone className="w-4 h-4" />
                <span>Mobile</span>
              </button>
            </div>

            {/* Preview Frame */}
            <div
              className={`bg-white rounded-[2rem] shadow-2xl overflow-hidden transition-all duration-500 ease-in-out border-[8px] border-slate-800 relative ${previewDevice === 'mobile' ? 'h-[700px]' : 'h-[600px] w-full max-w-[900px]'
                }`}
              style={{
                width: previewDevice === 'mobile' ? '375px' : '100%',
              }}
            >
              {/* Fake Mobile Notch */}
              {previewDevice === 'mobile' && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 h-6 w-32 bg-slate-800 rounded-b-2xl z-10"></div>
              )}

              <iframe
                srcDoc={previewHtml}
                className="w-full h-full border-none bg-white"
                title="Email Preview"
              />
            </div>

            <div className="text-xs text-slate-400 font-medium">
              {previewDevice === 'desktop' ? 'Standard 800px Email View' : 'iPhone SE View (375px)'}
            </div>
          </div>
        </div>
      )}

      <TemplateGallery isOpen={showTemplates} onClose={() => setShowTemplates(false)} />
      <OnboardingTour />
    </div>
  );
}
