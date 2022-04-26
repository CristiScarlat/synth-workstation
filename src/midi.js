let midi = null;

export const initMidi = () => new Promise((resolve, reject) => {
    if (navigator.requestMIDIAccess) {
        function onMIDISuccess(midiAccess) {
            midi = midiAccess;
            resolve(midiAccess);
        }
        function onMIDIFailure(msg) {
            console.log("Failed to get MIDI access - " + msg);
            reject("Failed to get MIDI access - " + msg);
        }
        navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);
    }
    else reject("Browser does not suport midi");
});

export const listMidiPorts = () => {
    const inputs = Array.from(midi.inputs);
    const outputs = Array.from(midi.outputs);
    return { inputs, outputs };
}

export const setSelectedMidiPort = (portName, cb) => {
    midi.inputs.forEach(input => {        
        if(input.name === portName){
            input.onmidimessage = cb;
        }
    });
}