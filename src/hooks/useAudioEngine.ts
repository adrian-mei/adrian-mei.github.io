import { useState, useRef, useCallback, useEffect } from 'react';

// --- Musical Theory Constants ---
// 1. Define the raw frequencies for the C Major Scale (to ensure perfect tuning)
const SCALE_FREQS = {
  C3: 130.81, D3: 146.83, E3: 164.81, F3: 174.61, G3: 196.00, A3: 220.00, B3: 246.94,
  C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.00, A4: 440.00, B4: 493.88,
  C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880.00, B5: 987.77,
  C6: 1046.50
};

// 2. Define Emotional Chord Progressions
// The engine will "lock" to one of these chords for a while, then drift to the next.
const CHORDS = [
  { name: 'I (Home)', notes: [SCALE_FREQS.C4, SCALE_FREQS.E4, SCALE_FREQS.G4, SCALE_FREQS.C5, SCALE_FREQS.E5] },
  { name: 'IV (Hope)', notes: [SCALE_FREQS.F3, SCALE_FREQS.A3, SCALE_FREQS.C4, SCALE_FREQS.F4, SCALE_FREQS.A4, SCALE_FREQS.C5] },
  { name: 'vi (Melancholy)', notes: [SCALE_FREQS.A3, SCALE_FREQS.C4, SCALE_FREQS.E4, SCALE_FREQS.A4, SCALE_FREQS.C5, SCALE_FREQS.E5] },
  { name: 'V (Tension)', notes: [SCALE_FREQS.G3, SCALE_FREQS.B3, SCALE_FREQS.D4, SCALE_FREQS.G4, SCALE_FREQS.B4, SCALE_FREQS.D5] },
];

// Markov Chain Transitions (Weighted probabilities for musical flow)
const CHORD_TRANSITIONS = [
  [0.1, 0.4, 0.3, 0.2], // I  -> IV(40%), vi(30%), V(20%), Stay(10%)
  [0.5, 0.1, 0.0, 0.4], // IV -> I(50%), V(40%), Stay(10%)
  [0.0, 0.4, 0.1, 0.5], // vi -> IV(40%), V(50%), Stay(10%)
  [0.8, 0.0, 0.2, 0.0], // V  -> I(80%), vi(20%)
];

// --- Types ---
interface AudioParams {
  volume: number;
  toneVolume: number;
  toneFreq: number; // Used as base reference if needed
  noiseVolume: number;
  noiseFilterFreq: number;
  noiseType: number;
  droneVolume: number;
  droneFreq: number;
  entrainmentFreq: number;
  feedbackDelay: number;
}

// --- Reverb Helper (Enhanced Stereo Width) ---
const createImpulseBuffer = (ctx: AudioContext, duration: number, decay: number) => {
  const rate = ctx.sampleRate;
  const length = rate * duration;
  const impulse = ctx.createBuffer(2, length, rate);
  const l = impulse.getChannelData(0);
  const r = impulse.getChannelData(1);

  // Generate decorrelated L/R for wider stereo image
  for (let i = 0; i < length; i++) {
    const n = i / length;
    const envelope = Math.pow(1 - n, decay);
    // Different noise for each channel creates spaciousness
    l[i] = (Math.random() * 2 - 1) * envelope;
    r[i] = (Math.random() * 2 - 1) * envelope;
  }
  return impulse;
};

export const useAudioEngine = () => {
  const [status, setStatus] = useState({ isReady: false, isPlaying: false });

  // --- Refs ---
  const ctxRef = useRef<AudioContext | null>(null);
  const masterRef = useRef<GainNode | null>(null);
  const compRef = useRef<DynamicsCompressorNode | null>(null);
  const makeupGainRef = useRef<GainNode | null>(null);
  const reverbRef = useRef<ConvolverNode | null>(null);
  const delayNodeRef = useRef<DelayNode | null>(null);
  const delayFeedbackRef = useRef<GainNode | null>(null);

  // Drone & Noise Refs
  const droneLeftOsc = useRef<OscillatorNode | null>(null);
  const droneRightOsc = useRef<OscillatorNode | null>(null);
  const droneGain = useRef<GainNode | null>(null);
  const droneBreathLFO = useRef<OscillatorNode | null>(null);
  const noiseNode = useRef<AudioWorkletNode | null>(null);
  const noiseGain = useRef<GainNode | null>(null);
  const noiseFilter = useRef<BiquadFilterNode | null>(null);

  // Evolutionary LFOs for long-term variation
  const evolutionLFOs = useRef<OscillatorNode[]>([]);

  // --- Melodic Logic State (UPDATED) ---
  const nextNoteTime = useRef(0);
  const timerID = useRef<number | null>(null);
  const currentChordIndex = useRef(0); // Tracks which chord we are currently playing

  const params = useRef<AudioParams>({
    volume: 0.1, 
    toneVolume: 0.2,
    toneFreq: 432,
    noiseVolume: 0.25,
    noiseFilterFreq: 400,
    noiseType: 0,
    droneVolume: 0.2,
    droneFreq: 111,
    entrainmentFreq: 4,
    feedbackDelay: 0.3,
  });

  // --- Initialization ---
  const initAudio = useCallback(async () => {
    if (ctxRef.current) return;

    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new AudioCtx();
    ctxRef.current = ctx;

    // 1. Master Chain (Improved Dynamics)
    const compressor = ctx.createDynamicsCompressor();
    compressor.threshold.value = -24; // Gentler threshold
    compressor.ratio.value = 4; // Reduced from 12:1 for more natural dynamics
    compressor.attack.value = 0.05;
    compressor.knee.value = 10; // Smooth knee for gradual compression
    compRef.current = compressor;

    // Makeup Gain (compensate for compression)
    const makeupGain = ctx.createGain();
    makeupGain.gain.value = 2.0; // +6dB makeup
    makeupGainRef.current = makeupGain;

    const master = ctx.createGain();
    master.gain.value = 0; // Start at 0 for fade-in
    masterRef.current = master;

    compressor.connect(makeupGain);
    makeupGain.connect(master);
    master.connect(ctx.destination);

    // 2. Effects Bus
    const reverb = ctx.createConvolver();
    reverb.buffer = createImpulseBuffer(ctx, 5, 4);
    reverb.connect(compressor);
    reverbRef.current = reverb;

    const delay = ctx.createDelay(5.0);
    // Sync delay to musical tempo (dotted quarter feel)
    const bpm = params.current.entrainmentFreq * 15; // Convert entrainment to BPM estimate
    const beatDuration = 60 / bpm;
    delay.delayTime.value = beatDuration * 1.5; // Dotted quarter note
    const feedback = ctx.createGain();
    feedback.gain.value = params.current.feedbackDelay;

    const delayFilter = ctx.createBiquadFilter();
    delayFilter.type = 'lowpass';
    delayFilter.frequency.value = 1500;

    delay.connect(feedback);
    feedback.connect(delayFilter);
    delayFilter.connect(delay);

    delay.connect(compressor);
    delay.connect(reverb);

    delayNodeRef.current = delay;
    delayFeedbackRef.current = feedback;

    // 3. Binaural Drone (With Breathing)
    const dGain = ctx.createGain();
    dGain.gain.value = params.current.droneVolume;
    droneGain.current = dGain;

    // Add breathing LFO for organic drone movement
    const breathLFO = ctx.createOscillator();
    breathLFO.frequency.value = 0.03; // 33 second breath cycle
    const breathDepth = ctx.createGain();
    breathDepth.gain.value = params.current.droneVolume * 0.25; // ±25% variation
    breathLFO.connect(breathDepth);
    breathDepth.connect(dGain.gain);
    breathLFO.start();
    droneBreathLFO.current = breathLFO;

    const merger = ctx.createChannelMerger(2);
    const oscL = ctx.createOscillator();
    const oscR = ctx.createOscillator();
    oscL.type = 'sine';
    oscR.type = 'sine';

    oscL.frequency.value = params.current.droneFreq;
    oscR.frequency.value = params.current.droneFreq + params.current.entrainmentFreq;

    oscL.connect(merger, 0, 0);
    oscR.connect(merger, 0, 1);

    const droneLPF = ctx.createBiquadFilter();
    droneLPF.type = 'lowpass';
    droneLPF.frequency.value = 200;

    merger.connect(droneLPF);
    droneLPF.connect(dGain);
    dGain.connect(compressor);

    oscL.start();
    oscR.start();
    droneLeftOsc.current = oscL;
    droneRightOsc.current = oscR;

    // 4. Noise Texture
    try {
      await ctx.audioWorklet.addModule('/audio-worklets/noise-processor.js');
      const nNode = new AudioWorkletNode(ctx, 'noise-processor');

      const nFilter = ctx.createBiquadFilter();
      nFilter.type = 'lowpass';
      nFilter.frequency.value = params.current.noiseFilterFreq;
      nFilter.Q.value = 0.5;

      const nGain = ctx.createGain();
      nGain.gain.value = params.current.noiseVolume;

      const lfo = ctx.createOscillator();
      lfo.frequency.value = 0.05;
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 200;
      lfo.connect(lfoGain);
      lfoGain.connect(nFilter.frequency);
      lfo.start();

      nNode.connect(nFilter);
      nFilter.connect(nGain);
      nGain.connect(compressor);
      nGain.connect(reverb);

      noiseNode.current = nNode;
      noiseFilter.current = nFilter;
      noiseGain.current = nGain;
    } catch (e) { console.warn("Worklet not loaded", e); }

    // 5. Evolutionary LFOs (Ultra-slow modulation for long-term variation)
    const evoLFOs: OscillatorNode[] = [];

    // LFO 1: Modulate Delay Time (creates drift over 4 minutes)
    const delayLFO = ctx.createOscillator();
    delayLFO.frequency.value = 0.004; // ~4 minute cycle
    const delayLFODepth = ctx.createGain();
    delayLFODepth.gain.value = 0.15; // ±150ms variation
    delayLFO.connect(delayLFODepth);
    delayLFODepth.connect(delay.delayTime);
    delayLFO.start();
    evoLFOs.push(delayLFO);

    // LFO 2: Modulate Drone Detune (subtle shimmer over 3.5 minutes)
    const detuneLFO = ctx.createOscillator();
    detuneLFO.frequency.value = 0.0048; // ~3.5 minute cycle
    const detuneLFODepth = ctx.createGain();
    detuneLFODepth.gain.value = 1.5; // ±1.5Hz variation
    detuneLFO.connect(detuneLFODepth);
    detuneLFODepth.connect(oscR.frequency); // Modulate right channel for shimmer
    detuneLFO.start();
    evoLFOs.push(detuneLFO);

    evolutionLFOs.current = evoLFOs;

    setStatus(s => ({ ...s, isReady: true }));
  }, []);

  // --- 2. The "Hybrid" Piano (FM Synthesis + Hammer Noise) ---
  const playPianoNote = (time: number, freq: number) => {
    if (!ctxRef.current || !compRef.current) return;
    const ctx = ctxRef.current;

    // --- Layer A: The "Hammer" (Percussive Thud) ---
    const hammerOsc = ctx.createOscillator();
    const hammerGain = ctx.createGain();
    const hammerFilter = ctx.createBiquadFilter();

    hammerOsc.type = 'triangle'; // Softer harmonics (Plan: Fix Harsh Hammer)
    hammerFilter.type = 'lowpass';
    hammerFilter.frequency.value = freq * 1.5; // Note-dependent filter

    hammerGain.gain.setValueAtTime(0, time);
    // Reduced gain (0.04) and extended attack (25ms) for realistic strike
    hammerGain.gain.linearRampToValueAtTime(0.04, time + 0.025);
    hammerGain.gain.exponentialRampToValueAtTime(0.001, time + 0.1); // Short burst

    hammerOsc.connect(hammerFilter);
    hammerFilter.connect(hammerGain);
    hammerGain.connect(compRef.current);

    hammerOsc.start(time);
    hammerOsc.stop(time + 0.2);

    // --- Layer B: The "String" (FM Synthesis) ---
    const carrier = ctx.createOscillator();
    const modulator = ctx.createOscillator();
    const stringGain = ctx.createGain();
    const panner = ctx.createStereoPanner();

    carrier.frequency.value = freq;
    modulator.frequency.value = freq * 2; // Octave harmonic

    // Modulation depth drops quickly (bright attack -> mellow sustain)
    const modGain = ctx.createGain();
    modGain.gain.setValueAtTime(freq * 1.5, time);
    modGain.gain.exponentialRampToValueAtTime(1, time + 0.5);

    modulator.connect(modGain);
    modGain.connect(carrier.frequency);

    // Volume Envelope (Piano Shape)
    const velocity = 0.2 + Math.random() * 0.3;
    stringGain.gain.setValueAtTime(0, time);
    stringGain.gain.linearRampToValueAtTime(params.current.toneVolume * velocity, time + 0.05);
    stringGain.gain.exponentialRampToValueAtTime(0.001, time + 4.0); // Long decay

    // Spatial (Frequency-based panning)
    // Low notes centered, high notes wider (Natural piano width)
    // C4 (261Hz) is center. C3 (130Hz) left-ish. C6 (1000Hz) right-ish.
    // Normalize deviation: (freq - 261) / 500
    let panPos = (freq - 261) / 800; 
    panPos = Math.max(-0.9, Math.min(0.9, panPos)); // Clamp
    // Add slight jitter for realism
    panPos += (Math.random() * 0.2) - 0.1;
    panner.pan.value = panPos;

    carrier.connect(stringGain);
    stringGain.connect(panner);
    panner.connect(compRef.current); // Dry signal

    // Reverb Send (Distance)
    if (reverbRef.current) {
        const send = ctx.createGain();
        send.gain.value = 0.4;
        panner.connect(send);
        send.connect(reverbRef.current);
    }
    // Delay Send
    if (delayNodeRef.current) {
        const send = ctx.createGain();
        send.gain.value = 0.3;
        panner.connect(send);
        send.connect(delayNodeRef.current);
    }

    carrier.start(time);
    modulator.start(time);

    carrier.stop(time + 5);
    modulator.stop(time + 5);

    // Cleanup
    setTimeout(() => {
        carrier.disconnect();
        modulator.disconnect();
        stringGain.disconnect();
        hammerOsc.disconnect();
        hammerGain.disconnect();
        panner.disconnect();
    }, 6000);
  };

  // --- 3. The Composer Scheduler ---
  const scheduler = useCallback(() => {
    if (!ctxRef.current) return;

    while (nextNoteTime.current < ctxRef.current.currentTime + 0.1) {
      // 1. Chord Logic: Weighted Markov Transitions
      // 20% chance to change chord on every note (keeps phrasing fluid)
      if (Math.random() > 0.80) {
          const currentIdx = currentChordIndex.current;
          const probs = CHORD_TRANSITIONS[currentIdx];
          const r = Math.random();
          let sum = 0;
          for (let i = 0; i < probs.length; i++) {
             sum += probs[i];
             if (r < sum) {
                 currentChordIndex.current = i;
                 break;
             }
          }
      }

      // 2. Note Logic: Pick a note from the CURRENT chord
      const activeChord = CHORDS[currentChordIndex.current];
      const noteFreq = activeChord.notes[Math.floor(Math.random() * activeChord.notes.length)];

      // 3. Play
      playPianoNote(nextNoteTime.current, noteFreq);

      // 4. Timing Logic (Humanized)
      // Base rhythm determined by "Mood"
      const mood = params.current.entrainmentFreq; // 4 (Sleep) to 20 (Focus)
      // Map mood to a delay range (Sleep = slower, Focus = faster)
      const baseDelay = 4.0 - ((mood - 4) / 16 * 3.0);

      // Add randomness so it feels like a person, not a robot
      let delay = baseDelay * (0.8 + Math.random() * 0.5);

      // Occasional "Phrase Pause"
      if (Math.random() > 0.9) {
         delay *= 3.0; // Take a breath
      }

      nextNoteTime.current += delay;
    }
    timerID.current = window.setTimeout(scheduler, 25);
  }, []);

  // --- Param Updates ---
  const updateParams = (newParams: Partial<AudioParams>) => {
    params.current = { ...params.current, ...newParams };
    if (!ctxRef.current) return;
    const t = ctxRef.current.currentTime;
    const timeConstant = 0.5;

    if (newParams.volume !== undefined && masterRef.current)
      masterRef.current.gain.setTargetAtTime(newParams.volume, t, timeConstant);

    if (newParams.noiseVolume !== undefined && noiseGain.current)
      noiseGain.current.gain.setTargetAtTime(newParams.noiseVolume, t, timeConstant);

    if (newParams.noiseFilterFreq !== undefined && noiseFilter.current)
      noiseFilter.current.frequency.setTargetAtTime(newParams.noiseFilterFreq, t, timeConstant);

    if (newParams.droneFreq !== undefined || newParams.entrainmentFreq !== undefined) {
      const base = params.current.droneFreq;
      const diff = params.current.entrainmentFreq;
      if (droneLeftOsc.current)
        droneLeftOsc.current.frequency.setTargetAtTime(base, t, timeConstant);
      if (droneRightOsc.current)
        droneRightOsc.current.frequency.setTargetAtTime(base + diff, t, timeConstant);
    }
  };

  const togglePlay = async () => {
    if (!status.isReady) {
      await initAudio();
      await ctxRef.current?.resume();
      
      // Graceful Fade-In (4s)
      if (masterRef.current && ctxRef.current) {
        masterRef.current.gain.setValueAtTime(0, ctxRef.current.currentTime);
        masterRef.current.gain.linearRampToValueAtTime(params.current.volume, ctxRef.current.currentTime + 4.0);
      }

      setStatus(s => ({...s, isPlaying: true}));
      nextNoteTime.current = ctxRef.current!.currentTime + 0.1;
      scheduler();
    } else {
      if (status.isPlaying) {
        // Graceful Fade-Out (2.5s)
        if (masterRef.current && ctxRef.current) {
          const now = ctxRef.current.currentTime;
          // Cancel any scheduled updates to prevent conflicts
          masterRef.current.gain.cancelScheduledValues(now);
          masterRef.current.gain.setValueAtTime(masterRef.current.gain.value, now);
          masterRef.current.gain.linearRampToValueAtTime(0, now + 2.5);
          
          // Wait for fade before suspending (prevents jarring cut)
          setTimeout(async () => {
            // Only suspend if we haven't started playing again
            if (!status.isPlaying) {
               await ctxRef.current?.suspend();
            }
          }, 2600);
        }
        
        if(timerID.current) clearTimeout(timerID.current);
        setStatus(s => ({...s, isPlaying: false}));
      } else {
        await ctxRef.current?.resume();
        
        // Graceful Fade-In (4s)
        if (masterRef.current && ctxRef.current) {
            masterRef.current.gain.setValueAtTime(0, ctxRef.current.currentTime);
            masterRef.current.gain.linearRampToValueAtTime(params.current.volume, ctxRef.current.currentTime + 4.0);
        }

        nextNoteTime.current = ctxRef.current!.currentTime + 0.1;
        scheduler();
        setStatus(s => ({...s, isPlaying: true}));
      }
    }
  };

  // Cleanup
  useEffect(() => {
    return () => {
      if (timerID.current) clearTimeout(timerID.current);
      ctxRef.current?.close();
    };
  }, []);

  return { isReady: status.isReady, isPlaying: status.isPlaying, togglePlay, updateParams, params: params.current };
};
