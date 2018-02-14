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

console.log(" ___________    ___     ___    ___________    ___________    ___________"         );
console.log("    /  _____   /\\  /  /\\   /  /\\  /  _____   /\\  /___   ____/\\  /  _____   /\\"  );
console.log("   /  /\\___/  / / /  / /  /  / / /  /\\___/ _/ /  \\__/  /\\___\\/ /  /\\___/  / /"  );
console.log("  /  / /  /  / / /  / /  /  / / /  _____  /\\/      /  / /     /  / /  /  / /"        );
console.log(" /  /_/__/  / / /  /_/__/  / / /  /\\___/  /\\  ____/  /_/_    /  /_/__/  / /"        );
console.log("/_______    \\/ /__________/ / /__________/ / /__________/\\  /_______    \\/"        );
console.log("\________\\___/\\ \\__________\\/  \\__________\\/  \\__________\\/  \\_______\\___/\\");
console.log("         \\__\\/                                                       \\__\\/"       );
