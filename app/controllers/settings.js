var anchor;

init();

function init() {
	// Set current setting 
	
	if ( OS_IOS ) {
		$.vibrate.parent.remove( $.vibrate );
	} else {
		if ( Ti.App.Properties.getBool('vibrate_enable', true) ) {
			$.lblVibrate.setText('On');
		} else {
			$.lblVibrate.setText('Off');
		}	
	}
	
	if ( Ti.App.Properties.getBool('sound_enable', true) ) {
		$.lblAlarm.setText('On');
	} else {
		$.lblAlarm.setText('Off');
	}
  	$.lblSnooze.setText(Ti.App.Properties.getInt('snooze', 5) + ' mins');
	
	loadNav();
}

function loadNav() {
  	var title = Ti.UI.createView({ width: Ti.UI.SIZE, height: Ti.UI.SIZE, left: 0 });
	title.add( Ti.UI.createImageView({ image: '/images/icons/settings.png', width: Alloy.CFG.size_30, height: Alloy.CFG.size_30, left: Alloy.CFG.size_15 }) );
	title.add( Ti.UI.createLabel({ text: 'settings', font: { fontSize: Alloy.CFG.size_20, fontFamily: 'DroidSans' }, color: '#fff', left: Alloy.CFG.size_50 }) );
  	
  	$.nav.init({
		title: title
	});
}

function settingsClicked(e) {
	var type = e.source.elementType;
	
	if (type == null) {
		return;
	}
	
	anchor = e.source.children[1];
	
	switch (type) {
		case 'alarm':
			showPicker('Alarm sound', [ 'On', 'Off' ], ['sound_enable'], [ true, false ]);
			break;
		
		case 'feedback':
			showEmailDialog();
			break;
			
		case 'snooze':
			showPicker('Snooze', [ '5 mins', '10 mins', '20 mins' ], ['snooze'], [ 5, 10, 20 ]);
			break;	
			
		case 'vibrate':
			showPicker('Vibrate', [ 'On', 'Off' ], ['vibrate_enable'], [ true, false ]);
			break;
	}
}

function showPicker(title, options, key, values) {
  	var opts = {
	  	title: title,
	  	options: options,
	  	key: key,
	  	values: values
	};
	
	var dialog = Ti.UI.createOptionDialog(opts);
	dialog.show();
	dialog.addEventListener('click', function(e) {
		if ( e.source.key[0] == 'snooze' ) {
			Ti.App.Properties.setInt( e.source.key[0], e.source.values[ e.index ] );
		} else {
			Ti.App.Properties.setBool( e.source.key[0], e.source.values[ e.index ] );
	  	}
	  	anchor.text = e.source.options[ e.index ];
	});
}

function showEmailDialog() {
	var emailDialog = Ti.UI.createEmailDialog({
		subject: 'IVF Planner feedback',
		toRecipients: [ 'info@ivfplanner.com' ],
		messageBody: '',
		html: true
	});
	
	emailDialog.open();
}
