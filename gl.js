var console = (function(o_console, d_element) {
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

window.console = console;

var gelly =  { // OpenGL Puns are the best
    setCanvas: function(id) {
	this.obj = document.getElementById(id);

	this.gl  = this.obj.getContext("webgl2");

	if(!this.gl) {
	    console.error("Failed to get a WebGL 2 Context");
	    return false;
	}

	return true;
    },

    clearColor: function(r, g, b) {
	this.gl.clearColor(r, g, b, 1.0);
    },

    clear: function() {
	this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    }
};
