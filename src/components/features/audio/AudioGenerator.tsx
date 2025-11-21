import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Play, Pause, Volume2, Music } from 'lucide-react';

export const AudioGenerator: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [volume, setVolume] = useState(0.1); // Default low volume
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hasAutoStarted = useRef(false);

  // Initialize Audio
  useEffect(() => {
    const audio = new Audio('/mp3/sleep.mp3');
    audio.loop = true;
    audio.volume = volume;
    audioRef.current = audio;

    // Sync state with audio events
    audio.onplay = () => setIsPlaying(true);
    audio.onpause = () => setIsPlaying(false);

    const startFadeIn = () => {
       if (!audioRef.current) return;
       audioRef.current.volume = 0;
       let vol = 0;
       const fadeInterval = setInterval(() => {
         if (!audioRef.current) {
             clearInterval(fadeInterval);
             return;
         }
         vol += 0.005;
         if (vol >= volume) {
           vol = volume;
           clearInterval(fadeInterval);
         }
         audioRef.current.volume = vol;
       }, 100);
    };

    const attemptPlay = () => {
        if (hasAutoStarted.current || !audioRef.current) return;
        
        // Only attempt play if user has interacted
        audioRef.current.play()
            .then(() => {
                hasAutoStarted.current = true;
                setIsPlaying(true);
                startFadeIn();
            })
            .catch(error => {
                // Should not happen if triggered by interaction, but safe to log
                console.log("Playback failed:", error);
            });
    };

    // Wait for interaction to play
    document.addEventListener('click', attemptPlay, { once: true });
    document.addEventListener('keydown', attemptPlay, { once: true });
    document.addEventListener('touchstart', attemptPlay, { once: true });

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      document.removeEventListener('click', attemptPlay);
      document.removeEventListener('keydown', attemptPlay);
      document.removeEventListener('touchstart', attemptPlay);
    };
  }, []); // Only run once

  // Handle Volume Change
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    if (audioRef.current) {
      audioRef.current.volume = newVol;
    }
  };

  // Handle Play/Pause Toggle
  const togglePlay = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
  };

  // Click Outside to Close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative z-50 font-sans" ref={containerRef}>
      {/* Toggle Button */}
      <button 
        id="audio-toggle-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Sonic Atmosphere"
        className={`p-2 rounded-full transition-all duration-300 flex items-center gap-2 ${
          isPlaying 
            ? 'bg-indigo-500/10 text-indigo-400 ring-1 ring-indigo-500/50' 
            : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800'
        }`}
        title="Sonic Atmosphere"
      >
        <Sparkles className={`w-5 h-5 ${isPlaying ? 'animate-pulse' : ''}`} />
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="fixed top-20 right-4 left-4 md:absolute md:top-full md:right-0 md:left-auto md:mt-4 md:w-72 bg-zinc-900/95 backdrop-blur-xl border border-zinc-700/50 rounded-2xl shadow-2xl p-6 text-white transform transition-all animate-in fade-in slide-in-from-top-2 origin-top-right">
          
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold bg-gradient-to-r from-indigo-200 to-purple-200 bg-clip-text text-transparent flex items-center gap-2">
              <Music className="w-4 h-4 text-indigo-300" />
              Sonic Atmosphere
            </h3>
            <button 
                id="audio-panel-close-btn"
                onClick={() => setIsOpen(false)}
                className="text-zinc-500 hover:text-white transition-colors"
            >
                <span className="sr-only">Close</span>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
          </div>
          
          {/* Play Control */}
          <div className="flex flex-col items-center mb-6">
            <div className={`relative w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-all duration-500 ${
                isPlaying 
                  ? 'bg-zinc-800 ring-1 ring-indigo-500/50 shadow-lg shadow-indigo-500/20' 
                  : 'bg-zinc-800 ring-1 ring-white/5'
              }`}>
                {/* Pulse Ring */}
                {isPlaying && (
                    <div className="absolute inset-0 rounded-full border border-indigo-500/30 animate-ping opacity-20" />
                )}
                
                <button
                    id="audio-play-pause-btn"
                    onClick={togglePlay}
                    aria-label={isPlaying ? "Pause Audio" : "Play Audio"}
                    className="relative z-10 w-full h-full flex items-center justify-center rounded-full hover:bg-zinc-700 transition-colors"
                >
                    {isPlaying ? (
                        <Pause className="w-6 h-6 text-indigo-400" />
                    ) : (
                        <Play className="w-6 h-6 ml-1 text-zinc-400" />
                    )}
                </button>
            </div>

            <div className="text-center">
                <h4 className="text-sm font-medium text-indigo-200">Deep Sleep</h4>
                <p className="text-xs text-zinc-500 mt-1">Ambient Soundscape</p>
            </div>
          </div>
            
          {/* Volume Control */}
           <div className="pt-4 border-t border-zinc-800/50">
            <div className="flex items-center gap-3">
              <Volume2 className="w-4 h-4 text-zinc-500" />
              <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-zinc-400 hover:accent-white transition-all"
              />
            </div>
          </div>

        </div>
      )}
    </div>
  );
};
