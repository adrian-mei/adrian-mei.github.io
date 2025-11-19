// Based on the "Procedural Synthesis of Calming Audio" Blueprint
// Implements Brown Noise (Integration Method) and Pink Noise (Voss-McCartney)

class NoiseProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    // Brown Noise State
    this.brownLastOut = 0;
    
    // Pink Noise State (Voss-McCartney)
    // We use 16 generators to be safe and smooth, though 7 is standard.
    this.pinkKeys = new Uint32Array(16);
    this.pinkWhiteValues = new Float32Array(16);
    this.pinkGlobalSum = 0;
    this.pinkKeyIndex = 0;
    
    // Initialize pink noise state
    for (let i = 0; i < 16; i++) {
        this.pinkKeys[i] = 0;
        this.pinkWhiteValues[i] = (Math.random() * 2) - 1;
        this.pinkGlobalSum += this.pinkWhiteValues[i];
    }
  }

  static get parameterDescriptors() {
    return [
      {
        name: 'noiseType', // 0: Brown, 1: Pink, 2: White
        defaultValue: 0,
        minValue: 0,
        maxValue: 2,
      },
    ];
  }

  process(inputs, outputs, parameters) {
    const output = outputs[0];
    const outputChannel = output[0];
    const noiseType = parameters.noiseType[0]; // strictly getting first value for simplicity

    if (noiseType < 0.5) {
        this.processBrown(outputChannel);
    } else if (noiseType < 1.5) {
        this.processPink(outputChannel);
    } else {
        this.processWhite(outputChannel);
    }

    return true;
  }

  processWhite(outputChannel) {
    for (let i = 0; i < outputChannel.length; i++) {
      outputChannel[i] = (Math.random() * 2) - 1;
    }
  }

  // Brown Noise: Integration Method
  // x[n] = x[n-1] + c * WhiteNoise
  // We apply a leak factor to prevent drifting out of range
  processBrown(outputChannel) {
    for (let i = 0; i < outputChannel.length; i++) {
      const white = (Math.random() * 2) - 1;
      // Leak factor of 0.98 to keep it centered, 0.02 coefficient
      this.brownLastOut = (this.brownLastOut * 0.98) + (white * 0.05); // Adjusted coeff for level
      outputChannel[i] = this.brownLastOut * 3.5; // Compensate gain
    }
  }

  // Pink Noise: Voss-McCartney Algorithm
  processPink(outputChannel) {
    for (let i = 0; i < outputChannel.length; i++) {
        // Increment counter
        this.pinkKeyIndex = (this.pinkKeyIndex + 1) & 15; // Wrap 0-15
        
        // Calculate trailing zeros to determine which generator to update
        // This is a fast way to distribute updates logarithmically
        const k = this.countTrailingZeros(this.pinkKeyIndex);
        
        // Store old value to subtract from sum
        const oldVal = this.pinkWhiteValues[k];
        // Generate new value
        const newVal = (Math.random() * 2) - 1;
        
        this.pinkWhiteValues[k] = newVal;
        this.pinkGlobalSum = this.pinkGlobalSum - oldVal + newVal;
        
        // Add white noise to fill high frequency gaps (optional but recommended)
        const white = (Math.random() * 2) - 1;
        
        // Output (scaled down by number of generators + white)
        outputChannel[i] = (this.pinkGlobalSum + white) * 0.11;
    }
  }
  
  // Helper for Voss-McCartney
  countTrailingZeros(n) {
      let count = 0;
      while ((n & 1) === 0 && n !== 0) {
          n >>= 1;
          count++;
      }
      return count;
  }
}

registerProcessor('noise-processor', NoiseProcessor);
