init();

function init() {
	loadNav();
	
	if (OS_ANDROID) {
		$.winNotice.addEventListener('androidback', function(e) {
			if ( Ti.App.F_KeyboardShowing ) {
				// Default - Will hide keyboard
			} else {
				var dialog = Ti.UI.createAlertDialog({ cancel : 1, buttonNames : ['Yes', 'No'], message : 'Are you sure?', title : 'Quit?' });
				dialog.addEventListener('click', function(e) {
					if (e.index !== e.source.cancel) {
						var activity = Ti.Android.currentActivity;
						activity.finish();
					}
				});
				dialog.show();
			}
		});
	}
}

function loadNav() {
  	var title = Ti.UI.createView({ width: Ti.UI.SIZE, height: Ti.UI.SIZE, left: 0 });
	title.add( Ti.UI.createImageView({ image: '/images/icons/heart.png', width: Alloy.CFG.size_30, height: Alloy.CFG.size_30, left: Alloy.CFG.size_15 }) );
	title.add( Ti.UI.createLabel({ text: 'legal notice', font: { fontSize: Alloy.CFG.size_20, fontFamily: Alloy.CFG.font_DroidSans }, color: '#fff', left: Alloy.CFG.size_50 }) );
  	
  	$.nav.init({
		title: title
	});
}

function loadHomePage(e) {
	$.ai.toggle(true);
	
	Ti.App.Properties.setBool('agreement_agreed', true);
  	
  	Alloy.createController('main_window').getView().open();
  	
  	setTimeout(function() {
		$.winNotice.close();
	}, 200);
}