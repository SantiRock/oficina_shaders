attribute vec3 a_position;
varying vec2 v_texcoord;

void main(void) {
    v_texcoord = a_position.xy;

    gl_Position = vec4(a_position, 1.0);
}