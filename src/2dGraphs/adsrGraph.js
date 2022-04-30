let canvas = document.getElementById("adsr-graph");
let ctx = canvas.getContext("2d");

const adsr = {
    attack: 0.1, 
    decay: 0, 
    sustain: 1, 
    release: 0.5
};

const drawGraphics = () => {
    console.log(20-adsr.attack*10, adsr.attack*10)
    ctx.beginPath()
    ctx.clearRect(0, 0, 300, 150);
    ctx.moveTo(40, 0);
    ctx.lineTo(20-adsr.attack*10, 150);
    ctx.stroke(); 
    ctx.moveTo((adsr.decay+1)*40, 150-adsr.sustain*150);
    ctx.lineTo(250, 150-adsr.sustain*150);
    ctx.stroke();
    ctx.moveTo(40, 0);
    ctx.lineTo((adsr.decay+1)*40, 150-adsr.sustain*150);
    ctx.stroke(); 
    ctx.moveTo(250, 150-adsr.sustain*150);
    ctx.lineTo(250+(adsr.release*10), 150);
    ctx.stroke();  
    
}

export const initADSRGraph = () => {
    canvas = document.getElementById("adsr-graph");
    ctx = canvas.getContext("2d");
    ctx.strokeStyle = "#0d6efd";
    ctx.moveTo(40, 0);
    ctx.lineTo(20-adsr.attack*10, 150);
    ctx.stroke(); 
    ctx.moveTo((adsr.decay+1)*40, 150-adsr.sustain*150);
    ctx.lineTo(250, 150-adsr.sustain*150);
    ctx.stroke();
    ctx.moveTo(40, 0);
    ctx.lineTo((adsr.decay+1)*40, 150-adsr.sustain*150);
    ctx.stroke(); 
    ctx.moveTo(250, 150-adsr.sustain*150);
    ctx.lineTo(250+adsr.release, 150);
    ctx.stroke();  
}

export const setADSRGraph = (value, param) => {
    adsr[param] = parseFloat(value);
    window.requestAnimationFrame(drawGraphics);
}
