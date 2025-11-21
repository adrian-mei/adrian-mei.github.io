'use client';

import { useEffect, useRef, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { logger } from '@/src/services/logger';

function LoggingLogic() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastPathRef = useRef(pathname);

  // 1. Navigation Tracking
  useEffect(() => {
    // Construct full path including query params for logging
    const fullPath = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
    
    if (fullPath !== lastPathRef.current) {
      logger.navigation(fullPath, 'push');
      lastPathRef.current = fullPath;
    }
  }, [pathname, searchParams]);

  // 2. Global Click Tracking
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      // Find the closest interactive element
      const target = e.target as HTMLElement;
      const interactiveElement = target.closest('button, a, [role="button"], input, select, textarea');

      if (interactiveElement) {
        const el = interactiveElement as HTMLElement;
        
        // Prioritize readable names
        const label = el.getAttribute('aria-label') || 
                      el.getAttribute('name') || 
                      el.innerText?.slice(0, 50) || 
                      el.id || 
                      'unknown_element';
        
        const type = el.tagName.toLowerCase();

        logger.action('click', {
          element: type,
          label: label.replace(/\s+/g, ' ').trim(), // Clean up whitespace
          id: el.id,
          path: pathname,
        });
      }
    };

    window.addEventListener('click', handleClick, { capture: true });

    return () => {
      window.removeEventListener('click', handleClick, { capture: true });
    };
  }, [pathname]);

  return null;
}

export function LoggingProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Suspense fallback={null}>
        <LoggingLogic />
      </Suspense>
      {children}
    </>
  );
}
