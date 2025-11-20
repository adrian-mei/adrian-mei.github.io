import React, { useState, useEffect, useRef } from 'react';
import { useAudioEngine } from './useAudioEngine';
import { Play, Pause, Volume2, Sparkles, Moon, Sun, Wind, Waves, Mountain, Cloud } from 'lucide-react';

const SCENES = [
  {
    id: 'field',
    label: 'Grassy Field',
    description: 'Openness, gentle movement, natural peace.',
    icon: Wind,
    color: 'text-emerald-400',
    bg: 'bg-emerald-400/10 border-emerald-400/20',
    params: {
      noiseType: 1 as const, // Pink
      noiseFilterFreq: 600,
      entrainmentFreq: 6, 
      toneVolume: 0.5,
      noiseVolume: 0.25,
      droneVolume: 0.15,
      feedbackDelay: 0.2
    }
  },
  {
    id: 'ocean',
    label: 'Ocean Ave',
    description: 'Modulated waves, rhythmic horizon.',
    icon: Waves,
    color: 'text-cyan-400',
    bg: 'bg-cyan-400/10 border-cyan-400/20',
    params: {
      noiseType: 0 as const, // Brown
      noiseFilterFreq: 300, // Sweeps 100-600 via LFO
      entrainmentFreq: 5, 
      toneVolume: 0.2, // Distant
      noiseVolume: 0.4, // Primary texture
      droneVolume: 0.25,
      feedbackDelay: 0.3
    }
  },
  {
    id: 'yosemite',
    label: 'Summer Hike',
    description: 'Echoing mountains, open wind.',
    icon: Mountain,
    color: 'text-amber-400',
    bg: 'bg-amber-400/10 border-amber-400/20',
    params: {
      noiseType: 1 as const, // Pink
      noiseFilterFreq: 1200, // Open air
      entrainmentFreq: 12, // Alpha
      toneVolume: 0.5, 
      noiseVolume: 0.3,
      droneVolume: 0.1,
      feedbackDelay: 0.5 // High echo
    }
  },
  {
    id: 'winter',
    label: 'Deep Sleep',
    description: 'Binaural theta waves, warm immersion.',
    icon: Moon,
    color: 'text-indigo-300',
    bg: 'bg-indigo-400/10 border-indigo-400/20',
    params: {
      noiseType: 0 as const, // Brown
      noiseFilterFreq: 150, // Muffled
      entrainmentFreq: 4, // Theta (Sleep)
      toneVolume: 0.1, 
      noiseVolume: 0.5,
      droneVolume: 0.4,
      droneFreq: 100,
      feedbackDelay: 0.1 // Tight/Warm
    }
  }
];

export const AudioGenerator: React.FC = () => {
  const { isPlaying, togglePlay, updateParams, params } = useAudioEngine();
  const [isOpen, setIsOpen] = useState(false);
  const [activeSceneId, setActiveSceneId] = useState<string>('field');
  const [vol, setVol] = useState(0.1); // Match default in hook (Lowered)
  const containerRef = useRef<HTMLDivElement>(null);

  // Initial Setup
  useEffect(() => {
      // Apply the default scene (Field) on mount/init
      const defaultScene = SCENES[0];
      updateParams({
          ...defaultScene.params,
          volume: vol,
          toneFreq: 432,
          droneFreq: 111
      });
  }, [updateParams]); // Only runs once essentially, or when engine rebinds

  // Click Outside Handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSceneSelect = (scene: typeof SCENES[0]) => {
      setActiveSceneId(scene.id);
      updateParams(scene.params);
  };

  const handleVolChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVol(val);
    updateParams({ volume: val });
  };

  const activeScene = SCENES.find(s => s.id === activeSceneId) || SCENES[0];

  return (
    <div className="relative z-50 font-sans" ref={containerRef}>
      {/* Toggle Button - Header Style */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`p-2 rounded-full transition-all duration-300 flex items-center gap-2 ${
          isPlaying 
            ? 'bg-indigo-500/10 text-indigo-400 ring-1 ring-indigo-500/50' 
            : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800'
        }`}
        title="Neuro-Audio Lab"
      >
        <Sparkles className={`w-5 h-5 ${isPlaying ? 'animate-pulse' : ''}`} />
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-4 w-72 sm:w-80 bg-zinc-900/95 backdrop-blur-xl border border-zinc-700/50 rounded-2xl shadow-2xl p-6 text-white transform transition-all animate-in fade-in slide-in-from-top-2 origin-top-right">
          
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
                <h3 className="text-lg font-bold bg-gradient-to-r from-indigo-200 to-purple-200 bg-clip-text text-transparent">
                Neuro-Audio Lab
                </h3>
                <div className="flex gap-2 mt-1">
                     <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] text-zinc-400 font-mono">
                        FM Synth
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] text-zinc-400 font-mono">
                        Binaural
                    </span>
                </div>
            </div>
            <button 
                onClick={() => setIsOpen(false)}
                className="text-zinc-500 hover:text-white transition-colors"
            >
                <span className="sr-only">Close</span>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
          </div>
          
          {/* Play/Visualizer */}
          <div className="flex justify-center mb-8 relative group">
            {/* Ambient Glow */}
            <div className={`absolute inset-0 rounded-full blur-xl transition-all duration-1000 ${
                isPlaying ? 'opacity-40 bg-indigo-500/30 scale-150' : 'opacity-0 scale-100'
            }`} />
            
            {/* Minimalist Ripple */}
            {isPlaying && (
               <div 
                 className="absolute inset-0 rounded-full border border-white/10 opacity-20"
                 style={{
                    animation: `ping ${4/activeScene.params.entrainmentFreq}s cubic-bezier(0, 0, 0.2, 1) infinite`
                 }}
               />
            )}
            
            <button
              onClick={togglePlay}
              className={`relative w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500 ${
                isPlaying 
                  ? 'bg-zinc-800 ring-1 ring-white/10 shadow-2xl shadow-indigo-500/10 scale-105' 
                  : 'bg-zinc-800 hover:bg-zinc-750 ring-1 ring-white/5 hover:ring-white/10'
              }`}
            >
              {isPlaying ? (
                  <Pause className={`w-6 h-6 ${activeScene.color}`} />
              ) : (
                  <Play className="w-6 h-6 ml-1 text-zinc-400" />
              )}
            </button>
          </div>

          {/* Current Description */}
          <div className="text-center mb-8 min-h-[3rem]">
            <h4 className={`text-sm font-medium mb-1 ${activeScene.color}`}>
                {activeScene.label}
            </h4>
            <p className="text-xs text-zinc-400 leading-relaxed italic">
                "{activeScene.description}"
            </p>
          </div>

          {/* Scene Grid */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {SCENES.map((scene) => {
                const isActive = activeSceneId === scene.id;
                return (
                    <button
                        key={scene.id}
                        onClick={() => handleSceneSelect(scene)}
                        className={`p-3 rounded-xl transition-all duration-300 flex flex-col items-center gap-2 text-center border ${
                            isActive 
                                ? `${scene.bg} ${scene.color.replace('text-', 'border-')} ring-1 ring-inset ${scene.color.replace('text-', 'ring-')}` 
                                : 'bg-zinc-800/50 border-transparent hover:bg-zinc-800 hover:border-zinc-700 text-zinc-400'
                        }`}
                    >
                        <scene.icon className={`w-5 h-5 ${isActive ? scene.color : 'text-zinc-500'}`} />
                        <span className="text-[10px] font-medium uppercase tracking-wide">
                            {scene.label}
                        </span>
                    </button>
                );
            })}
          </div>
            
          {/* Master Volume */}
           <div className="pt-4 border-t border-zinc-800/50">
            <div className="flex items-center gap-3">
              <Volume2 className="w-4 h-4 text-zinc-500" />
              <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={vol}
                  onChange={handleVolChange}
                  className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-zinc-400 hover:accent-white transition-all"
              />
            </div>
          </div>

        </div>
      )}
    </div>
  );
};
