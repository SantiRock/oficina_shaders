async function loadShader(path) {
    const response = await fetch(path);
    return await response.text();
}

const [vertex, fragment] = await Promise.all([
    loadShader('./shaders/vertex.glsl'),
    loadShader('./shaders/fragment2.glsl')
]);

const canvas = document.getElementById('canvas');
const gl = canvas.getContext('webgl');

const vertices = [
    -1, 1., 0.,
    -1, -1., 0.,
    1., -1, 0.,
    1, 1., 0.
];

const indices = [3, 2, 1, 3, 1, 0];

const vertex_buffer = gl.createBuffer();

gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);

gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

const index_buffer = gl.createBuffer();

gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index_buffer);

gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

// Create and compile Shader programs

const vertShader = gl.createShader(gl.VERTEX_SHADER);

gl.shaderSource(vertShader, vertex);

gl.compileShader(vertShader);

const fragShader = gl.createShader(gl.FRAGMENT_SHADER);

gl.shaderSource(fragShader, fragment);

gl.compileShader(fragShader);

const shaderProgram = gl.createProgram();

gl.attachShader(shaderProgram, vertShader);

gl.attachShader(shaderProgram, fragShader);

gl.linkProgram(shaderProgram);

gl.useProgram(shaderProgram); 

// Associate the shader programs to buffer objects

gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);

gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index_buffer);

const coord = gl.getAttribLocation(shaderProgram, "a_position");

const u_time = gl.getUniformLocation(shaderProgram, 'u_time');

const u_resolution = gl.getUniformLocation(shaderProgram, 'u_resolution');

gl.vertexAttribPointer(coord, 3, gl.FLOAT, false, 0, 0);

gl.enableVertexAttribArray(coord);

gl.clearColor(0.0, 0.0, 0.0, 1.0);

gl.uniform2f(u_resolution, window.innerWidth, window.innerHeight);

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform2f(u_resolution, canvas.width, canvas.height);
}

window.addEventListener('resize', resize);
resize();

const startTime = performance.now();

function animate() {
    // Calcular el tiempo transcurrido
    let elapsedTime = (performance.now() - startTime) * 0.001; // Tiempo en segundos

    // Pasar el tiempo al shader
    gl.uniform1f(u_time, elapsedTime);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Dibujar el objeto
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index_buffer);
    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0); 

    requestAnimationFrame(animate);
}

animate();
