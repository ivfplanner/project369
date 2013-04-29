var Alloy = require('alloy');

/*
args = {
	container: element,
 	defaultPage: '',
	beforePageLoad: function(pageURL){},
	afterPageLoad: function(pageURL){}
}	
 * */
var Page = function(args) {
  	this.container = args.container;
  	this.beforePageLoad = args.beforePageLoad;
  	this.afterPageLoad = args.afterPageLoad;
  	this.cache = [];
  	
  	args.defaultPage && this.loadPage(args.defaultPage);
};

Page.prototype.loadPage = function(url, data, isResetPages) {
	
  	// callback
  	
  	this.beforePageLoad && this.beforePageLoad(url);
	
	// cleanup previous page
	
	var len = this.cache.length;
	
	if (len) {
		var prevPage = this.cache[len - 1];
		prevPage.cleanup && prevPage.cleanup();
	}
	
	// load new page
	
	var page = Alloy.createController(url, data);
	this.container.add(page.getView());
	
	// remove previous page's views
	
	if (len && isResetPages != false) {
		for (var i = len - 1; i >= 0; i--){
		  	this.container.remove(this.cache[i].getView());
		};
		this.cache.length = 0;
	}
	
	// cache new page
	
	this.cache.push(page);
  	
  	// callback
  	
	this.afterPageLoad && this.afterPageLoad(url);
	
};

/*
 params: 
  - count: number of revious pages will be removed
  - data: new data for current page
 * */
Page.prototype.loadPreviousPage = function(count, data) {
  	var cache = this.cache;
	
	if (cache.length == 0) {
		return;
	}
	
	var len = cache.length - 1,
		container = this.container;

	for (var i = len, ii = len - count; i > ii; i--) {
	  	container.remove(cache[i].getView());
	  	
	  	cache.splice(i, 1);
	};
	
	if (cache.length) {
		var prev = cache[cache.length - 1];
		prev.reload && prev.reload(data);
	}
};

Page.prototype.reloadPage = function(data) {
  	var cache = this.cache;
  	if (cache.length) {
		var page = cache[cache.length - 1];
		page.reload && page.reload(data);
	}
};

module.exports = Page;