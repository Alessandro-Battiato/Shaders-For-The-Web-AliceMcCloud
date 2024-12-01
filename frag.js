const frag = `

precision mediump float;

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float seed; // random point in space from javascript

varying vec2 v_texcoord;

${includes}

void main(void)
{
    // - 1.0 + 2.0 * inData.v_texcoord; this centers the circle
    vec2 uv = v_texcoord;

    // Find the distance between the mouse and points
    vec2 mouse = u_mouse / u_resolution; // we pick the mouse point, basically where the cursor is
    float dist = distance(uv, mouse); // 2 parameters, uv = where we are on the texture, mouse = where we are as in cursor or mouse
    float strength = smoothstep(0.5, 0.0, dist);

    // float hue = u_time * 0.02 + strength; activate this to see the "ball" to see the distance
    float hue = u_time * 0.02 + seed; // thanks to the seed, every time we reload the page, we get random colors!

    vec3 hsv1 = vec3(hue, 0.9, 0.85);
    vec3 hsv2 = vec3(hue + 0.07, 0.85, 0.75);
    
    vec3 rgb1 = hsv2rgb(hsv1);
    vec3 rgb2 = hsv2rgb(hsv2);
    
    vec4 color1 = vec4(rgb1, 1.0);
    vec4 color2 = vec4(rgb2, 1.0);
    
    // float f = step(0.5, length(uv)); // it's a simpler if statement, if it's below 0.5 in this case, it returns red, otherwise it returns blue, so you can see the "numbers" from 0 to 1 on the screen
    
    // float f = smoothstep(0.0, 0.5, uv.x); // this will make one color fade over the other instead of a direct detachment
    
    // float f = smoothstep(0.0, 2.0, uv.x + random(uv)); // parameters: minimum, maximum, smoothness
    
    // float f = smoothstep(0.0, 2.0, uv.x + noise(uv + time));
    
    // START: RANDOM NOISES BLENDED TOGETHER
    // float f = noise(uv * 3.0 + vec2(time, time * 0.5)); // the higher the number we multiply the uv with, the higher the noise we get
    // f += noise(uv * 5.0 + vec2(time * -1.0, time * -0.5));
    // f += noise(uv);
    
    // f = smoothstep(0.0, 3.0, f);
    // END: RANDOM NOISES BLENDED TOGETHER

    // Fractional brownian motion example WITHOUT using the functions
    // nfloat f = 0.5 * noise(2.0 * uv);
    // nf += 0.25 * noise(4.0 * uv);
    // f += 0.125 * noise(8.0 * uv);
    // f += 0.0625 * noise(16.0 * uv);
    // f += 0.0625 * noise(32.0 * uv);
    
    // float grain = mix(-0.1 * strength, 0.1 * strength, rand(uv)); // by introducing the strength, the grain effect will be stronger according to the mouse position, and weaker if the mouse is far away
    float grain = rand(100.0 * uv) * mix(0.2, 0.01, strength);

    // Make movement for fbm
    vec2 movement = vec2(u_time * 0.01, u_time * -0.01);
    movement *= rotation2d(u_time * 0.005);
    
    // Fractional brownian motion USING the official functions
    // float f = fbm(uv * 10); the cool blend-in effect but SCALED UP
    float f = fbm(uv + movement + seed); // the cool blend-in effect but ZOOMED IN, and thanks to the seed the pattern is slightly different each time we reload the page
    f *= 10.0;
    f += grain;
    f += u_time * 0.2;
    f = fract(f); // blend-in effect thanks to the time variable

    float gap = mix(0.5, 0.01, strength);
    float mixer = smoothstep(0.0, gap, f) - smoothstep(1.0 - gap, 1.0, f); // same as the strength, the closer the mouse, the stronger the gap

    vec4 color = mix(color1, color2, mixer);
    
    gl_FragColor = color;
}

`;
