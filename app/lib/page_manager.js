var Alloy = require('alloy'),
	UIManager,
	container,
	cache = [],
	onChange;

/*
args = {
	container: element,
 	defaultPage: '',
	onChange: function(status, params){
		status = 
		  - 0: start load
		  - 1: loading
		  - 2: load finish
		  - 3: view destroy
	}
}	
 * */
function init(args) {
	container = args.container;
	
	onChange = args.onChange || function() {};
  	
  	var oUIManager = require('ui_manager');
  	UIManager = new oUIManager({
		onLoad: UILoad,
		onDestroy: UIDestroy
	});
	
	args.defaultPage && load(args.defaultPage);
  	
  	Ti.API.log('Page Manager: initialized');
};

/*
 params = {
 	controller: exports, 
 	data: {}, 
 	isReset: false,
 	url: ''
 }
 
 controller may have the following functions
  - cleanup: called when window loose focus
  - reload: called when window focus again
  - unload: called when window closed
  - androidback: back event for android
 * */
function UILoad(params) {
	onChange(1, params); 

	// make page visible
	container.add( params.controller.getView() );
}

/*
 params = {
 	controller: exports,
 	url: ''
 }
 * */
function UIDestroy(params) {
	onChange(3, params);
	
  	container.remove( params.controller.getView() );
}

/*
 params:
  - url: the url of the page
  - data: data for that page
  - isReset: remove previous page or not, default is true
 * */
function load(url, data, isReset) {
	Ti.API.log('Page Manager: Load page ' + url + ': ' + JSON.stringify( data ));
	
	var params = {
		url: url,
		data: data,
		isReset: isReset
	};
	
  	// callback
  	
  	onChange(0, params);
	
	// cleanup previous page
	
	UIManager.set(params);
  	
  	// callback
  	
	onChange(2, params);
	
	Ti.API.log('Page Manager: Cached page: ' + UIManager.get().length);
};
exports.load = load;

/*
 params: 
  - count: number of revious pages will be removed
  - data: new data for current page
 * */
function loadPrevious(data, count) {
  	UIManager.setPrevious(data, count);
	
	Ti.API.log('Page Manager: Cached page: ' + UIManager.get().length);
};

function getCache(index) {
  	return UIManager.get(index); 
}

/*
 if an URL is offered, load that page and reset cache
 if not, reset cache
 * */
function reset(url, data) {
	if (url != null) {
		load(url, data, false);
		
		// remove all page except the last page : index -1
		UIManager.remove(-2, 0);
	} else {
		UIManager.reset();
	}
  	
  	Ti.API.log('Page Manager: Reset! Cached page: ' + UIManager.get().length);
}

//

exports.init = init;
exports.getCache = getCache;
exports.loadPrevious = loadPrevious;
exports.load = load;
exports.reset = reset;