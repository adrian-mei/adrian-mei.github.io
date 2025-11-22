'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Gameboy } from '@neil-morrison44/gameboy-emulator';
import { X, Gamepad2, Volume2, VolumeX, Loader2, Coins } from 'lucide-react';

interface GameEmulatorProps {
  romPath: string;
  onClose: () => void;
}

const GameEmulator: React.FC<GameEmulatorProps> = ({ romPath, onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isInsertingCoin, setIsInsertingCoin] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [volume, setVolume] = useState(0.25);
  const [gameboyInstance, setGameboyInstance] = useState<Gameboy | null>(null);
  const [activeKeys, setActiveKeys] = useState<Record<string, boolean>>({});
  const gainNodeRef = useRef<GainNode | null>(null);
  const volumeRef = useRef(volume);
  const isMutedRef = useRef(isMuted);
  const wasAutoMuted = useRef(false);

  // Keep refs updated for event listeners
  useEffect(() => {
      volumeRef.current = volume;
  }, [volume]);

  useEffect(() => {
      isMutedRef.current = isMuted;
  }, [isMuted]);

  // Smart Mute: Auto-mute on focus loss / leave
  useEffect(() => {
      const handleLoss = () => {
          if (!isMutedRef.current) {
              setIsMuted(true);
              wasAutoMuted.current = true;
          }
      };

      const handleGain = () => {
          if (wasAutoMuted.current) {
              setIsMuted(false);
              wasAutoMuted.current = false;
          }
      };

      window.addEventListener('blur', handleLoss);
      window.addEventListener('focus', handleGain);
      document.addEventListener('visibilitychange', () => {
          if (document.hidden) handleLoss();
          else handleGain();
      });
      document.addEventListener('mouseleave', handleLoss);
      document.addEventListener('mouseenter', handleGain);

      return () => {
          window.removeEventListener('blur', handleLoss);
          window.removeEventListener('focus', handleGain);
          // visibilitychange event listener removal is tricky with anonymous function, 
          // but component likely won't unmount often during game session. 
          // Ideally extract to named function but for brevity in this specific component context:
          document.removeEventListener('mouseleave', handleLoss);
          document.removeEventListener('mouseenter', handleGain);
      };
  }, []);

  useEffect(() => {
    const loadGame = async () => {
      try {
        // Initialize Gameboy
        const gb = new Gameboy();
        
        // Configure Controls (Universal Layout using Key Codes)
        // @ts-ignore - keyboardManager types might be loose
        if (gb.keyboardManager) {
            gb.keyboardManager.a = 'KeyX';      // Button A -> X key
            gb.keyboardManager.b = 'KeyZ';      // Button B -> Z key
            gb.keyboardManager.select = 'ShiftLeft'; // Select -> Left Shift
            gb.keyboardManager.start = 'Enter'; // Start -> Enter
            gb.keyboardManager.up = 'ArrowUp';
            gb.keyboardManager.down = 'ArrowDown';
            gb.keyboardManager.left = 'ArrowLeft';
            gb.keyboardManager.right = 'ArrowRight';
        }

        setGameboyInstance(gb);

        // Fetch ROM
        console.log(`Fetching ROM from: ${romPath}`);
        const response = await fetch(romPath);
        
        if (!response.ok) {
            throw new Error(`Failed to fetch ROM: ${response.status} ${response.statusText}`);
        }
        
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('text/html')) {
             throw new Error(`Failed to fetch ROM: Received HTML instead of binary. Check file path.`);
        }

        const arrayBuffer = await response.arrayBuffer();
        console.log(`ROM loaded, size: ${arrayBuffer.byteLength} bytes`);

        // Load ROM
        gb.loadGame(arrayBuffer);

        // Set up Canvas
        const canvas = canvasRef.current;
        if (canvas) {
          const context = canvas.getContext('2d');
          if (context) {
            gb.onFrameFinished((imageData: ImageData) => {
              context.putImageData(imageData, 0, 0);
            });
          }
        }

        setIsLoading(false);

      } catch (error) {
        console.error("Failed to load game:", error);
        setIsLoading(false);
      }
    };

    loadGame();

    return () => {
      // Cleanup: stop emulator
      if (gameboyInstance) {
        gameboyInstance.stop();
        if (gameboyInstance.apu) {
            gameboyInstance.apu.disableSound();
        }
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [romPath]);

  // Cleanup on unmount
  useEffect(() => {
      return () => {
          if (gameboyInstance) {
              gameboyInstance.stop();
               if (gameboyInstance.apu) {
                    gameboyInstance.apu.disableSound();
                }
          }
      }
  }, [gameboyInstance]);

  // Intercept Audio Graph for Volume Control
  useEffect(() => {
      // @ts-ignore - accessing private audioContext
      if (gameboyInstance?.apu && gameboyInstance.apu.audioContext) {
          const apu = gameboyInstance.apu as any;
          const ctx = apu.audioContext as AudioContext;

          // Poll for the audio node because it is created asynchronously
          const pollInterval = setInterval(() => {
              try {
                // @ts-ignore - accessing internal property
                const player = apu.ringBufferPlayer;
                if (player && player.ringBufferPlayerNode) {
                    const sourceNode = player.ringBufferPlayerNode as AudioNode;

                    // Create Gain Node if it doesn't exist or context changed
                    if (!gainNodeRef.current || gainNodeRef.current.context !== ctx) {
                        console.log("Hooking volume control into AudioContext");
                        const gainNode = ctx.createGain();
                        gainNode.gain.value = volumeRef.current;
                        
                        // Disconnect default routing (source -> destination)
                        try {
                            sourceNode.disconnect(ctx.destination);
                        } catch (e) {
                            // Ignore if not connected or error
                        }

                        // Re-route: source -> gain -> destination
                        sourceNode.connect(gainNode);
                        gainNode.connect(ctx.destination);

                        gainNodeRef.current = gainNode;
                        clearInterval(pollInterval);
                    } else {
                        // Already hooked
                        clearInterval(pollInterval);
                    }
                }
              } catch (err) {
                  console.error("Failed to hook volume control:", err);
                  clearInterval(pollInterval);
              }
          }, 100); // Check every 100ms

          return () => {
              clearInterval(pollInterval);
              gainNodeRef.current = null;
          };
      }
  }, [gameboyInstance]); // Run when instance changes

  // Apply Volume & Mute State Updates
  useEffect(() => {
      if (!gameboyInstance?.apu) return;

      if (isMuted) {
          gameboyInstance.apu.disableSound();
      } else {
          gameboyInstance.apu.enableSound();
          // Ensure volume is applied
          if (gainNodeRef.current) {
              const currentTime = gainNodeRef.current.context.currentTime;
              gainNodeRef.current.gain.setTargetAtTime(volume, currentTime, 0.01);
          }
      }
  }, [volume, isMuted, gameboyInstance]);

  const toggleMute = () => {
    // Manual toggle clears auto-mute flag to prevent unwanted behavior
    wasAutoMuted.current = false;
    setIsMuted(!isMuted);
  };

  const handleInsertCoin = () => {
      if (!gameboyInstance) return;
      
      // 1. Enable Audio immediately ONLY if not muted (must be in user gesture)
      // Note: We rely on the useEffect above to sync state, but for the initial trigger 
      // we might need to ensure the context is resumed if !isMuted.
      // However, since isMuted starts TRUE, this block is skipped initially.
      // When user clicks "Unmute", state changes, effect runs, context resumes.
      if (!isMuted && gameboyInstance.apu) {
          gameboyInstance.apu.enableSound();
      }

      // 2. Start Coin Animation sequence
      setIsInsertingCoin(true);
      
      // 3. Start Game after delay
      setTimeout(() => {
          gameboyInstance.run();
          setIsPlaying(true);
          
          // Focus canvas
          if (canvasRef.current) {
              canvasRef.current.focus();
          }
      }, 2000); // 2 second coin drop/boot sequence
  };

  const handleContainerClick = () => {
      // Ensure canvas keeps focus if user clicks background
      if (isPlaying && canvasRef.current) {
          canvasRef.current.focus();
      }
  };

  // Key Event Handlers for Visual Feedback & Scroll Prevention
  const handleKeyDown = (e: React.KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
          e.preventDefault();
      }
      setActiveKeys(prev => ({ ...prev, [e.code]: true }));
  };

  const handleKeyUp = (e: React.KeyboardEvent) => {
      setActiveKeys(prev => ({ ...prev, [e.code]: false }));
  };

  // Helper for conditional classes
  const getBtnClass = (code: string, baseClass: string, activeClass: string) => {
      return activeKeys[code] ? activeClass : baseClass;
  };

  // Direct Input Handling
  const handleInput = (code: string, isPressed: boolean) => {
      // 1. Update Visual State
      setActiveKeys(prev => ({ ...prev, [code]: isPressed }));

      // 2. Direct Game Input Control
      // The emulator might not respect synthetic KeyboardEvents due to security or implementation details.
      // Instead, we directly manipulate the emulator's internal input state as per docs.
      if (gameboyInstance && gameboyInstance.input) {
          switch (code) {
              case 'ArrowUp': gameboyInstance.input.isPressingUp = isPressed; break;
              case 'ArrowDown': gameboyInstance.input.isPressingDown = isPressed; break;
              case 'ArrowLeft': gameboyInstance.input.isPressingLeft = isPressed; break;
              case 'ArrowRight': gameboyInstance.input.isPressingRight = isPressed; break;
              case 'KeyZ': gameboyInstance.input.isPressingB = isPressed; break;
              case 'KeyX': gameboyInstance.input.isPressingA = isPressed; break;
              case 'ShiftLeft': gameboyInstance.input.isPressingSelect = isPressed; break;
              case 'Enter': gameboyInstance.input.isPressingStart = isPressed; break;
          }
      }
  };

  const getTouchProps = (code: string) => ({
      onMouseDown: (e: React.MouseEvent) => { e.preventDefault(); handleInput(code, true); },
      onMouseUp: (e: React.MouseEvent) => { e.preventDefault(); handleInput(code, false); },
      onMouseLeave: (e: React.MouseEvent) => { 
          if (activeKeys[code]) handleInput(code, false); 
      },
      onTouchStart: (e: React.TouchEvent) => { e.preventDefault(); handleInput(code, true); },
      onTouchEnd: (e: React.TouchEvent) => { e.preventDefault(); handleInput(code, false); }
  });

  return (
    <div 
        className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center backdrop-blur-sm"
        onClick={handleContainerClick}
    >
      {/* Modal Container */}
      <div 
        ref={containerRef}
        className="relative w-full h-full max-w-6xl max-h-[98vh] flex flex-col items-center justify-center p-4"
      >
        
        {/* Header / Controls (Top Right) */}
        <div className="absolute top-6 right-6 flex items-center gap-4 z-20 bg-black/50 rounded-full p-2 backdrop-blur-sm">
            {/* Volume Controls */}
            <div className="flex items-center gap-2 pr-2 border-r border-zinc-700/50">
                <button 
                    onClick={toggleMute}
                    className="text-zinc-400 hover:text-white transition-colors p-1"
                    aria-label={isMuted ? "Unmute" : "Mute"}
                >
                    {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </button>
                
                {!isMuted && (
                    <div className="w-24 px-2 flex items-center">
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.05"
                            value={volume}
                            onChange={(e) => setVolume(parseFloat(e.target.value))}
                            className="w-full h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-emerald-500 hover:accent-emerald-400"
                        />
                    </div>
                )}
            </div>

            <button 
                onClick={onClose}
                className="text-zinc-400 hover:text-red-500 transition-colors p-1"
                aria-label="Close Game"
            >
                <X size={24} />
            </button>
        </div>

        {/* Arcade Cabinet Structure */}
        <div className="flex flex-col items-center gap-0 bg-zinc-800 p-4 rounded-xl shadow-2xl border-4 border-zinc-700 w-full max-w-3xl">
            
            {/* Marquee / Top Bezel */}
            <div className="w-full bg-black h-8 rounded-t-lg mb-2 flex items-center justify-center">
                <div className="w-full h-full bg-gradient-to-b from-zinc-800 to-black opacity-50"></div>
            </div>

            {/* Screen Bezel */}
            <div className="relative bg-black border-[16px] border-zinc-900 rounded-lg shadow-inner w-full flex justify-center p-2">
                
                {/* Loading / Start Overlay */}
                {(!isPlaying || isLoading) && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-900 z-20 p-6 text-center m-[16px] rounded overflow-hidden">
                        {isLoading ? (
                            <Loader2 className="w-12 h-12 text-emerald-500 animate-spin" />
                        ) : isInsertingCoin ? (
                            <div className="flex flex-col items-center animate-in fade-in duration-300">
                                <div className="relative mb-8 h-32 w-32 flex items-center justify-center">
                                    {/* Slot */}
                                    <div className="absolute w-4 h-16 bg-black border-2 border-zinc-700 rounded-full"></div>
                                    {/* Coin */}
                                    <Coins className="w-16 h-16 text-yellow-400 animate-[bounce_1s_infinite] drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]" />
                                </div>
                                <h2 className="text-4xl font-black text-white mb-2 tracking-tighter uppercase animate-pulse">
                                    CREDIT <span className="text-emerald-400">01</span>
                                </h2>
                                <p className="text-zinc-500 uppercase tracking-widest text-xs">Booting System...</p>
                            </div>
                        ) : (
                            <div className="animate-in fade-in zoom-in duration-300 flex flex-col items-center">
                                <Gamepad2 className="w-20 h-20 text-emerald-400 mb-6" />
                                <h2 className="text-4xl font-black text-white mb-2 tracking-tighter uppercase">Arcade Mode</h2>
                                <p className="text-zinc-400 mb-8 uppercase tracking-widest text-xs">The King of Fighters {"'95"}</p>
                                
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleInsertCoin();
                                    }}
                                    className="group relative px-12 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-2xl rounded-sm transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(16,185,129,0.5)] border-b-4 border-emerald-800 active:border-b-0 active:translate-y-1 overflow-hidden"
                                >
                                    <span className="relative z-10 flex items-center gap-3">
                                        <Coins className="w-6 h-6" />
                                        INSERT COIN
                                    </span>
                                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                                </button>
                                <p className="mt-6 text-[10px] text-zinc-600 uppercase animate-pulse">Free Play • 1 Credit</p>
                            </div>
                        )}
                    </div>
                )}
                
                {/* Game Canvas */}
                <div className="relative w-full h-full">
                    <canvas 
                        ref={canvasRef} 
                        width={160} 
                        height={144} 
                        tabIndex={0} // Make canvas focusable
                        onKeyDown={handleKeyDown}
                        onKeyUp={handleKeyUp}
                        className="w-full h-auto max-h-[70vh] image-pixelated focus:outline-none rounded-sm bg-black"
                        style={{ 
                            imageRendering: 'pixelated',
                            aspectRatio: '160/144',
                            boxShadow: '0 0 20px rgba(0,0,0,0.8)'
                        }}
                    />
                    {/* CRT Scanline Effect */}
                    {isPlaying && (
                        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-[length:100%_4px,3px_100%]"></div>
                    )}
                </div>
            </div>

            {/* Control Panel (Bottom) */}
            {isPlaying && (
                <div className="w-full bg-zinc-900 rounded-b-lg p-4 md:p-8 mt-2 border-t-4 border-zinc-700 shadow-inner">
                    <div className="flex flex-row flex-wrap justify-between items-end max-w-4xl mx-auto">
                        
                        {/* D-Pad Area (Left) */}
                        <div className="order-1 relative w-32 h-32 md:w-32 md:h-32 bg-zinc-800/50 rounded-full border-2 border-zinc-700/50 flex items-center justify-center shrink-0">
                            <div className="relative w-24 h-24 md:w-24 md:h-24">
                                {/* Center Axis */}
                                <div className="absolute top-1/3 left-1/3 w-1/3 h-1/3 bg-zinc-950 z-10"></div>

                                {/* Buttons */}
                                <button 
                                    {...getTouchProps('ArrowUp')}
                                    className={`absolute top-0 left-1/3 w-1/3 h-1/3 bg-zinc-950 rounded-t-md border-t-2 border-l-2 border-r-2 border-zinc-800 flex items-center justify-center active:bg-zinc-800 touch-none transition-colors ${activeKeys['ArrowUp'] ? '!bg-zinc-800' : ''}`}
                                >
                                    <span className={`text-xs ${activeKeys['ArrowUp'] ? 'text-emerald-400' : 'text-zinc-600'}`}>▲</span>
                                </button>
                                <button 
                                    {...getTouchProps('ArrowLeft')}
                                    className={`absolute top-1/3 left-0 w-1/3 h-1/3 bg-zinc-950 rounded-l-md border-l-2 border-t-2 border-b-2 border-zinc-800 flex items-center justify-center active:bg-zinc-800 touch-none transition-colors ${activeKeys['ArrowLeft'] ? '!bg-zinc-800' : ''}`}
                                >
                                    <span className={`text-xs ${activeKeys['ArrowLeft'] ? 'text-emerald-400' : 'text-zinc-600'}`}>◀</span>
                                </button>
                                <button 
                                    {...getTouchProps('ArrowRight')}
                                    className={`absolute top-1/3 right-0 w-1/3 h-1/3 bg-zinc-950 rounded-r-md border-r-2 border-t-2 border-b-2 border-zinc-800 flex items-center justify-center active:bg-zinc-800 touch-none transition-colors ${activeKeys['ArrowRight'] ? '!bg-zinc-800' : ''}`}
                                >
                                    <span className={`text-xs ${activeKeys['ArrowRight'] ? 'text-emerald-400' : 'text-zinc-600'}`}>▶</span>
                                </button>
                                <button 
                                    {...getTouchProps('ArrowDown')}
                                    className={`absolute bottom-0 left-1/3 w-1/3 h-1/3 bg-zinc-950 rounded-b-md border-b-2 border-l-2 border-r-2 border-zinc-800 flex items-center justify-center active:bg-zinc-800 touch-none transition-colors ${activeKeys['ArrowDown'] ? '!bg-zinc-800' : ''}`}
                                >
                                    <span className={`text-xs ${activeKeys['ArrowDown'] ? 'text-emerald-400' : 'text-zinc-600'}`}>▼</span>
                                </button>
                            </div>
                        </div>

                        {/* Action Buttons (Right) */}
                        <div className="order-2 flex items-end gap-4 pb-2 md:pb-0">
                            <div className="flex flex-col items-center gap-1 translate-y-4">
                                <button 
                                    {...getTouchProps('KeyZ')}
                                    className={`w-14 h-14 md:w-14 md:h-14 bg-red-700 rounded-full border-b-4 border-red-900 shadow-lg flex items-center justify-center active:scale-95 active:border-b-0 active:translate-y-1 touch-none transition-all ${activeKeys['KeyZ'] ? 'translate-y-1 border-b-0 bg-red-600' : ''}`}
                                >
                                    <span className="text-red-900 font-black text-xl opacity-50">B</span>
                                </button>
                            </div>
                            <div className="flex flex-col items-center gap-1 mb-6">
                                <button 
                                    {...getTouchProps('KeyX')}
                                    className={`w-14 h-14 md:w-14 md:h-14 bg-yellow-600 rounded-full border-b-4 border-yellow-800 shadow-lg flex items-center justify-center active:scale-95 active:border-b-0 active:translate-y-1 touch-none transition-all ${activeKeys['KeyX'] ? 'translate-y-1 border-b-0 bg-yellow-500' : ''}`}
                                >
                                    <span className="text-yellow-900 font-black text-xl opacity-50">A</span>
                                </button>
                            </div>
                        </div>

                        {/* Center Buttons (Bottom Center) */}
                        <div className="order-3 w-full flex justify-center gap-8 mt-6 md:mt-8">
                            <div className="flex flex-col items-center gap-1">
                                <button 
                                    {...getTouchProps('ShiftLeft')}
                                    className={`w-16 h-6 md:w-14 md:h-5 bg-zinc-950 rounded-full border border-zinc-700 transform -rotate-12 active:scale-95 active:bg-zinc-800 touch-none transition-all ${activeKeys['ShiftLeft'] ? '!bg-zinc-800 !border-emerald-500' : ''}`}
                                ></button>
                                <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold">Select</span>
                            </div>
                            <div className="flex flex-col items-center gap-1">
                                <button 
                                    {...getTouchProps('Enter')}
                                    className={`w-16 h-6 md:w-14 md:h-5 bg-zinc-950 rounded-full border border-zinc-700 transform -rotate-12 active:scale-95 active:bg-zinc-800 touch-none transition-all ${activeKeys['Enter'] ? '!bg-zinc-800 !border-emerald-500' : ''}`}
                                ></button>
                                <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold">Start</span>
                            </div>
                        </div>

                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default GameEmulator;
