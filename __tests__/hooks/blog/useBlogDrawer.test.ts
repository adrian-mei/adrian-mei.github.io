import { renderHook, act } from '@testing-library/react';
import { useBlogDrawer } from '@/src/hooks/blog/useBlogDrawer';
import { logger } from '@/src/services/logger';

// Mock logger
jest.mock('@/src/services/logger', () => ({
  logger: {
    action: jest.fn(),
    info: jest.fn(),
  },
}));

// Mock SpeechSynthesis
const mockSpeechSynthesis = {
  cancel: jest.fn(),
  speak: jest.fn(),
};

const mockUtterance = jest.fn();

beforeAll(() => {
  global.window.speechSynthesis = mockSpeechSynthesis as any;
  global.SpeechSynthesisUtterance = mockUtterance as any;
});

describe('useBlogDrawer', () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('logs open_blog_post when post is selected', () => {
    const { result } = renderHook(() => useBlogDrawer(defaultProps));
    const mockPost = { 
      id: '1', 
      title: 'Test Post', 
      content: 'Content', 
      excerpt: 'Excerpt', 
      date: '2023', 
      readTime: '5min', 
      tags: [] 
    };

    act(() => {
      result.current.setSelectedPost(mockPost);
    });

    expect(logger.action).toHaveBeenCalledWith('open_blog_post', { title: 'Test Post', id: '1' });
  });

  it('handles TTS logging', () => {
    const { result } = renderHook(() => useBlogDrawer(defaultProps));
    const mockPost = { 
      id: '1', 
      title: 'Test Post', 
      content: 'Content', 
      excerpt: 'Excerpt', 
      date: '2023', 
      readTime: '5min', 
      tags: [] 
    };

    act(() => {
      result.current.setSelectedPost(mockPost);
    });

    // Start TTS
    act(() => {
      result.current.toggleSpeech();
    });
    
    expect(mockSpeechSynthesis.speak).toHaveBeenCalled();
    expect(logger.info).toHaveBeenCalledWith('tts_started', { title: 'Test Post' });

    // Stop TTS
    act(() => {
      result.current.toggleSpeech();
    });

    expect(mockSpeechSynthesis.cancel).toHaveBeenCalled();
    expect(logger.info).toHaveBeenCalledWith('tts_stopped', { title: 'Test Post' });
  });

  it('logs close_blog_drawer on close', () => {
    const { result } = renderHook(() => useBlogDrawer(defaultProps));

    act(() => {
      result.current.handleClose();
    });

    expect(logger.action).toHaveBeenCalledWith('close_blog_drawer');
    
    // Check if onClose is called after delay
    // Using jest fake timers for this
  });

  it('calls onClose after delay', () => {
    jest.useFakeTimers();
    const { result } = renderHook(() => useBlogDrawer(defaultProps));

    act(() => {
      result.current.handleClose();
    });

    expect(result.current.isClosing).toBe(true);
    expect(defaultProps.onClose).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(result.current.isClosing).toBe(false);
    expect(defaultProps.onClose).toHaveBeenCalled();
    
    jest.useRealTimers();
  });
});
