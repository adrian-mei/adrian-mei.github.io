import { useState, useEffect, useRef } from 'react';
import { BlogPost } from '@/src/data/blog';
import { logger } from '@/src/services/logger';

interface UseBlogDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  closeDelay?: number;
}

export const useBlogDrawer = ({ isOpen, onClose, closeDelay = 300 }: UseBlogDrawerProps) => {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [processedContent, setProcessedContent] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const contentRef = useRef<HTMLDivElement>(null);

  // Process content & Handle Speech Cleanup
  useEffect(() => {
    // Stop any active speech when post changes or clears
    window.speechSynthesis.cancel();
    setIsSpeaking(false);

    if (selectedPost) {
      setProcessedContent(selectedPost.content);
      logger.action('open_blog_post', { title: selectedPost.title, id: selectedPost.id });
    }
  }, [selectedPost]);

  // Handle Page Lifecycle (Refresh/Close)
  useEffect(() => {
    const cleanup = () => {
      window.speechSynthesis.cancel();
    };

    // Handle refresh/navigation
    window.addEventListener('beforeunload', cleanup);

    // Handle component unmount
    return () => {
      cleanup();
      window.removeEventListener('beforeunload', cleanup);
    };
  }, []);

  // Handle TTS
  const toggleSpeech = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      logger.info('tts_stopped', { title: selectedPost?.title });
    } else if (selectedPost) {
      // Strip HTML for speech
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = selectedPost.content;
      const text = tempDiv.textContent || '';
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onend = () => setIsSpeaking(false);
      utterance.rate = 0.9; // Slightly slower for reading
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
      logger.info('tts_started', { title: selectedPost.title });
    }
  };

  // Handle scroll progress
  const handleScroll = () => {
    if (!contentRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
    const progress = (scrollTop / (scrollHeight - clientHeight)) * 100;
    setScrollProgress(Math.min(100, Math.max(0, progress)));
  };

  // Reset progress when post changes
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
      setScrollProgress(0);
    }
  }, [selectedPost]);

  // Handle closing animation
  const handleClose = () => {
    setIsClosing(true);
    logger.action('close_blog_drawer');
    setTimeout(() => {
      setIsClosing(false);
      setSelectedPost(null); // Reset on close
      onClose();
    }, closeDelay);
  };

  // Reset state when drawer opens
  useEffect(() => {
    if (isOpen) {
      setIsClosing(false);
    }
  }, [isOpen]);

  return {
    selectedPost,
    setSelectedPost,
    isClosing,
    scrollProgress,
    processedContent,
    isSpeaking,
    toggleSpeech,
    contentRef,
    handleScroll,
    handleClose
  };
};
