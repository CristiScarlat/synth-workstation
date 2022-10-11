import { initMidi, listMidiPorts, setSelectedMidiPort } from './midi.js';
import {
  triggerSynth,
  resumeAudio,
  handleChangeMasterVolume,
  handleChangeVoiceAdsr,
  handleChangeOsc1Level,
  handleChangeOsc2Level,
  handleChangeOsc2Detune,
  handleChangeOsc1Type,
  handleChangeOsc2Type
} from './synth.js';
import { initADSRGraph, setADSRGraph } from './2dGraphs/adsrGraph.js';
import '../public/style.css';

var isMobile = {
  Android: function () {
    return navigator.userAgent.match(/Android/i);
  },
  BlackBerry: function () {
    return navigator.userAgent.match(/BlackBerry/i);
  },
  iOS: function () {
    return navigator.userAgent.match(/iPhone|iPad|iPod/i);
  },
  Opera: function () {
    return navigator.userAgent.match(/Opera Mini/i);
  },
  Windows: function () {
    return (
      navigator.userAgent.match(/IEMobile/i) ||
      navigator.userAgent.match(/WPDesktop/i)
    );
  },
  any: function () {
    return (
      isMobile.Android() ||
      isMobile.BlackBerry() ||
      isMobile.iOS() ||
      isMobile.Opera() ||
      isMobile.Windows()
    );
  }
};

const onMidiEvent = (e) => {
  const midiData = [];
  for (var i = 0; i < e.data.length; i++) {
    midiData.push(e.data[i]);
  }
  const event = midiData[0] >> 4;
  const channel = midiData[0] & 0x0f;

  triggerSynth({
    event,
    channel,
    note: midiData[1],
    velocity: midiData[2]
  });
};

const keyToNote = {
  z: 60,
  s: 61,
  x: 62,
  d: 63,
  c: 64,
  v: 65,
  g: 66,
  b: 67,
  h: 68,
  n: 69,
  j: 70,
  m: 71
};

let keyBuff = null;

const handleKeyNoteOn = (e) => {
  if (e.key === keyBuff) return;
  keyBuff = e.key;
  console.log('on', e.key);
  triggerSynth({
    event: 9,
    channel: 0,
    note: keyToNote[e.key],
    velocity: 120
  });
};

const handleKeyNoteOff = (e) => {
  console.log('off', e.key);
  keyBuff = null;
  triggerSynth({
    event: 8,
    channel: 0,
    note: keyToNote[e.key],
    velocity: 120
  });
};

const startMidi = async () => {
  await initMidi();
  const midiPortsList = document.getElementById('midi-port-select');
  const fragment = document.createDocumentFragment();
  const { inputs, outputs } = listMidiPorts();
  inputs.forEach((input) => {
    const portName = input[1].name;
    const displaySelectedMidiPort = document.getElementById(
      'dropdownMenuButtonMidiInput'
    );
    const listItem = document.createElement('button');
    listItem.className = 'dropdown-item';
    listItem.innerText = portName;
    listItem.onclick = () => {
      setSelectedMidiPort(portName, onMidiEvent);
      displaySelectedMidiPort.innerText = portName;
      resumeAudio();
    };
    fragment.append(listItem);
  });

  midiPortsList.append(fragment);
};

window.onload = async () => {
  if (isMobile.any()) {
    const mainContainer = document.getElementById('app');
    mainContainer.style.display = 'none';
    if (isMobile.iOS()) {
      alert('You are on iOS mobile.Please use Chrome browser only on desktop.');
    } else
      alert(
        'Your are on mobile device.Please use Chrome browser only on desktop.'
      );
  } else {
    console.log('...loading MIDI ----> init synth graphs');
    await startMidi();
    initADSRGraph();
    addEventListener('keypress', handleKeyNoteOn, false);
    addEventListener('keyup', handleKeyNoteOff);
  }
};

const mainVolumeSlider = document.getElementById('main-volume-slider');
mainVolumeSlider.oninput = handleChangeMasterVolume;

const voiceAttack = document.getElementById('synth-adsr-attack');
voiceAttack.oninput = (e) => {
  handleChangeVoiceAdsr(e.target.value, e.target.name);
  setADSRGraph(e.target.value, e.target.name);
};

const voiceDecay = document.getElementById('synth-adsr-decay');
voiceDecay.oninput = (e) => {
  handleChangeVoiceAdsr(e.target.value, e.target.name);
  setADSRGraph(e.target.value, e.target.name);
};

const voiceSustain = document.getElementById('synth-adsr-sustain');
voiceSustain.oninput = (e) => {
  handleChangeVoiceAdsr(e.target.value, e.target.name);
  setADSRGraph(e.target.value, e.target.name);
};

const voiceRelease = document.getElementById('synth-adsr-release');
voiceRelease.oninput = (e) => {
  handleChangeVoiceAdsr(e.target.value, e.target.name);
  setADSRGraph(e.target.value, e.target.name);
};

const osc1Level = document.getElementById('synth-osc1-level');
osc1Level.oninput = (e) => handleChangeOsc1Level(e.target.value);

const osc2Level = document.getElementById('synth-osc2-level');
osc2Level.oninput = (e) => handleChangeOsc2Level(e.target.value);

const osc2Detune = document.getElementById('synth-osc2-detune');
osc2Detune.oninput = (e) => handleChangeOsc2Detune(e.target.value);

const osc1Waveform = document.getElementById('osc1-waveform');
osc1Waveform.onchange = (e) =>
  handleChangeOsc1Type(e.target.id.split('').pop());

const osc2Waveform = document.getElementById('osc2-waveform');
osc2Waveform.onchange = (e) =>
  handleChangeOsc2Type(e.target.id.split('').pop());
