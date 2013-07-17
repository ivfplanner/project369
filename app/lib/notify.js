// var sound = Titanium.Media.createSound();
// Titanium.Media.vibrate();
var NotifyService = null;

function iosInit() {
	NotifyService = require('bencoding.localnotify');
}

exports.init = function() {
	if( OS_IOS ) {
		iosInit();
	}
};

exports.register = function(event) {
	var d = moment(event.datetime);

	if( OS_IOS ) {
		var notifyData = {
			alertBody: 		event.name,
			alertAction:	'IVF Planner',
			userInfo:		{ id: event.id },
			date:			d.toDate() 			
		};
		
		if ( event.playsound ) {
			notifyData.sound = 'alarm.caf';
		}	
		
		if ( !NotifyService ) {
			iosInit();
		}
		
		NotifyService.scheduleLocalNotification( notifyData );
	} else {
		// OS_ANDROID
	  	var now 	 = new Date().getTime(),
	  		future   = d.toDate().getTime(),
	  		interval = future - now,
	  		intent   = Ti.Android.createServiceIntent({
	        	url : 'notify_service.js'
	    	});
	    	
	   	if ( interval <= 0 ) {
	   		interval = 500;
	   	}
	    	
	    intent.putExtra( 'message', event.name );
	    intent.putExtra( 'vibrate', event.vibrate );
	    intent.putExtra( 'playsound', event.playsound );
	    intent.putExtra( 'notifyid', event.id );
	    
	    if ( interval ) {
    		intent.putExtra( 'interval', interval );
	    }
	    
	    Ti.API.info('===EVENT ' + event.id + ' is registerd.' );
	    Ti.App.Properties.setString('notify_' + event.id, 'start');
	    Ti.Android.startService( intent );
	}
};

exports.unregister = function(eventID) {
	if( OS_IOS ) {
		if ( !NotifyService ) {
			iosInit();
		}
		
		NotifyService.cancelLocalNotification(eventID);
	} else {
		Ti.API.info( '===unregister EVENT: ' + eventID );
		Ti.App.Properties.setString('notify_' + eventID, 'delete');
	}
};