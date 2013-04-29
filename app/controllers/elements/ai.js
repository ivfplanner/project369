var aiTimeout;

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
				dialog.addEventListener('click', function(e) {
					Alloy.Globals.WinManager.loadWindow('index', { isTimeout: true });
				});
				dialog.show(); 
			}, timeout);
		}
	} else {
		$.activityIndicator.hide();
		$.ai.hide();
	}
};
