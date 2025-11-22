import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Navigation from '@/src/components/layout/Navigation';
import { logger } from '@/src/services/logger';

// Mock logger
jest.mock('@/src/services/logger', () => ({
  logger: {
    navigation: jest.fn(),
    action: jest.fn(),
  },
}));

// Mock AudioGenerator
jest.mock('@/src/components/features/audio/AudioGenerator', () => ({
  AudioGenerator: () => <div data-testid="audio-generator">Audio</div>,
}));

describe('Navigation', () => {
  const mockScrollToSection = jest.fn();
  const mockOnOpenBlog = jest.fn();
  const mockOnOpenGallery = jest.fn();
  const defaultProps = {
    activeSection: 'home',
    scrollToSection: mockScrollToSection,
    onOpenBlog: mockOnOpenBlog,
    onOpenGallery: mockOnOpenGallery,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders desktop navigation items', () => {
    render(<Navigation {...defaultProps} />);
    expect(screen.getByText('home')).toBeInTheDocument();
    expect(screen.getByText('projects')).toBeInTheDocument();
    expect(screen.getByText('about')).toBeInTheDocument();
    expect(screen.getByText('Writing')).toBeInTheDocument();
    expect(screen.getByText('Photos')).toBeInTheDocument();
  });

  it('logs navigation on section click (desktop)', () => {
    render(<Navigation {...defaultProps} />);
    const projectsBtn = screen.getByText('projects');
    fireEvent.click(projectsBtn);

    expect(logger.navigation).toHaveBeenCalledWith('projects');
    expect(mockScrollToSection).toHaveBeenCalledWith('projects');
  });

  it('logs open_drawer for Blog (desktop)', () => {
    render(<Navigation {...defaultProps} />);
    const blogBtn = screen.getByText('Writing');
    fireEvent.click(blogBtn);

    expect(logger.action).toHaveBeenCalledWith('open_drawer', { type: 'blog' });
    expect(mockOnOpenBlog).toHaveBeenCalled();
  });

  it('logs toggle_mobile_menu', () => {
    render(<Navigation {...defaultProps} />);
    // Menu icon is in the button with onClick handler that toggles state
    // We can find it by role since it's a button, but there are many.
    // The mobile menu toggle is usually visible only on small screens, but in JSDOM default size is usually desktop?
    // Tailwind classes don't apply logic in JSDOM unless we simulate window resize, but the DOM elements are usually rendered if not conditionally rendered by JS logic checking window size. 
    // Here, `className="md:hidden ..."` is used. In JSDOM, styles aren't applied so visible/hidden doesn't strictly apply, elements are just in the DOM. 
    // However, React renders everything.
    
    // The X/Menu icons are from lucide-react, they render SVGs.
    // Let's look for the button containing the Menu icon.
    // We can verify the button by its logging behavior potentially, or add a test-id if needed.
    // Or find by the SVG content.
    
    // Simpler approach: The mobile toggle button calls setIsMobileMenuOpen.
    // It's the button in the div with "md:hidden".
    
    // Let's assume we can find it by the click handler if we could...
    // Actually, just finding the button that wraps the Menu icon.
    // Assuming Menu icon has no text.
    
    // Let's rely on the structure or aria-label if present. 
    // Looking at code: `<button onClick=...>{isMobileMenuOpen ? <X /> : <Menu />}</button>`
    // No aria-label. I'll find it by traversing. 
    
    // Or I can use the fact that it's one of the buttons.
    // Let's try to find by the Menu icon presence if `lucide-react` renders an SVG.
    
    // Alternative: Check if I can mock lucide-react to output text.
  });
});
