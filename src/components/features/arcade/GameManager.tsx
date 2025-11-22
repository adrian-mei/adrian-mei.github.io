'use client';

import React, { useState, useEffect, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { useKonamiCode } from '../../../hooks/game/useKonamiCode';

// Lazy load the GameEmulator to avoid loading heavy emulator code on initial page load
const GameEmulator = dynamic(() => import('./GameEmulator'), {
  ssr: false,
  loading: () => null, // Or a simple spinner if we wanted
});

const GameManager = () => {
  const [isGameOpen, setIsGameOpen] = useState(false);

  // Listen for the Konami Code
  useKonamiCode(() => {
    console.log("Konami Code Activated! Launching Game...");
    setIsGameOpen(true);
  });

  // Listen for custom event 'launch-arcade' (from Footer trigger)
  useEffect(() => {
    const handleLaunch = () => setIsGameOpen(true);
    window.addEventListener('launch-arcade', handleLaunch);
    return () => window.removeEventListener('launch-arcade', handleLaunch);
  }, []);

  if (!isGameOpen) return null;

  return (
    <Suspense fallback={null}>
      <GameEmulator 
        romPath="/arcade/kof95.gb" 
        onClose={() => setIsGameOpen(false)} 
      />
    </Suspense>
  );
};

export default GameManager;
