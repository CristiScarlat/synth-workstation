import { initMidi, listMidiPorts, setSelectedMidiPort } from './midi.js';
import { triggerSynth, resumeAudio, handleChangeMasterVolume } from './synth.js';
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
mainVolumeSlider.onchange = handleChangeMasterVolume;



