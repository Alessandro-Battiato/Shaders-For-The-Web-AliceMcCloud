const canvas = document.createElement("canvas");
const sandbox = new GlslCanvas(canvas);

document.body.appendChild(canvas);

const sizer = function () {
    const ww = window.innerWidth;
    const wh = window.innerHeight;
    const dpi = window.devicePixelRatio;

    const square = Math.max(ww, wh);

    canvas.width = square * dpi;
    canvas.height = square * dpi;
    canvas.style.width = square + "px";
    canvas.style.height = square + "px";
};

sizer();
window.addEventListener("resize", function () {
    sizer();
});

sandbox.load(frag);
sandbox.setUniform("seed", Math.random()); // every single time we load this js, this will generate a random number that we pass to the shaders as to bypass the limitations of GLSL of not having real randomness;
