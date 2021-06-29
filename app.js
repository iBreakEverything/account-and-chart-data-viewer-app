const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');
const url = require('url');

//Menu.setApplicationMenu(false); TODO uncomment at end of production

// Wait until the app is ready
app.once('ready', () => {
	// Create a new window
	window = new BrowserWindow({
		// Set the initial width to 800px
		width: 930,
		// Set the initial height to 650px
		height: 760,
		// Set the default background color of the window to match the CSS
		// background color of the page, this prevents any white flickering
		backgroundColor: "#4769AD",
		// Don't show the window until it's ready, this prevents any white flickering
		show: false,
		webPreferences: {
			nodeIntegration: true
		}
	});

	// Load a URL in the window to the local index.html path
	window.loadURL(url.format({
		pathname: path.join(__dirname, 'html/index.html'),
		protocol: 'file:',
		slashes: true
	}));

	// Show window when page is ready
	window.once('ready-to-show', () => {
		window.show()
	});
});
