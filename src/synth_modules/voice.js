export default class Voice {

    constructor(audioCtx, outputNode, freq, type) {
        this.ctx = audioCtx;
        this.freq = freq;
        this.adsr = this.ctx.createGain();
        this.adsr.gain.value = 0;
        this.osc1 = this.ctx.createOscillator();
        this.osc1.frequency.value = freq;
        this.osc1.type = type;
        this.osc1.start();
        this.osc1.connect(this.adsr);

        this.osc2 = this.ctx.createOscillator();
        this.osc2.frequency.value = freq;
        this.osc2.type = type;
        this.osc2.detune.value = 20;
        this.osc2.start();
        this.osc2.connect(this.adsr);

        this.adsr.connect(outputNode);

        this.attack = 0;
        this.decay = 0;
        this.release = 0;
        this.sustain = 1;
        
    }

    setFreq = (freq) => {
        this.osc1.frequency.value = freq;
        this.osc2.frequency.value = freq;
    }

    setEnvelope = (a,d,s,r) => {
        this.attack = a;
        this.decay = d;
        this.sustain = s;
        this.release = r;
    }

    envelope = () => {
        const startTime = this.ctx.currentTime;
        this.adsr.gain.setValueAtTime(0, startTime);
        this.adsr.gain.linearRampToValueAtTime(1, startTime + this.attack);
        this.adsr.gain.linearRampToValueAtTime(this.sustain, startTime + this.attack + this.decay);
    }

    triggerAttack = () => {
        this.envelope();
    }

    triggerRelease = () => {
        const startTime = this.ctx.currentTime;
        this.adsr.gain.linearRampToValueAtTime(0, startTime + this.release);
        this.osc1.stop(startTime + this.release);
        this.osc2.stop(startTime + this.release);
    }
}