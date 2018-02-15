
console.log("");
console.log("     ___________    ___     ___    ___________    ___________    ___________"          );
console.log("    /  _____   /\\  /  /\\   /  /\\  /  _____   /\\  /___   ____/\\  /  _____   /\\"   );
console.log("   /  /\\___/  / / /  / /  /  / / /  /\\___/ _/ /  \\__/  /\\___\\/ /  /\\___/  / /"   );
console.log("  /  / /  /  / / /  / /  /  / / /  _____  /\\/      /  / /     /  / /  /  / /"         );
console.log(" /  /_/__/  / / /  /_/__/  / / /  /\\___/  /\\  ____/  /_/_    /  /_/__/  / /"         );
console.log("/_______    \\/ /__________/ / /__________/ / /__________/\\  /_______    \\/"         );
console.log("\\_______\\___/\\ \\__________\\/  \\__________\\/  \\__________\\/  \\_______\\___/\\");
console.log("         \\__\\/                                                       \\__\\/"        );
console.log(" >> By Jacob Langevin >> comfykernel@gmail.com >>", "cyan");

gelly.setCanvas("game-window");

gelly.makeGlobal;

gelly.clearColor(0.5, 0, 0.5);
gelly.clear();

var vbuff = gelly.newBuffer([-1.0, -1.0, 0.0,
			      1.0, -1.0, 0.0,
			      0.0,  1.0, 0.0 ],
			    Float32Array,
			    gelly.ARRAY_BUFFER,
			    gelly.STATIC_DRAW);

var ibuff = gelly.newBuffer([0, 1, 2],
			    Uint16Array,
			    gelly.ELEMENT_BUFFER,
			    gelly.STATIC_DRAW);

var vshad = gelly.newShader("\
#version 300 es\n\
\n\
layout(location = 0) in vec3 pos;\n\
                    out vec2 uv; \n\
\n\
void main() {\n\
  gl_Position = vec4(pos, 1.0);\n\
  uv          = pos.xy;        \n\
}", gelly.VERTEX_SHADER);

var fshad = gelly.newShader("\
#version 300 es\n\
\n\
precision mediump float;\n\
\n\
in  vec2 uv;  \n\
out vec4 frag;\n\
\n\
void main() {\n\
  frag=vec4(uv, 1.0, 1.0);\n\
}", gelly.FRAGMENT_SHADER);

var prog = gelly.newProgram([vshad, fshad]);
prog.use();

gelly.enableArrays([0]);

gelly.gl.vertexAttribPointer(0, 3, gelly.gl.FLOAT, false, 0, 0);

gelly.gl.drawElements(gelly.gl.TRIANGLES, 3, gelly.gl.UNSIGNED_SHORT, 0);
