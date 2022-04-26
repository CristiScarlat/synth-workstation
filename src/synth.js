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

let voices = {};

function noteToFreq(note) {
    let a = 440;
    return (a / 32) * (2 ** ((note - 9) / 12));
}

export const triggerSynth = (midiNoteEvent) => {
    if (midiNoteEvent.event === 9) {
        //"sine", "square", "sawtooth", "triangle"
        const voice = new Voice(audioContext, mainVolume, noteToFreq(midiNoteEvent.note), "sawtooth");
        voice.setEnvelope(0.1, 0.5, 0.8, 0.5);
        voice.triggerAttack();
        voices[midiNoteEvent.note] = voice;
    }
    else if (midiNoteEvent.event === 8) {
        voices[midiNoteEvent.note].triggerRelease();
        delete voices[midiNoteEvent.note];
    }
}

export const handleChangeMasterVolume = (e) => {
    mainVolume.gain.value = e.target.value;
}