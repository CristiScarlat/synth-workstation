import { initMidi, listMidiPorts, setSelectedMidiPort } from './midi.js';
import { 
    triggerSynth, 
    resumeAudio, 
    handleChangeMasterVolume, 
    handleChangeVoiceAdsr,
    handleChangeOsc1Level,
    handleChangeOsc2Level,
    handleChangeOsc2Detune 
} from './synth.js';
import '../public/style.css';

const onMidiEvent = (e) => {
    const midiData = [];
    for (var i = 0; i < e.data.length; i++) {
        midiData.push(e.data[i]);
    }
    const event = midiData[0] >> 4;
    const channel = midiData[0] & 0x0F;
    
    triggerSynth({
        event,
        channel,
        note: midiData[1],
        velocity: midiData[2]
    });
}

const startMidi = async() => {
    await initMidi();
    const midiPortsList = document.getElementById('midi-port-select');
    const fragment = document.createDocumentFragment();
    const { inputs, outputs } = listMidiPorts();
    inputs.forEach(input => {
        const portName = input[1].name;
        const displaySelectedMidiPort = document.getElementById('dropdownMenuButtonMidiInput');
        const listItem = document.createElement('button');
        listItem.className = "dropdown-item";
        listItem.innerText = portName;
        listItem.onclick = () => {
            setSelectedMidiPort(portName, onMidiEvent);
            displaySelectedMidiPort.innerText = portName;
            resumeAudio();
        }
        fragment.append(listItem);
    });

    midiPortsList.append(fragment);
}

window.onload = async () => {
    await startMidi();
}

const mainVolumeSlider = document.getElementById("main-volume-slider");
mainVolumeSlider.oninput = handleChangeMasterVolume;

const voiceAttack = document.getElementById("synth-adsr-attack");
voiceAttack.oninput = (e) => handleChangeVoiceAdsr(e.target.value, e.target.name);

const voiceDecay= document.getElementById("synth-adsr-decay");
voiceDecay.oninput = (e) => handleChangeVoiceAdsr(e.target.value, e.target.name);

const voiceSustain = document.getElementById("synth-adsr-sustain");
voiceSustain.oninput = (e) => handleChangeVoiceAdsr(e.target.value, e.target.name);

const voiceRelease = document.getElementById("synth-adsr-release");
voiceRelease.oninput = (e) => handleChangeVoiceAdsr(e.target.value, e.target.name);

const osc1Level = document.getElementById("synth-osc1-level");
osc1Level.oninput = (e) => handleChangeOsc1Level(e.target.value);

const osc2Level = document.getElementById("synth-osc2-level");
osc2Level.oninput = (e) => handleChangeOsc2Level(e.target.value);

const osc2Detune = document.getElementById("synth-osc2-detune");
osc2Detune.oninput = (e) => handleChangeOsc2Detune(e.target.value);



