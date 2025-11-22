import React, { useState, useEffect, useRef } from 'react';
import { X, Camera, Maximize2, Play, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { galleryItems, GalleryItem } from '../../../data/gallery';

interface GalleryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const GalleryDrawer = ({ isOpen, onClose }: GalleryDrawerProps) => {
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const filmstripRef = useRef<HTMLDivElement>(null);

  // Extract unique categories
  const categories = ['All', ...Array.from(new Set(galleryItems.map(item => item.category)))];

  // Filter items based on category
  const filteredItems = galleryItems.filter(item => {
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    return matchesCategory;
  });

  // Derived state for navigation
  const selectedIndex = selectedImage ? filteredItems.findIndex(item => item.id === selectedImage.id) : -1;

  // Navigation Handlers
  const handleNext = () => {
    if (selectedIndex === -1) return;
    const nextIndex = (selectedIndex + 1) % filteredItems.length;
    setSelectedImage(filteredItems[nextIndex]);
  };

  const handlePrev = () => {
    if (selectedIndex === -1) return;
    const prevIndex = (selectedIndex - 1 + filteredItems.length) % filteredItems.length;
    setSelectedImage(filteredItems[prevIndex]);
  };

  const handleSelect = (item: GalleryItem) => {
    setSelectedImage(item);
  };

  // Auto-scroll filmstrip to active item
  useEffect(() => {
    if (selectedImage && filmstripRef.current) {
      const activeThumb = filmstripRef.current.children[selectedIndex] as HTMLElement;
      if (activeThumb) {
        activeThumb.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center'
        });
      }
    }
  }, [selectedImage, selectedIndex]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedImage) {
        if (e.key === 'ArrowRight') handleNext();
        if (e.key === 'ArrowLeft') handlePrev();
        if (e.key === 'Escape') setSelectedImage(null);
      } else {
        if (e.key === 'Escape') onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage, selectedIndex, onClose]);

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] transition-opacity duration-500 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div 
        className={`fixed top-0 right-0 h-full w-full md:w-[800px] bg-zinc-950 border-l border-zinc-800 z-[70] transform transition-transform duration-500 ease-out shadow-2xl flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex flex-col px-8 py-6 border-b border-zinc-800 bg-zinc-950/50 backdrop-blur-xl z-10 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-pink-500/10 rounded-lg border border-pink-500/20">
                <Camera className="w-5 h-5 text-pink-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-zinc-100">Photo Gallery</h2>
                <p className="text-zinc-400 text-sm">Weekend adventures & snapshots</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Category Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                  activeCategory === category
                    ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/25'
                    : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 border border-zinc-800'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Content - Masonry Grid */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
            {filteredItems.map((item) => (
              <div 
                key={item.id}
                className="break-inside-avoid group relative cursor-zoom-in rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800/50 animate-in fade-in duration-500 fill-mode-backwards"
                onClick={() => setSelectedImage(item)}
              >
                <div className="relative w-full">
                  {item.type === 'video' ? (
                    <video
                      src={item.src}
                      className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                      muted
                      loop
                      playsInline
                      autoPlay
                    />
                  ) : (
                    <Image
                      src={item.src}
                      alt={item.alt}
                      width={500}
                      height={500}
                      className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  )}
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                    <span className="text-pink-400 text-xs font-bold uppercase tracking-wider mb-1">{item.category}</span>
                    <p className="text-white font-medium text-sm truncate">{item.caption || item.alt}</p>
                    <div className="absolute top-4 right-4 p-2 bg-black/50 backdrop-blur-md rounded-full">
                      {item.type === 'video' ? (
                        <Play className="w-4 h-4 text-white ml-0.5" />
                      ) : (
                        <Maximize2 className="w-4 h-4 text-white" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="flex flex-col items-center justify-center h-64 text-zinc-500">
              <Camera className="w-12 h-12 mb-4 opacity-20" />
              <p>No photos found in this category</p>
            </div>
          )}
          
          {/* Footer Text */}
          <div className="mt-12 pb-8 text-center text-zinc-500 text-sm font-mono">
            CAPTURED ON IPHONE & DSLR • 2023-2024
          </div>
        </div>
      </div>

      {/* Immersive Lightbox */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[80] bg-black flex flex-col animate-in fade-in duration-300"
          onClick={() => setSelectedImage(null)}
        >
          {/* Close Button - Floating */}
          <button 
            className="absolute top-6 right-6 p-3 text-white/80 hover:text-white bg-black/20 backdrop-blur-md rounded-full hover:bg-white/20 transition-all z-50"
            onClick={() => setSelectedImage(null)}
          >
            <X className="w-6 h-6" />
          </button>

          {/* Main Stage - Fullscreen */}
          <div 
            className="absolute inset-0 flex items-center justify-center overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Nav Arrows */}
            <button 
                onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                className="absolute left-2 md:left-8 p-2 md:p-4 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-all z-40 group"
            >
                <ChevronLeft className="w-8 h-8 md:w-10 md:h-10 group-hover:-translate-x-1 transition-transform" />
            </button>
            <button 
                onClick={(e) => { e.stopPropagation(); handleNext(); }}
                className="absolute right-2 md:right-8 p-2 md:p-4 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-all z-40 group"
            >
                <ChevronRight className="w-8 h-8 md:w-10 md:h-10 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Media */}
            {selectedImage.type === 'video' ? (
              <video
                src={selectedImage.src}
                className="w-full h-full object-contain"
                controls
                autoPlay
                playsInline
              />
            ) : (
              <div className="relative w-full h-full">
                <Image
                  src={selectedImage.src}
                  alt={selectedImage.alt}
                  fill
                  className="object-contain"
                  priority
                  quality={100}
                />
              </div>
            )}
          </div>

          {/* Overlays Layer (Caption + Filmstrip) */}
          <div 
            className="absolute bottom-0 left-0 right-0 z-40 flex flex-col justify-end pointer-events-none"
            style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.6) 50%, transparent 100%)' }}
          >
            {/* Caption Area */}
            <div className="pb-6 pt-12 px-8 text-center pointer-events-auto">
               <span className="inline-block px-3 py-1 mb-2 bg-pink-500/80 rounded-full text-white text-xs font-bold uppercase tracking-wider shadow-lg">
                {selectedImage.category}
              </span>
              {selectedImage.caption && (
                <p className="text-white/90 text-lg font-medium text-shadow-sm">{selectedImage.caption}</p>
              )}
            </div>

            {/* Filmstrip Reel */}
            <div 
              className="h-20 md:h-24 w-full pointer-events-auto pb-4 px-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div 
                  ref={filmstripRef}
                  className="flex items-center gap-3 px-4 overflow-x-auto w-full h-full scrollbar-hide scroll-smooth"
              >
                  {filteredItems.map((item, idx) => (
                      <div 
                          key={item.id}
                          onClick={() => handleSelect(item)}
                          className={`relative flex-shrink-0 h-full aspect-[3/2] cursor-pointer rounded-md overflow-hidden transition-all duration-300 border-2 ${
                              selectedImage.id === item.id 
                                  ? 'border-pink-500 scale-105 opacity-100 shadow-xl shadow-pink-500/20' 
                                  : 'border-transparent border-white/10 opacity-50 hover:opacity-100 hover:scale-105'
                          }`}
                      >
                          {item.type === 'video' ? (
                               <div className="w-full h-full bg-zinc-900 flex items-center justify-center relative">
                                  <video 
                                      src={item.src}
                                      className="w-full h-full object-cover"
                                      preload="metadata"
                                  />
                                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                      <Play className="w-4 h-4 text-white/80" />
                                  </div>
                               </div>
                          ) : (
                              <Image
                                  src={item.src}
                                  alt={item.alt}
                                  fill
                                  className="object-cover"
                              />
                          )}
                      </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GalleryDrawer;
