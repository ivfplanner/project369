// Get the Service and Service Intent we created in app.js
var service 		= Ti.Android.currentService,
	serviceIntent 	= service.getIntent(),
	serviceMessage 	= serviceIntent.getStringExtra('message'),
	serviceId 		= serviceIntent.getDoubleExtra('notifyid', 1),
	doVibrate 		= serviceIntent.getBooleanExtra('vibrate', true),
	playsound 		= serviceIntent.getBooleanExtra('playsound', true),
	notifyFlag 		= 'notify_' + serviceId;
	
if ( Ti.App.Properties.getString(notifyFlag) == 'delete' ) {
	Ti.API.info('===\n\t EVENT ' + serviceId + ' was deleted.' );
	Ti.Android.stopService(serviceIntent);
	Ti.App.Properties.removeProperty(notifyFlag);
	
} else if ( Ti.App.Properties.getString(notifyFlag) == 'start' ) {
	// If this is an interval Intent, don't execute the code the first time.
	// Execute it after the first interval runs. We use Ti.App.Properties
	// To keep track of this.
	Ti.App.Properties.setString(notifyFlag, 'register');
	Ti.API.info('===\n\t EVENT ' + serviceId + ' - will notify...' );
	
} else {
	Ti.App.Properties.removeProperty(notifyFlag);
	Ti.API.info('===\n\t EVENT ' + serviceId + ' - is notifying.' );
	
	var activity = Ti.Android.currentActivity;
	var intent = Ti.Android.createIntent({
	    	action: Ti.Android.ACTION_MAIN,
	    	className: 'com.ivfplanner.IvfPlannerActivity',
	        flags: Ti.Android.FLAG_ACTIVITY_SINGLE_TOP
	    });
	    intent.addCategory(Titanium.Android.CATEGORY_LAUNCHER);
	 
	    // Create the pending intent that will launch our app when selected
	var pending = Ti.Android.createPendingIntent({
	    activity : activity,
	    intent : intent,
	    type : Ti.Android.PENDING_INTENT_FOR_ACTIVITY,
	    flags : Titanium.Android.FLAG_ONE_SHOT | Titanium.Android.FLAG_UPDATE_CURRENT
	});
	
	var notifyData = {
	    contentIntent : pending,
	    contentTitle : 'IVF Planner',
	    contentText : serviceMessage,
	    tickerText : serviceMessage,
	    when : new Date().getTime(),
	    icon : Ti.App.Android.R.drawable.appicon,
	    flags : Titanium.Android.ACTION_DEFAULT | Titanium.Android.FLAG_AUTO_CANCEL | Titanium.Android.FLAG_SHOW_LIGHTS
	};
	
	if ( doVibrate ) {
		notifyData.defaults |= Titanium.Android.DEFAULT_VIBRATE;
	}
	
	if ( playsound ) {
		notifyData.defaults |= Titanium.Android.DEFAULT_SOUND;
	}
	 
	// Create the notification
	var notification = Ti.Android.createNotification( notifyData );
	
	Ti.Android.NotificationManager.notify( serviceId, notification );
		
	var dialog = Ti.UI.createAlertDialog({ cancel: 1, buttonNames: ['Snooze', 'Dismiss'], message: notifyData.contentText, title: notifyData.contentTitle, notifyid: serviceId });
	
	dialog.addEventListener('click', function(e) {
		if (e.index == 0) {
			var notify 	   = require('notify'),
				snoozeData = {};
			notify.unregister( parseInt( e.source.notifyid ) );
			snoozeData.name 		= e.source.message;
			snoozeData.id 			= e.source.notifyid;
			snoozeData.playsound	= Ti.App.Properties.getBool('sound_enable', true);
			snoozeData.vibrate 		= Ti.App.Properties.getBool('vibrate_enable', true);
			snoozeData.datetime		= new Date( new Date().getTime() + ( Ti.App.Properties.getInt('snooze', 5) * 60000 ) );
			notify.register( snoozeData );
		}
	});
	
	dialog.show();
	
	// Kill the service intent once it launches our notification.
	// You can skip this step if you want notifications to be constantly 
	// sent at the given interval.
	Ti.Android.stopService( serviceIntent );
} 

