

var world = {
    chunks : [],

    dimensions : {
	chunk  : {
	    width  : 16,
	    height : 16,
	    depth  : 16
	},

	width  : 1,
	height : 1,
	depth  : 1
    },

    newChunk : function(PX, PY, PZ) {
	var _out = {
	    data : [],

	    buffers : {
		
	    }
	};

	var width  = this.dimensions.chunk.width;
	var height = this.dimensions.chunk.height;
	var depth  = this.dimensions.chunk.depth;

	var vertices = [],
	    indices  = [],
	    uvs      = [];

	for(var i = 0; i < 2; ++i) {
	    var index = vertices.length;
	    
	    vertices.push(i);
	    vertices.push(0);
	    vertices.push(0);

	    vertices.push(i + 1);
	    vertices.push(0);
	    vertices.push(0);

	    vertices.push(i + 1);
	    vertices.push(0);
	    vertices.push(0 + 1);

	    vertices.push(i);
	    vertices.push(0);
	    vertices.push(0 + 1);

	    uvs.push(0);
	    uvs.push(0);
	    
	    uvs.push(1);
	    uvs.push(0);
	    
	    uvs.push(1);
	    uvs.push(1);

	    uvs.push(0);
	    uvs.push(1);

	    indices.push(index);
	    indices.push(index + 1);
	    indices.push(index + 2);
	    
	    indices.push(index + 2);
	    indices.push(index + 3);
	    indices.push(index);
	}

	console.log(vertices.length);
	
	_out.buffers.vertex = gelly.newBuffer(vertices, Float32Array,
					      gelly.ARRAY_BUFFER,
					      gelly.STATIC_DRAW);

	_out.buffers.uv = gelly.newBuffer(uvs, Float32Array,
					  gelly.ARRAY_BUFFER,
					  gelly.STATIC_DRAW);

	_out.buffers.index = gelly.newBuffer(indices, Uint32Array,
					     gelly.ELEMENT_BUFFER,
					     gelly.STATIC_DRAW);
	
	_out.buffers.count = indices.length;

	this.chunks.push(_out);

	return _out;
    },

    genWorld : function() {
	for(var i = 0; i < this.dimensions.width; ++i) {
	    for(var j = 0; j < this.dimensions.height; ++j) {
		for(var k = 0; k < this.dimensions.depth; ++k) {
		    this.newChunk(i * this.dimensions.chunk.width,
				  j * this.dimensions.chunk.height,
				  k * this.dimensions.chunk.depth);
		}
	    }
	}
    }
};



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

gelly.gl.enable   (gelly.gl.DEPTH_TEST);
gelly.gl.depthFunc(gelly.gl.LESS);

gelly.gl.enable   (gelly.gl.CULL_FACE);

world.genWorld();
    
var vbuff = gelly.newBuffer([0.0, 0.0, 0.0,
			     0.0, 1.0, 0.0,
			     1.0, 0.0, 0.0 ],
			    Float32Array,
			    gelly.ARRAY_BUFFER,
			    gelly.STATIC_DRAW);

var ubuff = gelly.newBuffer([0.0, 0.0,
			     0.0, 1.0,
			     1.0, 0.0 ],
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
layout(location = 1) in vec2 iuv;\n\
                    out vec2 uv; \n\
uniform mat4 PVM;\n\
\n\
void main() {\n\
  gl_Position = PVM*vec4(pos, 1.0);\n\
  uv          = iuv;               \n\
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

var PVM = mat4.create();
var P   = mat4.create();
var V   = mat4.create();
var M   = mat4.create();

mat4.perspective(P, radians(90), gelly.aspect, 0.1, 500.0);

mat4.translate  (V, V, vec3.fromValues(0, 0, -2));

mat4.mul(PVM, PVM, P);
mat4.mul(PVM, PVM, V);
mat4.mul(PVM, PVM, M);

var cam = {
    rotation : {
	x : 0,
	y : 0
    },

    position : {
	x : 0,
	y : 0,
	z : 2
    }
}

var mpos = gelly.gl.getUniformLocation(prog.name, "PVM");

window.addEventListener("resize", function() {
    mat4.identity(P);
    mat4.perspective(P, radians(90), gelly.aspect, 0.1, 500.0);
}, true);

var oldTime = 0;
var newTime = Date.now();
var delta   = newTime - oldTime;

gelly.enableArrays([0, 1]);

function main() {
    oldTime = newTime;
    newTime = Date.now();
    delta = (newTime - oldTime) / 100;
    
    cam.rotation.x += (gelly.mouse.movement.y / 2);
    cam.rotation.y += (gelly.mouse.movement.x / 2);

    if(gelly.key['w']) {
	cam.position.x -= V[2]  * delta;
	cam.position.y -= V[6]  * delta;
	cam.position.z -= V[10] * delta;
    }

    if(gelly.key['s']) {
	cam.position.x += V[2]  * delta;
	cam.position.y += V[6]  * delta;
	cam.position.z += V[10] * delta;
    }
    
    if(gelly.key[' ']) {
	cam.position.x += V[1]  * delta;
	cam.position.y += V[5]  * delta;
	cam.position.z += V[9]  * delta;
    }

    if(gelly.key['Control']) {
	cam.position.x -= V[1]  * delta;
	cam.position.y -= V[5]  * delta;
	cam.position.z -= V[9]  * delta;
    }
    
    if(gelly.key['d']) {
	cam.position.x += V[0]  * delta;
	cam.position.y += V[4]  * delta;
	cam.position.z += V[8]  * delta;
    }

    if(gelly.key['a']) {
	cam.position.x -= V[0]  * delta;
	cam.position.y -= V[4]  * delta;
	cam.position.z -= V[8]  * delta;
    }
    
    mat4.identity(V);

    mat4.rotateX  (V, V, radians(cam.rotation.x));
    mat4.rotateY  (V, V, radians(cam.rotation.y));

    mat4.translate(V, V, vec3.fromValues(-cam.position.x,
					 -cam.position.y,
					 -cam.position.z));

    mat4.copy(PVM, P);
    mat4.mul(PVM, PVM, V);
    mat4.mul(PVM, PVM, M);
    
    gelly.clear();
   
    vbuff.bind();
    gelly.gl.vertexAttribPointer(0, 3, gelly.gl.FLOAT, false, 0, 0);
    
    ubuff.bind();
    gelly.gl.vertexAttribPointer(1, 2, gelly.gl.FLOAT, false, 0, 0);

    gelly.gl.uniformMatrix4fv(mpos, false, PVM);

    ibuff.bind();
    gelly.gl.drawElements(gelly.gl.TRIANGLES, 3, gelly.gl.UNSIGNED_SHORT, 0);

    for(var i=0; i<world.chunks.length; ++i) {
	world.chunks[i].buffers.vertex.bind();
	gelly.gl.vertexAttribPointer(0, 3, gelly.gl.FLOAT, false, 0, 0);

	world.chunks[i].buffers.uv.bind();
	gelly.gl.vertexAttribPointer(1, 2, gelly.gl.FLOAT, false, 0, 0);
	
	world.chunks[i].buffers.index.bind();
	gelly.gl.drawElements(gelly.gl.TRIANGLES, world.chunks[i].buffers.count,
			      gelly.gl.UNSIGNED_INT, 0);
    }
    
    gelly.mouse.movement.x = 0;
    gelly.mouse.movement.y = 0;
    
    requestAnimationFrame(main);
}

requestAnimationFrame(main);
