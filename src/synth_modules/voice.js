import ADSR from "./adsr";

export default class Voice extends ADSR {

    constructor(audioCtx, outputNode, freq, type) {

        super(audioCtx, outputNode)
        this.ctx = audioCtx;
        this.freq = freq;
        
        this.osc1 = this.ctx.createOscillator();
        this.osc1.frequency.value = freq;
        this.osc1.type = type;
        this.osc1.start();
        this.osc1.connect(this.getInputNode());

        this.osc2 = this.ctx.createOscillator();
        this.osc2.frequency.value = freq;
        this.osc2.type = type;
        this.osc2.detune.value = 20;
        this.osc2.start();
        this.osc2.connect(this.getInputNode());       
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