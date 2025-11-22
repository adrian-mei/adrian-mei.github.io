import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
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

// Mock Lucide icons
jest.mock('lucide-react', () => ({
  Menu: () => <div data-testid="menu-icon">Menu</div>,
  X: () => <div data-testid="close-icon">Close</div>,
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
    
    const menuIcon = screen.getByTestId('menu-icon');
    const toggleBtn = menuIcon.closest('button');
    
    if (!toggleBtn) throw new Error('Mobile toggle button not found');
    
    fireEvent.click(toggleBtn);
    
    expect(logger.action).toHaveBeenCalledWith('toggle_mobile_menu', { open: true });
    expect(screen.getByTestId('close-icon')).toBeInTheDocument();
    
    // Close it
    fireEvent.click(toggleBtn);
    expect(logger.action).toHaveBeenCalledWith('toggle_mobile_menu', { open: false });
  });

  it('logs navigation on mobile menu click', () => {
    render(<Navigation {...defaultProps} />);
    
    // Open menu
    const menuIcon = screen.getByTestId('menu-icon');
    const toggleBtn = menuIcon.closest('button')!;
    fireEvent.click(toggleBtn);
    
    // Find mobile nav items (they are rendered when menu is open)
    // Note: Desktop and Mobile items have same text. Use getAllByText.
    // Desktop ones are hidden in CSS but present in DOM.
    // However, mobile menu is conditionally rendered `isMobileMenuOpen && (...)`.
    // So we can look for the one that just appeared.
    
    // The mobile menu container has `absolute top-full ...`
    // Let's find the 'about' link that is inside the mobile menu.
    // Since there are two 'about' buttons now, we can grab the second one or filter by parent class.
    const aboutBtns = screen.getAllByText('about');
    const mobileAboutBtn = aboutBtns[aboutBtns.length - 1]; // Usually the last one rendered
    
    fireEvent.click(mobileAboutBtn);
    
    expect(logger.navigation).toHaveBeenCalledWith('about');
    // Should close menu
    expect(screen.queryByTestId('close-icon')).not.toBeInTheDocument();
  });
});
