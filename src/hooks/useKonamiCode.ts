import { useEffect, useState } from 'react';

const KONAMI_CODE = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a',
];

export const useKonamiCode = (onTrigger: () => void) => {
  const [input, setInput] = useState<string[]>([]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Reset if the key is not part of the sequence at the expected position
      // Actually, a simpler way is to append and check suffix.
      
      setInput((prev) => {
        const newInput = [...prev, e.key];
        
        // Keep only the last N keys, where N is the code length
        if (newInput.length > KONAMI_CODE.length) {
          newInput.shift();
        }
        
        // Check if it matches
        if (newInput.join('') === KONAMI_CODE.join('')) {
          onTrigger();
          return []; // Reset after trigger
        }
        
        return newInput;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onTrigger]);
};
