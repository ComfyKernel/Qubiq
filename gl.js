var __console = (function(o_console, d_element) {
    return {
	log   : function(message, color) {
	    o_console.log(message);

	    var colstr = "--terminal-color-";
	    
	    if(color) {
		colstr += color;
	    }

	    d_element.innerHTML += "<span style='color: var(" + colstr + ")'>"
		                 + message + "</span><br />";
	},

	info  : function(message, color) {
	    o_console.info(message);

	    var colstr = "--terminal-color-";

	    d_element.innerHTML += "<span style='color: var(" + colstr + "bright-cyan" + ")'>"
		                 + "[INFO] </span>";
	    
	    if(color) {
		colstr += color;
	    }

	    d_element.innerHTML += "<span style='color: var(" + colstr + ")'>"
		                 + message + "</span><br />";
	},

	warn  : function(message, color) {
	    o_console.warn(message);

	    var colstr = "--terminal-color-";

	    d_element.innerHTML += "<span style='color: var(" + colstr + "bright-yellow" + ")'>"
		                 + "[WARNING] </span>";
	    
	    if(color) {
		colstr += color;
	    }

	    d_element.innerHTML += "<span style='color: var(" + colstr + ")'>"
		                 + message + "</span><br />";
	},

	error : function(message, color) {
	    o_console.error(message);

	    var colstr = "--terminal-color-";

	    d_element.innerHTML += "<span style='color: var(" + colstr + "bright-red" + ")'>"
		                 + "[ERROR] </span>";
	    
	    if(color) {
		colstr += color;
	    }

	    d_element.innerHTML += "<span style='color: var(" + colstr + ")'>"
		                 + message + "</span><br />";
	}
    };
}(window.console, document.getElementById("dev-console")));

window.console = __console;

function radians(degs) {
    return degs * (Math.PI / 180);
}

function degrees(rads) {
    return rads * (180 / Math.PI);
}

var gelly =  { // OpenGL Puns are the best
    setCanvas: function(id) {
	this.obj = document.getElementById(id);

	this.gl  = this.obj.getContext("webgl2");

	if(!this.gl) {
	    console.error("Failed to get a WebGL 2 Context");
	    return false;
	}

	this.obj.addEventListener("mousedown", function() {
	    this.requestPointerLock();
	}, true);

	this.ARRAY_BUFFER    = this.gl.ARRAY_BUFFER;
	this.ELEMENT_BUFFER  = this.gl.ELEMENT_ARRAY_BUFFER;

	this.STATIC_DRAW     = this.gl.STATIC_DRAW;
	this.DYNAMIC_DRAW    = this.gl.DYNAMIC_DRAW;

	this.VERTEX_SHADER   = this.gl.VERTEX_SHADER;
	this.FRAGMENT_SHADER = this.gl.FRAGMENT_SHADER;

	gelly.obj.width  = gelly.obj.clientWidth;
	gelly.obj.height = gelly.obj.clientHeight;
	gelly.gl.viewport(0, 0, gelly.obj.width, gelly.obj.height);

	this.aspect = gelly.obj.width / gelly.obj.height;

	this.mouse = {
	    x : 0,
	    y : 0,

	    movement : {
		x : 0,
		y : 0
	    }
	};

	this.key = [];

	this.obj.addEventListener("mousemove", function(event) {
	    gelly.mouse.x = event.pageX;
	    gelly.mouse.y = event.pageY;

	    gelly.mouse.movement.x = event.movementX;
	    gelly.mouse.movement.y = event.movementY;
	}, true);
	
	this.obj.addEventListener("keydown", function(event) {
	    gelly.key[event.key] = true;
	}, false);

	this.obj.addEventListener("keyup", function(event) {
	    gelly.key[event.key] = false;
	}, false);

	return true;
    },

    clearColor: function(r, g, b) {
	this.gl.clearColor(r, g, b, 1.0);
    },

    clear: function() {
	this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    },

    newBuffer: function(data, data_type, buffer_type, draw_type) {	
	var _out = {
	    name       : gelly.gl.createBuffer(),

	    dataType   : data_type,
	    bufferType : buffer_type,
	    drawType   : draw_type,

	    bind          : function() {
		gelly.gl.bindBuffer(this.bufferType, this.name);
	    },

	    destroy       : function() {
		gelly.gl.deleteBuffer(this.name);

		delete this.name;
		
		delete this.dataType;
		delete this.bufferType;
		delete this.drawType;

		delete this.bind;
		delete this.bufferData;
		delete this.bufferSubData;
	    },

	    bufferData    : function(b_data) {
		this.bind();
		gelly.gl.bufferData(this.bufferType,
				    new this.dataType(b_data), this.drawType);
	    },

	    bufferSubData : function(b_s_data, offset) {
		this.bind();
		gelly.gl.bufferSubData(this.bufferType, offset,
				       new this.dataType(b_s_data));
	    }
	};

	_out.bufferData(data);

	return _out;
    },

    newShader: function(data, s_type) {
	var _out = {
	    name : gelly.gl.createShader(s_type),

	    shaderType : s_type,

	    source: function(text) {
		gelly.gl.shaderSource(this.name, text);
	    },

	    compile: function() {
		gelly.gl.compileShader(this.name);

		if(!gelly.gl.getShaderParameter(this.name, gelly.gl.COMPILE_STATUS)) {
		    console.warn("Failed to compile shader!");
		    console.info(gelly.gl.getShaderInfoLog(this.name));
		}
	    },

	    destroy: function() {
		gelly.gl.deleteShader(this.name);

		delete this.name
		
		delete this.shaderType;

		delete this.source;
		delete this.compile;
	    }
	};

	_out.source (data);
	_out.compile();

	return _out;
    },

    newProgram: function(shaders) {
	var _out = {
	    name : gelly.gl.createProgram(),

	    attach: function(shaders) {
		if(!shaders.length) {
		    gelly.gl.attachShader(this.name, shaders.name);
		    return;
		}

		for(var i=0; i<shaders.length; ++i) {
		    gelly.gl.attachShader(this.name, shaders[i].name);
		}
	    },

	    link: function() {
		gelly.gl.linkProgram(this.name);

		if(!gelly.gl.getProgramParameter(this.name, gelly.gl.LINK_STATUS)) {
		    console.warn("Failed to link shader program!");
		    console.info(gelly.gl.getProgramInfoLog(this.name));
		}
	    },

	    use: function() {
		gelly.gl.useProgram(this.name);
	    }
	};

	_out.attach(shaders);
	_out.link  ();
	
	return _out;
    },

    enableArrays: function(arrays) {
	for(var i=0; i<arrays.length; ++i) {
	    this.gl.enableVertexAttribArray(arrays[i]);
	}
    },

    disableArrays: function(arrays) {
	for(var i=0; i<arrays.length; ++i) {
	    this.gl.disableVertexAttribArray(arrays[i]);
	}
    },

    makeGlobal: function() {
	gl = this.gl;
    }
};


window.addEventListener("resize", function() {
    gelly.obj.width  = gelly.obj.clientWidth;
    gelly.obj.height = gelly.obj.clientHeight;
    gelly.gl.viewport(0, 0, gelly.obj.width, gelly.obj.height);

    gelly.aspect = gelly.obj.width / gelly.obj.height;
}, true);
