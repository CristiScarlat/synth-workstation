import Voice from './synth_modules/voice.js';

let audioContext = new (window.AudioContext || window.webkitAudioContext);

export const resumeAudio = () => {
    audioContext.resume().then(() => {
        console.log('Playback resumed successfully');
    });
}

const mainVolume = audioContext.createGain();
mainVolume.connect(audioContext.destination);
mainVolume.gain.value = 0.5;

const compressor = audioContext.createDynamicsCompressor();
compressor.threshold.setValueAtTime(-30, audioContext.currentTime);
compressor.knee.setValueAtTime(40, audioContext.currentTime);
compressor.ratio.setValueAtTime(10, audioContext.currentTime);
compressor.attack.setValueAtTime(0, audioContext.currentTime);
compressor.release.setValueAtTime(0.25, audioContext.currentTime);
compressor.connect(mainVolume);

const adsr = {attack: 0.1, decay: 0, sustain: 1, release: 0.5}
let osc1Level = 0.5;
let osc2Level = 0.5;
let osc2Detune = 0;

const oscTypes = ["sine", "square", "sawtooth", "triangle"];
let osc1Type = 'sine';
let osc2Type = 'sine';

let voices = {};

function noteToFreq(note) {
    let a = 440;
    return (a / 32) * (2 ** ((note - 9) / 12));
}

export const triggerSynth = (midiNoteEvent) => {
    if (midiNoteEvent.event === 9) {
        const voice = new Voice(audioContext, compressor, noteToFreq(midiNoteEvent.note), osc1Type, osc2Type);
        voice.setEnvelope(adsr.attack, adsr.decay, adsr.sustain, adsr.release);
        voice.setOsc1Level(osc1Level);
        voice.setOsc1Type(osc1Type);
        voice.setOsc2Level(osc2Level);
        voice.setOsc2Type(osc2Type);
        voice.setOsc2Detune(osc2Detune);
        voice.triggerAttack();
        voices[midiNoteEvent.note] = voice;
    }
    else if (midiNoteEvent.event === 8) {
        //voices[midiNoteEvent.note].triggerRelease();
        voices[midiNoteEvent.note].stop();
        delete voices[midiNoteEvent.note];
    }
}

export const handleChangeMasterVolume = (e) => {
    mainVolume.gain.value = e.target.value;
}

export const handleChangeVoiceAdsr = (value, name) => {
    adsr[name] = parseFloat(value);
}

export const handleChangeOsc1Level = (value) => {
    osc1Level = parseFloat(value);
}

export const handleChangeOsc2Level = (value) => {
    osc2Level = parseFloat(value);
}

export const handleChangeOsc2Detune = (value) => {
    console.log(parseFloat(value))
    osc2Detune = parseFloat(value);
}

export const handleChangeOsc1Type = (value) => {
    console.log(oscTypes[value - 1])
    osc1Type = oscTypes[value - 1];
}

export const handleChangeOsc2Type = (value) => {
    console.log(oscTypes[value - 1])
    osc2Type = oscTypes[value - 1];
}

