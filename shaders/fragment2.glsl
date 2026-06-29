precision highp float;

uniform vec2 u_resolution;
uniform float u_time;

varying vec2 v_texcoord;

const float PI = 3.1415926535;
const float TWOPI = PI * 2.;

vec3 palette(float t) {
    vec3 c0 = vec3(0.95, 0.45, 0.65);
    vec3 c1 = vec3(0.95, 0.8, 0.45);
    vec3 c2 = vec3(0.05, 0.85, 0.45);
    vec3 c3 = vec3(0.95, 0.45, 0.65);

    t = fract(t);

    vec3 col = mix(c0, c1, smoothstep(0.0, 0.57, t));
    col = mix(col, c2, smoothstep(0.57, 0.93, t));
    col = mix(col, c3, smoothstep(0.93, 1., t));

    return col;
}

float ring(vec2 p) {
    float len = length(p) - 0.30;
    len *= length(p * p) - 0.95;
    float d = len * len * 16.;

    return 1. - d * d;
}

vec2 animation(vec2 p) {
    float t = u_time * 0.25;

    p.x += sin(p.x * 2. + t) * 0.3 -
           cos(p.y * 1. - t) * 0.4 -
           sin(p.x * 3. + t) * 0.2 +
           cos(p.y * 0.3 - t) * 0.05;
    
    p.y += sin(p.x * 5. + t) * 0.4 -
           cos(p.y * 8. - t) * 0.1 +
           sin(p.x * 4. + t) * 0.3 -
           cos(p.y * 6. - t) * 0.1;

    return p;
}

vec3 ring_color(vec2 p) {
    float d = ring(p);
    float angle = (atan(p.y, p.x) + PI) / TWOPI;
    angle += 0.03 * sin(u_time * 0.2);

    vec3 col = palette(angle);
    col *= smoothstep(0., 0.3, d);
    col += vec3(1., 0.85, 0.35) * pow(max(d, 0.), 4.) * 0.25;

    return col;
}


void main() {
    vec2 uv = v_texcoord * 0.5 + 0.5;

    uv = animation(uv);
    uv = animation(uv * 0.9);

    //uv *= 2.;
    //uv = fract(uv);

    vec3 color = vec3(ring(uv));
    color = ring_color(uv);
    color += vec3(0., 0., sin(u_time * 0.5)* 0.2 + 0.2);
    color *= 0.47;

    gl_FragColor = vec4(color, 1.0);
}