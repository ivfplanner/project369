var aiTimeout,
	args = arguments[0] || {};

if (args.visible) {
	$.activityIndicator.show();
	$.ai.show();
}

exports.toggle = function(visible, message, timeout) {
	if (aiTimeout) {
		clearTimeout(aiTimeout);
		aiTimeout = null;
	}
	
	if (visible) {
		$.activityIndicator.message = message || 'Loading...';
		$.activityIndicator.show();
		$.ai.show();
		
		if (timeout) {
			aiTimeout = setTimeout(function(){
				var dialog = Ti.UI.createAlertDialog({
					buttonNames : ['OK'],
					message : 'Activity timeout',
					title : 'Error'
				});
				dialog.show(); 
			}, timeout);
		}
	} else {
		$.activityIndicator.hide();
		$.ai.hide();
	}
};

exports.unload = function() {
  	if (aiTimeout) {
		clearTimeout(aiTimeout);
		aiTimeout = null;
	}
};