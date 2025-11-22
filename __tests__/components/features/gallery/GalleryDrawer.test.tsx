import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import GalleryDrawer from '@/src/components/features/gallery/GalleryDrawer';
import { logger } from '@/src/services/logger';

// Mock dependencies
jest.mock('@/src/services/logger', () => ({
  logger: {
    action: jest.fn(),
  },
}));

jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, ...props }: any) => <img src={src} alt={alt} />,
}));

jest.mock('lucide-react', () => ({
  X: () => <span data-testid="icon-x">X</span>,
  Camera: () => <span data-testid="icon-camera">Camera</span>,
  Maximize2: () => <span data-testid="icon-maximize">Max</span>,
  Play: () => <span data-testid="icon-play">Play</span>,
  ChevronLeft: () => <span data-testid="icon-left">Left</span>,
  ChevronRight: () => <span data-testid="icon-right">Right</span>,
}));

// Mock Data
jest.mock('../../../../src/data/gallery', () => ({
  galleryItems: [
    { id: '1', src: '/img1.jpg', alt: 'Image 1', category: 'Nature', type: 'image' },
    { id: '2', src: '/img2.jpg', alt: 'Image 2', category: 'Urban', type: 'image' },
    { id: '3', src: '/vid1.mp4', alt: 'Video 1', category: 'Nature', type: 'video' },
  ],
}));

describe('GalleryDrawer', () => {
  beforeAll(() => {
    // Mock scrollIntoView
    window.HTMLElement.prototype.scrollIntoView = jest.fn();
  });

  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders hidden when not open', () => {
    render(<GalleryDrawer {...defaultProps} isOpen={false} />);
    // The drawer uses translate-x-full to hide, so it's in the DOM but visually hidden.
    // Or opacity-0 on backdrop.
    // We can check class names or just ensuring interaction is not possible?
    // Actually easier to test 'isOpen=true' renders visible content.
    const drawer = screen.getByText('Photo Gallery').closest('.fixed');
    expect(drawer).toHaveClass('translate-x-full');
  });

  it('renders visible when open', () => {
    render(<GalleryDrawer {...defaultProps} />);
    const drawer = screen.getByText('Photo Gallery').closest('.fixed');
    expect(drawer).toHaveClass('translate-x-0');
    // Check for filter buttons
    expect(screen.getByRole('button', { name: 'Nature' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Urban' })).toBeInTheDocument();
  });

  it('logs gallery_filter on category click', () => {
    render(<GalleryDrawer {...defaultProps} />);
    // Find the filter button specifically
    const natureBtn = screen.getByRole('button', { name: 'Nature' });
    
    fireEvent.click(natureBtn);
    
    expect(logger.action).toHaveBeenCalledWith('gallery_filter', { category: 'Nature' });
  });

  it('logs gallery_select_image on image click', () => {
    render(<GalleryDrawer {...defaultProps} />);
    // Find the first image container (masonry grid item)
    // The item has an onClick handler.
    // We can search by alt text.
    const img1 = screen.getByAltText('Image 1');
    // The click listener is on the parent div of the image
    const card = img1.closest('div.break-inside-avoid');
    
    if (!card) throw new Error('Card not found');
    
    fireEvent.click(card);
    
    expect(logger.action).toHaveBeenCalledWith('gallery_select_image', { id: '1', category: 'Nature' });
    
    // Should open lightbox
    expect(screen.getByTestId('icon-left')).toBeInTheDocument();
  });

  it('logs gallery_nav_next/prev in lightbox', () => {
    render(<GalleryDrawer {...defaultProps} />);
    // Open lightbox first
    const img1 = screen.getByAltText('Image 1');
    fireEvent.click(img1.closest('div.break-inside-avoid')!);
    
    // Click Next
    const nextBtn = screen.getByTestId('icon-right').closest('button')!;
    fireEvent.click(nextBtn);
    
    expect(logger.action).toHaveBeenCalledWith('gallery_nav_next', { id: '2' });
    
    // Click Prev
    const prevBtn = screen.getByTestId('icon-left').closest('button')!;
    fireEvent.click(prevBtn);
    
    expect(logger.action).toHaveBeenCalledWith('gallery_nav_prev', { id: '1' });
  });

  it('logs gallery_close_lightbox on close', () => {
    render(<GalleryDrawer {...defaultProps} />);
    // Open lightbox
    const img1 = screen.getByAltText('Image 1');
    fireEvent.click(img1.closest('div.break-inside-avoid')!);
    
    // Find close button in lightbox (there are two X icons: one in header, one in lightbox)
    // Lightbox one is 'absolute top-6 right-6 ...'
    // We can verify by finding the button that also calls setSelectedImage(null)
    
    // Since we have multiple X icons, let's look for the one inside the lightbox container (fixed inset-0 z-[80])
    // Or just click the one that appeared last?
    
    // Use getAllByTestId('icon-x').
    const closeIcons = screen.getAllByTestId('icon-x');
    // The last one should be the lightbox one (rendered last in portal/stack).
    const lightboxCloseBtn = closeIcons[closeIcons.length - 1].closest('button')!;
    
    fireEvent.click(lightboxCloseBtn);
    
    expect(logger.action).toHaveBeenCalledWith('gallery_close_lightbox');
  });
});
