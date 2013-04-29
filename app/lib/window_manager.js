var Alloy = require('alloy');

var cache = [], // windows cache, main window is not stored here
	mainWindow;

/*
 params = {
 	controller: exports // index controller,
 	view: $.index
 }
 * */
exports.init = function(params) {
	mainWindow = params.controller;
	
	// attach AI to window
	attachAI(mainWindow, params.view);
};

/*
 params:
  - url: the url of the window
  - data: data for that window
  - isResetWins: remove previous windows or not, default is true
 * */
exports.loadWindow = function(url, data, isResetWins){
	Ti.API.log('Window Manager: Load window ' + url + ': ' + JSON.stringify( data ));
	
	if (url != 'index') {
		// hide AI before load new window
		toggleAI(false);
	
		// load new window
		var page = Alloy.createController(url, data);

		// attach AI to window
		attachAI(page);

		// make window visible
		page.getView().open();
		
		// remove previous windows
		if (isResetWins != false) {
			removePreviousWindows();
		}
		
		// cached new window
		cache.push(page);
	} else {
		removePreviousWindows();
		
		mainWindow.reload(data);
	}
	
	Ti.API.log('Window Manager: Cached window: ' + cache.length);
};

function removePreviousWindows() {
	if (cache.length) {
		for (var i = cache.length - 1; i >= 0; i--){
		  	closeWindow(cache[i]);
		};
		cache.length = 0;
	}
}

function closeWindow(objCache) {
	var win = objCache;
  	win.unload && win.unload();
  	win.getView().close();
}

/*
 params: 
  - count: number of previous wins will be removed
  - data: new data for current win, if data != null, the reload function of current win will be called
 * */
exports.loadPreviousWindow = function(count, data){
	var start = cache.length - 1,
		end = start - count;
	
	if (start < 0 || end < -1) {
		return;
	}
	
	for (var i = start; i > end; i--){
		closeWindow(cache[i]);
	  	cache.splice(i, 1);
	};
	
	if (cache.length) {
		var prev = cache[cache.length - 1];
		prev.reload && prev.reload(data);
	} else {
		mainWindow.reload(data);
	}
	
	Ti.API.log('Window Manager: Cached window: ' + cache.length);
};

exports.reloadWindow = function(data) {
  	if (cache.length) {
		var current = cache[cache.length - 1];
		current.reload && current.reload(data);
	}
}

exports.currentWindow = function() {
	if ( cache.length ) {
		return cache[cache.length - 1].getView();
	}
	
	return null;
}

function attachAI(controller, view) {
  	var ai = Alloy.createController('/elements/ai');
  		
	( view || controller.getView() ).add( ai.getView() );
	
	controller.ai = ai;
}

function toggleAI(visible, message, timeout) {
	if (visible) {
		// show the AI of current window
		if (cache.length) {
			cache[cache.length - 1].ai.toggle(true, message, timeout);
		} else {
			mainWindow.ai.toggle(true, message, timeout);
		}
	} else {
		// hide the AI of all window
		for (var i = cache.length - 1; i >= 0; i--){
		  	cache[i].ai.toggle(false, message, timeout);
		};
		mainWindow.ai.toggle(false, message, timeout);
	}
}
exports.toggleAI = toggleAI;