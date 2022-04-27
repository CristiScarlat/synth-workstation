export default class ADSR {
    constructor(audioCtx, outputNode, attack=0, decay=0, sustain=1, release=0 ) {
        this.ctx = audioCtx;
        this.adsr = this.ctx.createGain();
        this.adsr.gain.value = 0;

        this.adsr.connect(outputNode);

        this.attack = attack;
        this.decay = decay;
        this.sustain = sustain;
        this.release = release;
    }

    getInputNode = () => {
        return this.adsr;
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
    }
}