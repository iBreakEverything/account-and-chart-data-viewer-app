/**
 * Loads every script with the class load after the page was loaded.
 */
window.onload = function() {
	let scripts = document.getElementsByClassName("load");
	// Check for scripts that need to be called after page load
	if (scripts.length != 0) {
		for (let i = 0; i < scripts.length; i++) {
			if (scripts[i].src !== undefined) {
				// function we want to run
				let fctName = scripts[i].src.split('/').slice(-1).pop().split('.')[0].replace('-','_');
				// find object
				let fn = window[fctName];
				// is object a function?
				if (typeof fn === "function") fn();
			}
		}
	}
};
