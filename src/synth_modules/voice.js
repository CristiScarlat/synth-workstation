import ADSR from "./adsr";

export default class Voice extends ADSR {

    constructor(audioCtx, outputNode, freq, osc1type, osc2type) {

        super(audioCtx, outputNode)
        this.ctx = audioCtx;
        this.freq = freq;

        this.gain1 = this.ctx.createGain();
        this.gain1.gain.value = 0.5;
        this.gain1.connect(this.getInputNode());

        this.gain2 = this.ctx.createGain();
        this.gain2.gain.value = 0.5;
        this.gain2.connect(this.getInputNode());
        
        this.osc1 = this.ctx.createOscillator();
        this.osc1.frequency.value = freq;
        this.osc1.type = osc1type;
        this.osc1.start();
        this.osc1.connect(this.gain1);

        this.osc2 = this.ctx.createOscillator();
        this.osc2.frequency.value = freq;
        this.osc2.type = osc2type;
        this.osc2.detune.value = 20;
        this.osc2.start();
        this.osc2.connect(this.gain2);       
    }

    setOsc1Type = (type) => {
        this.osc1.type = type;
    }

    setOsc2Type = (type) => {
        this.osc2.type = type;
    }

    setOsc1Level = (level) => {
        this.gain1.gain.value = level;
    }

    setOsc2Level = (level) => {
        this.gain2.gain.value = level;
    }

    setOsc2Detune = (detune) => {
        this.osc2.detune.value = detune
    }

    setFreq = (freq) => {
        this.osc1.frequency.value = freq;
        this.osc2.frequency.value = freq;
    }

    stop = () => {
        const startTime = this.ctx.currentTime;
        this.triggerRelease();
        this.osc1.stop(startTime + this.release);
        this.osc2.stop(startTime + this.release);
    }

}