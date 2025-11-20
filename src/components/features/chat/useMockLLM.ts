import { useState, useCallback, useEffect } from 'react';
import { findBestMatch, FALLBACK_RESPONSE } from './chatLogic';

const STORAGE_KEYS = {
  MESSAGES: 'adrian_ai_messages',
  SUGGESTIONS: 'adrian_ai_suggestions',
  CONTACT_FLOW: 'adrian_ai_contact_flow'
};

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  isStreaming?: boolean;
}

interface ContactFlowState {
  isActive: boolean;
  step: 'name' | 'email' | 'message';
  data: {
    name: string;
    email: string;
    message: string;
  };
}

// --- THE HOOK ---
export const useMockLLM = () => {
  // Initialize state from localStorage if available
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.MESSAGES);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Ensure no messages are stuck in streaming state
        return parsed.map((msg: Message) => ({ ...msg, isStreaming: false }));
      } catch (e) {
        console.error('Failed to parse saved messages:', e);
      }
    }
    return [{
      id: 'init',
      role: 'assistant',
      content: "Hi! I'm **AdrianAI**. I've been trained on Adrian's professional background, philosophy, and interests. Ask me about his startup mindset, his tech stack, or what drives him!",
    }];
  });

  const [isTyping, setIsTyping] = useState(false);
  
  const [currentSuggestions, setCurrentSuggestions] = useState<string[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SUGGESTIONS);
    return saved ? JSON.parse(saved) : FALLBACK_RESPONSE.suggestions;
  });
  
  // Conversational Form State
  const [contactFlow, setContactFlow] = useState<ContactFlowState>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CONTACT_FLOW);
    return saved ? JSON.parse(saved) : {
      isActive: false,
      step: 'name',
      data: { name: '', email: '', message: '' }
    };
  });

  // Persist state changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SUGGESTIONS, JSON.stringify(currentSuggestions));
  }, [currentSuggestions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CONTACT_FLOW, JSON.stringify(contactFlow));
  }, [contactFlow]);

  const streamResponse = useCallback((responseText: string) => {
    setIsTyping(true);
    const messageId = Date.now().toString();
    
    // Add empty message placeholder
    setMessages(prev => [...prev, {
      id: messageId,
      role: 'assistant',
      content: '',
      isStreaming: true
    }]);

    let currentIndex = 0;
    // Faster typing for longer text chunks
    const streamInterval = setInterval(() => {
      if (currentIndex < responseText.length) {
        setMessages(prev => prev.map(msg => {
          if (msg.id === messageId) {
            return {
              ...msg,
              content: responseText.slice(0, currentIndex + 1)
            };
          }
          return msg;
        }));
        currentIndex++;
      } else {
        clearInterval(streamInterval);
        setIsTyping(false);
        setMessages(prev => prev.map(msg => {
          if (msg.id === messageId) {
            return { ...msg, isStreaming: false };
          }
          return msg;
        }));
      }
    }, 15); // 15ms per char for snappier feel
  }, []);

  const sendMessage = useCallback((content: string) => {
    // Add user message
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      role: 'user',
      content
    }]);

    // Simulate network delay then generate response
    setTimeout(() => {
      // 1. Check if we are in a Conversational Flow
      if (contactFlow.isActive) {
        if (content.toLowerCase() === 'cancel') {
          setContactFlow(prev => ({ ...prev, isActive: false }));
          streamResponse("No problem. I've cancelled the message. What else would you like to know?");
          setCurrentSuggestions(FALLBACK_RESPONSE.suggestions);
          return;
        }

        // Handle Form Steps
        if (contactFlow.step === 'name') {
          setContactFlow(prev => ({ 
            ...prev, 
            step: 'email', 
            data: { ...prev.data, name: content } 
          }));
          streamResponse(`Nice to meet you, **${content}**. What is the best **email address** to reach you?`);
          setCurrentSuggestions(["Cancel"]);
        
        } else if (contactFlow.step === 'email') {
           setContactFlow(prev => ({ 
            ...prev, 
            step: 'message', 
            data: { ...prev.data, email: content } 
          }));
          streamResponse("Got it. Please type your **message** for Adrian below:");
          setCurrentSuggestions(["Cancel"]);

        } else if (contactFlow.step === 'message') {
          // Final Step
          const finalData = { ...contactFlow.data, message: content };
          console.log("Form Submitted:", finalData); // Mock submission
          
          setContactFlow({ 
            isActive: false, 
            step: 'name', 
            data: { name: '', email: '', message: '' } 
          });
          
          streamResponse(`Thanks **${finalData.name}**! I've sent your message to Adrian. He'll get back to you at **${finalData.email}** shortly.`);
          setCurrentSuggestions(["View Projects", "Philosophy", "Tech Stack"]);
        }
        return;
      }

      // 2. Normal Logic (Brain)
      const match = findBestMatch(content);
      
      // Check if this topic triggers a flow
      if (match?.action === 'contact_form') {
        setContactFlow({ 
          isActive: true, 
          step: 'name', 
          data: { name: '', email: '', message: '' } 
        });
        streamResponse(match.text);
        setCurrentSuggestions(match.suggestions);
        return;
      }

      // Standard Response
      const responseText = match ? match.text : FALLBACK_RESPONSE.text;
      const nextSuggestions = match ? match.suggestions : FALLBACK_RESPONSE.suggestions;
      
      streamResponse(responseText);
      setCurrentSuggestions(nextSuggestions);

    }, 800); // 800ms "thinking" time

  }, [streamResponse, contactFlow]); // Dependency on contactFlow is crucial

  return {
    messages,
    isTyping,
    sendMessage,
    currentSuggestions
  };
};
