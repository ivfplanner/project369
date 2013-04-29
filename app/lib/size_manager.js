var Alloy = require('alloy');

exports.init = function(sizes) {
	var cfg = Alloy.CFG,
		screenWidth =  Ti.Platform.displayCaps.platformWidth,
		screenHeight = Ti.Platform.displayCaps.platformHeight;
	
	if (OS_IOS) {
		screenHeight -= 20
		
		for(var i=0,j=sizes.length; i<j; i++){
		  	var num = sizes[i];
		  	
			cfg['size_' + (num > 0 ? num : '_' + num * -1)] = num;
		};
	} else {
		screenHeight -= Math.round((25 * Ti.Platform.displayCaps.dpi)/160);
		
		for(var i=0,j=sizes.length; i<j; i++){
		  	var num = sizes[i],
		  		temp = (num * 100) / 320,
		  		convert = Math.floor((screenWidth * temp) / 100);
		  		
			cfg['size_' + (num > 0 ? num : '_' + num * -1)] = convert;
		};
	};
	
	cfg.screenHeight = screenHeight;
	
	exports.convertSize = OS_IOS ? convertSize_ios : convertSize_android;
	
	Ti.API.log('Alloy.CFG: ' + JSON.stringify( cfg ));
}

function convertSize_ios(num) {
	var sizeName = 'size_' + (num > 0 ? num : '_' + num * -1);
	if (Alloy.CFG[sizeName] == null) {
		Alloy.CFG[sizeName] = num;
	}
	return num;
}

function convertSize_android(num) {
	var sizeName = 'size_' + (num > 0 ? num : '_' + num * -1);
	if (Alloy.CFG[sizeName] != null) {
		return Alloy.CFG[sizeName];
	} else {
		var temp = (num * 100) / 320,
	  		convert = Math.floor((Ti.Platform.displayCaps.platformWidth * temp) / 100);
	  		
		Alloy.CFG[sizeName] = convert;
		
		return convert;
	}
}