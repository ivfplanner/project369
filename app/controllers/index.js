function init() {
	var winManager = require('window_manager');
	winManager.init({ controller: exports, view: $.index });
	Alloy.Globals.WinManager = winManager;
	
	if ( !Ti.App.Properties.getBool('agreement_agreed', false) ) {
		winManager.loadWindow('notice');		
	} else {
		loadHomepage();
	}
}

exports.reload = function(params) {
	if (Alloy.Globals.PageManager) {
		Alloy.Globals.PageManager.reloadPage(params.data);
	} else {
		loadHomepage();
	}
};

init();

function loadHomepage() {
	// menu
	
	var menu = Alloy.createController('sliding_menu', {
		items: [
			{ id: 'calendar', icon: '/images/icons/calendar.png', title: 'calendar' },
			{ id: 'new_event', icon: '/images/icons/event.png', title: 'new event' },
			{ id: '#', icon: '/images/icons/symptoms.png', title: 'symptoms' },
			{ id: '#', icon: '/images/icons/notes.png', title: 'notes' },
			{ id: '#', icon: '/images/icons/results.png', title: 'results' },
			{ id: '#', icon: '/images/icons/settings.png', title: 'settings' }
		],
		callback: function(id) {
			if ( id == '#' ) {
				alert(id);	
			} else {
				Alloy.Globals.PageManager.loadPage(id);				
			}
		}
	});
  	
  	$.index.add(menu.getView());
  	
  	// load home page
  	
  	var container = $.container;
  	
  	container.bottom = Alloy.CFG.size_42; // height of the menu
  	
  	var oPageManager = require('page_manager'),
		pageManager = new oPageManager({
			container: container,
			beforePageLoad: beforePageLoad,
			afterPageLoad: afterPageLoad
		});
		
	Alloy.Globals.PageManager = pageManager;
	
	//
	
	$.index.open();
	
	// bind back event
	if (OS_ANDROID) {
		$.index.addEventListener('android:back', function(e) {
			if ( Ti.App.F_KeyboardShowing ) {
				// Default - Will hide keyboard
			} else {
				var dialog = Ti.UI.createAlertDialog({ cancel: 1, buttonNames: ['Yes', 'No'], message: 'Are you sure?', title: 'Quit?' });
				dialog.addEventListener('click', function(e) {
					if (e.index !== e.source.cancel) {
						$.index.close();
					}
				});
				dialog.show();
			}
		});
	}
}

function beforePageLoad(url) {
  	Alloy.Globals.WinManager.toggleAI(true);
}

function afterPageLoad(url) {
  	Alloy.Globals.WinManager.toggleAI(false);
}