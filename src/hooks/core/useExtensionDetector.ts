import { useState, useEffect } from 'react';

interface DetectionResult {
  isDetected: boolean;
  extensionName: string | null;
}

export const useExtensionDetector = (): DetectionResult => {
  const [detectionState, setDetectionState] = useState<DetectionResult>({
    isDetected: false,
    extensionName: null,
  });

  useEffect(() => {
    const handleReversal = (name: string) => {
      console.log(`[ExtensionDetector] Reversing changes from: ${name}`);
      const html = document.documentElement;
      const body = document.body;
      const head = document.head;

      // Common resets
      html.style.filter = 'none';
      html.style.mixBlendMode = 'normal';
      body.style.filter = 'none';
      body.style.mixBlendMode = 'normal';

      if (name === 'Dark Reader') {
        // Remove attributes
        html.removeAttribute('data-darkreader-mode');
        html.removeAttribute('data-darkreader-scheme');

        // Remove meta tag
        const meta = document.querySelector('meta[name="darkreader"]');
        if (meta) meta.remove();

        // Remove injected styles
        const styles = document.querySelectorAll('style.darkreader, style#darkreader-style');
        styles.forEach(style => style.remove());
      } 
      else if (name === 'Midnight Lizard') {
        html.removeAttribute('data-ml-theme');
        html.removeAttribute('ml-mode');
        
        // Midnight Lizard often injects styles with specific IDs or classes
        // Inspecting specific IDs might be needed, but resetting filter helps significantly
      }
      else if (name === 'Night Eye') {
        html.removeAttribute('nighteye');
        // Remove Night Eye specific styles if identifiable
        const styles = document.querySelectorAll('style#night-eye-style');
        styles.forEach(style => style.remove());
      }
    };

    const checkExtensions = () => {
      const html = document.documentElement;
      
      // 1. Dark Reader Detection
      if (
        html.hasAttribute('data-darkreader-mode') || 
        document.querySelector('meta[name="darkreader"]') ||
        document.querySelector('style.darkreader')
      ) {
        handleReversal('Dark Reader');
        setDetectionState({ isDetected: true, extensionName: 'Dark Reader' });
        return;
      }

      // 2. Midnight Lizard Detection
      // Midnight Lizard often adds 'ml-mode' or 'data-ml-theme'
      if (html.hasAttribute('ml-mode') || html.hasAttribute('data-ml-theme')) {
        handleReversal('Midnight Lizard');
        setDetectionState({ isDetected: true, extensionName: 'Midnight Lizard' });
        return;
      }

      // 3. Night Eye Detection
      if (html.hasAttribute('nighteye')) {
        handleReversal('Night Eye');
        setDetectionState({ isDetected: true, extensionName: 'Night Eye' });
        return;
      }
    };

    // Initial check
    checkExtensions();

    // Observe DOM changes to catch extensions loading late or toggling
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'attributes' || mutation.type === 'childList') {
          checkExtensions();
        }
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
      childList: true,
      subtree: false, // Observing root heavily is expensive, keep it shallow for attributes
      attributeFilter: ['data-darkreader-mode', 'ml-mode', 'nighteye', 'style', 'class']
    });
    
    // Also observe head for style injections
    observer.observe(document.head, {
      childList: true,
      subtree: false
    });

    return () => observer.disconnect();
  }, []);

  return detectionState;
};

export default useExtensionDetector;
