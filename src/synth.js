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

const adsr = {attack: 0, decay: 0, sustain: 1, release: 0}
let osc1Level = 0.5;
let osc2Level = 0.5;
let osc2Detune = 20;

let voices = {};

function noteToFreq(note) {
    let a = 440;
    return (a / 32) * (2 ** ((note - 9) / 12));
}

export const triggerSynth = (midiNoteEvent) => {
    if (midiNoteEvent.event === 9) {
        //"sine", "square", "sawtooth", "triangle"
        const voice = new Voice(audioContext, mainVolume, noteToFreq(midiNoteEvent.note), "sine");
        voice.setEnvelope(adsr.attack, adsr.decay, adsr.sustain, adsr.release);
        voice.setOsc1Level(osc1Level);
        voice.setOsc2Level(osc2Level);
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
    osc2Detune = parseFloat(value);
}