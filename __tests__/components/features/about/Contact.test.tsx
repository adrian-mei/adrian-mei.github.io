import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Contact from '@/src/components/features/about/Contact';
import { logger } from '@/src/services/logger';

// Mock logger
jest.mock('@/src/services/logger', () => ({
  logger: {
    action: jest.fn(),
  },
}));

// Mock lucide-react
jest.mock('lucide-react', () => ({
  Mail: () => <span>Mail</span>,
  Github: () => <span>Github</span>,
  Linkedin: () => <span>Linkedin</span>,
  Send: () => <span>Send</span>,
  CheckCircle: () => <span>Check</span>,
}));

describe('Contact', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders contact form', () => {
    render(<Contact />);
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Message')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send message/i })).toBeInTheDocument();
  });

  it('logs submission and shows success state', async () => {
    render(<Contact />);
    
    // Fill form
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Message'), { target: { value: 'Hello world' } });
    
    // Submit
    fireEvent.click(screen.getByRole('button', { name: /send message/i }));
    
    expect(logger.action).toHaveBeenCalledWith('contact_form_submit');
    
    // Check loading state
    expect(screen.getByText('Sending...')).toBeInTheDocument();
    
    // Fast-forward timers to simulate network request completion
    jest.advanceTimersByTime(1500);
    
    // Wait for success message
    await waitFor(() => {
      expect(screen.getByText('Message Sent!')).toBeInTheDocument();
    });
    
    // Check form cleared
    // (Form is unmounted, success message is shown, so can't check inputs)
  });

  it('logs social link clicks', () => {
    render(<Contact />);
    
    // Use more specific queries to find links
    const emailLink = screen.getByRole('link', { name: /email/i });
    fireEvent.click(emailLink);
    expect(logger.action).toHaveBeenCalledWith('click_social', { platform: 'email' });

    const githubLink = screen.getByRole('link', { name: /github/i });
    fireEvent.click(githubLink);
    expect(logger.action).toHaveBeenCalledWith('click_social', { platform: 'github' });

    const linkedinLink = screen.getByRole('link', { name: /linkedin/i });
    fireEvent.click(linkedinLink);
    expect(logger.action).toHaveBeenCalledWith('click_social', { platform: 'linkedin' });
  });
});
