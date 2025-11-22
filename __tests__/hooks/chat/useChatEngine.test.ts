import { renderHook, act, waitFor } from '@testing-library/react';
import { useChatEngine } from '@/src/hooks/chat/useChatEngine';
import { getHardcodedResponse } from '@/src/data/chat-scripts';
import { streamChatCompletion } from '@/src/services/chat-service';

// Mock dependencies
jest.mock('@/src/data/chat-scripts', () => ({
  getHardcodedResponse: jest.fn(),
}));

jest.mock('@/src/services/chat-service', () => ({
  streamChatCompletion: jest.fn(),
}));

jest.mock('@/src/services/logger', () => ({
  logger: {
    chat: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  },
}));

describe('useChatEngine', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('initializes with a welcome message if no history exists', () => {
    const { result } = renderHook(() => useChatEngine());

    expect(result.current.messages).toHaveLength(1);
    expect(result.current.messages[0].role).toBe('assistant');
    expect(result.current.messages[0].id).toBe('welcome');
  });

  it('restores messages from localStorage', () => {
    const savedMessages = [
      { id: '1', role: 'user', content: 'Hello' },
      { id: '2', role: 'assistant', content: 'Hi there' },
    ];
    localStorage.setItem('chat_storage_history', JSON.stringify(savedMessages));

    const { result } = renderHook(() => useChatEngine());

    expect(result.current.messages).toEqual(savedMessages);
  });

  it('sends a message and handles API stream', async () => {
    const { result } = renderHook(() => useChatEngine());

    // Mock streamChatCompletion to simulate streaming
    (streamChatCompletion as jest.Mock).mockImplementation(async (history, onChunk) => {
      onChunk('Hello');
      onChunk(' World');
      return 'Hello World';
    });

    await act(async () => {
      await result.current.sendMessage('Hi');
    });

    // Messages should include: Welcome, User Message, Assistant Response
    expect(result.current.messages).toHaveLength(3);
    expect(result.current.messages[1].content).toBe('Hi');
    expect(result.current.messages[2].role).toBe('assistant');
    expect(result.current.messages[2].content).toBe('Hello World');
  });

  it('intercepts with hardcoded response if available', async () => {
    const { result } = renderHook(() => useChatEngine());
    
    (getHardcodedResponse as jest.Mock).mockReturnValue('I am a mock');

    await act(async () => {
      await result.current.sendMessage('Who are you?');
    });

    // Wait for the setTimeout in the hook (600ms)
    await waitFor(() => {
      expect(result.current.messages).toHaveLength(3); // Welcome, User, Hardcoded
    }, { timeout: 1000 });

    expect(result.current.messages[2].content).toBe('I am a mock');
    expect(streamChatCompletion).not.toHaveBeenCalled();
  });

  it('prevents sending wall of text', async () => {
    const { result } = renderHook(() => useChatEngine());
    const longMessage = 'a'.repeat(501);

    await act(async () => {
      await result.current.sendMessage(longMessage);
    });

    // Should have: Welcome, User Message (long), Warning
    expect(result.current.messages).toHaveLength(3);
    expect(result.current.messages[2].content).toContain('too long');
    expect(streamChatCompletion).not.toHaveBeenCalled();
  });
});
