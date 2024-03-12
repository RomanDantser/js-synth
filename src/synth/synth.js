/**
 * Synth constructor, tuning base is frequency in Hz of the A note
 * of the 0 octave. Voices is parameter which defines how many notes
 * you can play simeltaneously. Volume level is how much gain is
 * on the master gain node (or master output).
 * @param {number} tuningBase 
 * @param {number} voices 
 * @param {number} volumeLevel 
 */

function Synth(tuningBase = 440, voices = 8, volumeLevel = 0.2) {
    this.tuningBase = tuningBase;
    this.voices = voices;
    this.volumeLevel = volumeLevel;

    /**
     * This would be reworked later with the custom wave types to
     * avoid clicking after releasing the note with 0 release time.
     */
    this.allowedWaveTypes = [
        'sine',
        'square',
        'sawtooth',
        'triangle',
    ];

    // Envelope base settings
    this.envelopeSettings = {
        attackTime: 0,
        releaseTime: 0,
    }

    // Oscillator base settings
    this.oscillatorSettings = {
        waveType: 'sawtooth'
    }
}

/**
 * Initializing the main audio settings and
 * setting up the audio context (this is used to initialzie it after user interaction)
 */
Synth.prototype.setAudio = function () {
    this.audioContext = new AudioContext();

    // Analyser Node for the graphical interpretation of the output sound of master
    this.analyser = this.audioContext.createAnalyser();
    this.analyser.connect(this.audioContext.destination);

    // Master Gain initialisation
    this.masterGain = this.audioContext.createGain();
    this.masterGain.connect(this.analyser);
    this.masterGain.gain.setValueAtTime(this.volumeLevel, this.audioContext.currentTime);
}

/**
 * This method allows to set master volume. Volume ranges between 0 and 1 as
 * it's setting the gain parameter of the master gain node.
 * @param {number} volume 
 * @returns 
 */
Synth.prototype.setMasterVolume = function (volume) {
    if(!this || !this.audioContext || volume < 0 || volume > 100) {
        return null;
    }
    const volumePoints = volume / 100;
    this.volumeLevel = volumePoints;
    this.masterGain.gain.setValueAtTime(this.volumeLevel, this.audioContext.currentTime);
}

/**
 * This method allows to set up attack time of the envelope node.
 * Attack time ranges between 0 and 5 (seconds).
 * @param {number} attackTime 
 * @returns 
 */
Synth.prototype.setEnvelopeAttackTime = function (attackTime) {
    if(attackTime < 0 || attackTime > 1) {
        return null;
    }
    this.envelopeSettings.attackTime = attackTime;
}

/**
 * This method allows to set up release time of the envelope node.
 * Release time ranges between 0 and 5 (seconds).
 * @param {number} releaseTime 
 * @returns 
 */
Synth.prototype.setEnvelopeReleaseTime = function (releaseTime) {
    if(releaseTime < 0 || releaseTime > 1) {
        return null;
    }
    this.envelopeSettings.releaseTime = releaseTime;
}

/**
 * This method allows to set up wave type of the oscillator node.
 * The wave type can be selected only of the allowed wave types in
 * Synth.allowedWaveTypes.
 * @param {string} waveType 
 * @returns 
 */
Synth.prototype.setOscillatorWaveType = function (waveType) {
    if(!this.allowedWaveTypes.includes(waveType)) {
        return null;
    }

    this.oscillatorSettings.waveType = waveType;
}

/**
 * TODO!!!
 * @returns {Object}
 */
Synth.prototype.createEnvelopeNode = function () {
    const envelopeNode = this.audioContext.createGain();
    envelopeNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    envelopeNode.gain.linearRampToValueAtTime(
        1,
        this.audioContext.currentTime + this.envelopeSettings.attackTime
    );

    envelopeNode.connect(this.masterGain);
    return envelopeNode;
} 

/**
 * TODO!!!
 * @param {number} noteFrequency 
 * @param {Object} envelopeNode 
 * @returns 
 */
Synth.prototype.createOscillatorNode = function(noteFrequency, envelopeNode) {
    const oscillator = this.audioContext.createOscillator();
    oscillator.frequency.setValueAtTime(noteFrequency, this.audioContext.currentTime);
    oscillator.type = this.oscillatorSettings.waveType;

    oscillator.connect(envelopeNode);
    oscillator.start();

    return oscillator;
}

/**
 * TODO!!!
 * @returns {Uint8Array}
 */
Synth.prototype.getDataFromAnalyser = function () {
    if(!this.analyser) {
        return null;
    }
    const bufferLength = this.analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    this.analyser.getByteTimeDomainData(dataArray)
    return dataArray;
}

/**
 * TODO!!!
 * @param {string} key 
 * @returns 
 */
Synth.prototype.onKeyPress = function (key) {
    if(!this.audioContext) {
        this.setAudio();
    }
    const [notePosition, octave] = this.parseStringKey(key);
    const noteFrequency = this.getEqualTempermentFreqByPos(
        this.tuningBase * Math.pow(2, octave),
        notePosition
    );

    if(!this.synthSoundObjects) {
        this.synthSoundObjects = new Map();
    }
    if(this.synthSoundObjects.size >= this.voices || this.synthSoundObjects.has(noteFrequency)) {
        return null;
    }

    const envelope = this.createEnvelopeNode();
    const oscillator = this.createOscillatorNode(noteFrequency, envelope);

    this.synthSoundObjects.set(noteFrequency, {
        oscillator,
        envelope
    });
}

/**
 * TODO!!!
 * @param {string} key 
 * @returns 
 */
Synth.prototype.onKeyRelease = function (key) {
    if(!this.synthSoundObjects || this.synthSoundObjects.size === 0 || !key) {
        return null;
    }
    const [notePosition, octave] = this.parseStringKey(key);
    const noteFrequency = this.getEqualTempermentFreqByPos(
        this.tuningBase * Math.pow(2, octave),
        notePosition
    );

    if(!this.synthSoundObjects.has(noteFrequency)) {
        return null;
    }
    const synthSoundObject = this.synthSoundObjects.get(noteFrequency);
    synthSoundObject.envelope.gain.linearRampToValueAtTime(
        0,
        this.audioContext.currentTime + this.envelopeSettings.releaseTime);
    synthSoundObject.oscillator.stop(this.audioContext.currentTime + this.envelopeSettings.releaseTime)
    this.synthSoundObjects.delete(noteFrequency);
}

/**
 * This synth implementation uses equal temperment system (ETS) with
 * 12 notes in the octave. This method allows you to get
 * frequency of the note in ETS by starting frequency and your
 * current position of the note according to that frequency.
 * @param {number} startingFrequency 
 * @param {number} position 
 * @returns {number}
 */
Synth.prototype.getEqualTempermentFreqByPos = function (startingFrequency, position) {
    return (startingFrequency * Math.pow(2, (position / 12)));
}

/**
 * This method allows you to get note position and octave number
 * of the passed note in format "NOTE":"OCTAVE_NUMBER" where 
 * "NOTE" is of the english note notation format and
 * "OCTAVE_NUMBER" is number of the octave relative
 * to the octave in which located A with 440 Hz frequency
 * (which is 0 is this case). In return you receive array
 * with note position and octave number.
 * @param {string} key 
 * @returns {Array}
 */
Synth.prototype.parseStringKey = function (key) {
    const lettersToNumOfSemitonesFromA = {
        'C': -9,
        'C#': -8,
        'D': -7,
        'D#': -6,
        'E': -5,
        'F': -4,
        'F#': -3,
        'G': -2,
        'G#': -1,
        'A': 0,
        'A#': 1,
        'B': 2
    };
    const [note, octave] = key.split(':');
    const octaveToNumber = Number(octave);
   
    if(isNaN(octaveToNumber) || lettersToNumOfSemitonesFromA[note] === undefined) {
        return null;
    }

    return [lettersToNumOfSemitonesFromA[note], octaveToNumber];
}

export default Synth;