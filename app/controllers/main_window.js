init();

function init() {
	Alloy.Globals.toggleAI = $.ai.toggle;
	
	// menu
	
	var menu = Alloy.createController('sliding_menu', {
		items: [
			{ id: 'calendar', icon: '/images/icons/calendar.png', title: 'calendar' },
			{ id: 'new_event', icon: '/images/icons/event.png', title: 'new event' },
			{ id: 'notes', icon: '/images/icons/notes.png', title: 'notes' },
			{ id: 'results', icon: '/images/icons/results.png', title: 'results' },
			{ id: 'settings', icon: '/images/icons/settings.png', title: 'settings' }
		],
		callback: function(id) {
  			Alloy.Globals.PageManager.load(id);
		}
	});
  	
  	$.win.add(menu.getView());
  	
  	// load home page
  	
  	var container = $.container;
  	
  	container.bottom = Alloy.CFG.size_50; // height of the menu
  	
  	var pageManager = require('page_manager');
  	
	pageManager.init({
		container: container,
		onChange: onChange,
		defaultPage: 'calendar'
	});
		
	Alloy.Globals.PageManager = pageManager;
	
	if (OS_IOS) {
		// Add event notification on IOS
		Ti.App.iOS.addEventListener('notification', function(e) {
			var dialog = Ti.UI.createAlertDialog({ cancel: 1, buttonNames: ['Snooze', 'Dismiss'], message: e.alertBody, title: e.alertAction, data: e });
			dialog.addEventListener('click', function(e) {
				var notify = require('notify');
				if ( e.index == 0 ) {
					var snoozeData 	= {};
					
					snoozeData.name 		= e.source.data.alertBody;
					snoozeData.id 			= e.source.data.userInfo.id;
					snoozeData.playsound	= Ti.App.Properties.getBool('sound_enable', true);
					snoozeData.datetime		= new Date( new Date().getTime() + ( Ti.App.Properties.getInt('snooze', 5)*60000 ) );
					
					notify.register( snoozeData );
				} else {
					notify.unregister( e.source.data.userInfo.id );
				}
			});
			dialog.show();
		});
	} else {
		$.win.addEventListener('androidback', function(e) {
			if ( Ti.App.F_KeyboardShowing ) {
				// Default - Will hide keyboard
			} else {
				if (Alloy.Globals.PageManager.getCache().length > 1) {
					Alloy.Globals.PageManager.loadPrevious();
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
			}
		});
	}
}

function onChange(status, data) {
	if (status == 0) {
		$.ai.toggle(true);
	} else if (status == 2) {
		$.ai.toggle(false);
	}
}