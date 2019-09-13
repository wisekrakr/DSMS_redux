
/**
 * Creates a GainNode and connects it to the destination.
 * 
 * @param  {} audioContext instance of AudioContext
 */
const GameAudio = function(audioContext){  
    this.context = audioContext;
    this.gainNode = null; 
    this.oscillator = null;
    this.compressor = audioContext.createDynamicsCompressor();
    this.compressor.connect(audioContext.destination);
}

/**
 * Changes the frequency in Hz, immediately or specific time
 * 
 * @param  {} val value
 * @param  {} when the moment to start
 */
GameAudio.prototype.setFrequency = function(val, when) {
    if(when) {
      this.oscillator.frequency.setValueAtTime(val, this.context.currentTime + when);
    } else {
      this.oscillator.frequency.setValueAtTime(val, this.context.currentTime);
    }
    return this;
};

/**
 * Changes the volume multiplier, immediately or specific time
 * 
 * @param  {} val value
 * @param  {} when the moment to start
 */
GameAudio.prototype.setVolume = function(val, when) {   
    if(when) {
      this.gainNode.gain.exponentialRampToValueAtTime(val, this.context.currentTime + when);
    } else {
      this.gainNode.gain.setValueAtTime(val, this.context.currentTime);
    }
    return this;
};

/**
 * Changes the wave type (sine, square, sawtooth or triangle).
 * 
 * @param  {} waveType "sine, square, sawtooth or triangle"
 */
GameAudio.prototype.setWaveType = function(waveType) {
    this.oscillator.type = waveType;
    return this;
};

/**
 * Creates an OscillatorNode to play the specified sound and starts playing, immediately or specific time
 * 
 * @param  {} freq frequency
 * @param  {} vol volume
 * @param  {} wave wave type
 * @param  {} when the moment to start playing
 */
GameAudio.prototype.play = function(freq, vol, wave, when) {
    this.oscillator = this.context.createOscillator();
    this.oscillator.connect(this.compressor);
    this.gainNode = this.context.createGain();
    this.gainNode.connect(this.compressor);  

    this.setFrequency(freq);
    if(wave) {
      this.setWaveType(wave);
    }
    this.setVolume(1/1000);
    if(when) {
      this.setVolume(1/1000, when - 0.02);
      this.oscillator.start(when - 0.02);
      this.setVolume(vol, when);
    } else {
      this.oscillator.start();
      this.setVolume(vol, 0.02);
    }
    return this;
},

/**
 * Stops audio from playing, immediately or specific time
 * 
 * @param  {} when the moment to stop playing
 */
GameAudio.prototype.stop = function(when) {
    this.gainNode.connect(this.compressor);  
    if(when) {
      this.gainNode.gain.setTargetAtTime(1/1000, this.context.currentTime + when - 0.05, 0.02);
      this.oscillator.stop(this.context.currentTime + when);
    } else {
      this.gainNode.gain.setTargetAtTime(1/1000, this.context.currentTime, 0.02);
      this.oscillator.stop(this.context.currentTime + 0.05);
    }
    return this;
};
