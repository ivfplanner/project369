var aiTimeout,
	aiTimeout_2,
	args = arguments[0] || {};

$.ai.addEventListener('postlayout', postlayout);

function postlayout(e) {
  	$.ai.removeEventListener('postlayout', postlayout);
  	$.ai.isReady = true;
}

if (args.visible) {
	$.activityIndicator.show();
	$.ai.show();
}

exports.toggle = function(visible, message, timeout) {
	if (aiTimeout) {
		clearTimeout(aiTimeout);
		aiTimeout = null;
	}
	
	if (aiTimeout_2) {
		clearTimeout(aiTimeout_2);
		aiTimeout_2 = null;
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
		if ($.ai.isReady) {
			$.activityIndicator.hide();
			$.ai.hide();
		} else {
			aiTimeout_2 = setTimeout(function(){
				exports.toggle(false);
			}, 500);
		}
	}
};

exports.unload = function() {
  	if (aiTimeout) {
		clearTimeout(aiTimeout);
		aiTimeout = null;
	}
};