var cacheData = arguments[0],
	moment = require('moment'), //require('alloy/moment'); // built-ins moment.js is just v 1.7;
	notify = require('notify'),
	vars = {},
	events = Alloy.createCollection('events');

init();

function init() {
	// Create notification
	notify.init();
	
	var time = new Date();
	
	if ( cacheData.eventId ) {
		events.fetch({ query:'SELECT * FROM events WHERE id = "' + cacheData.eventId + '"' });
  		vars.eventData = events.toJSON()[0];
  		cacheData.type = vars.eventData.type;
  		
  		if ( vars.eventData.type == 'medication' ) {
  			// Dosage
			$.txtDosage.value = vars.eventData.dosage;
			
			// Configure name
  			cacheData.name = vars.eventData.name;
  			
  		} else {
  			$.txtDoctorsName.value = vars.eventData.doctor;
  		}
  		
  		if ( !cacheData.selectedDates ) {
  			cacheData.selectedDates = vars.eventData.dates.split(',');
  		}
		
		time = moment(vars.eventData.time).toDate();		
	}
	
	if ( cacheData.type == 'medication' ) {
		$.appointmentBlock.parent.remove( $.appointmentBlock );
		
		$.subTitle.text = 'Configure: ' + cacheData.name;
	} else {
		$.medicationBlock.parent.remove( $.medicationBlock );
		
		$.subTitle.text = 'Set your appointment';
	}
	
	loadNav();
	
	loadTime( time );
	
	loadDates( cacheData.selectedDates );
}

function loadNav() {
  	var title = Ti.UI.createView({ width: Ti.UI.SIZE, height: Ti.UI.SIZE, left: 0 });
	title.add( Ti.UI.createImageView({ image: '/images/icons/event.png', width: Alloy.CFG.size_30, height: Alloy.CFG.size_30, left: Alloy.CFG.size_15 }) );
	title.add( Ti.UI.createLabel({ text: (cacheData.eventId ? 'edit ' : 'new ') + cacheData.type, font: { fontSize: Alloy.CFG.size_20, fontFamily: Alloy.CFG.font_DroidSans }, color: '#fff', left: Alloy.CFG.size_50 }) );
	
  	$.nav.init({
		title: title,
		right: {
			icon: '/images/icons/back.png',
			callback: function() {
				hideKeyboard();
				setTimeout(function() {
				  	Alloy.Globals.PageManager.loadPrevious();
				}, 200);
			}
		}
	});
}

function loadTime(date) {
	$.lblTime.value = date;
  	$.lblTime.text  = moment(date).format('h:mm a');
}

function loadDates(selectedDates) {
  	for(var i = 0, ii = selectedDates.length; i < ii; i++){
	  	var date = moment(parseInt( selectedDates[i] )).format('YYYY MMM DD');
	  	$.vDates.add( Ti.UI.createLabel({ text: date, font: { fontSize: Alloy.CFG.size_12, fontFamily: Alloy.CFG.font_DroidSans }, color: '#666', width: Alloy.CFG.size_78, left: i%3 ? Alloy.CFG.size_10 : 0 }) );
	};
}

function changeDates(e) {
  	if ( cacheData.eventId ) {
  		Alloy.Globals.PageManager.load('new_event_dates', cacheData, false);
	} else {
		Alloy.Globals.PageManager.loadPrevious();		
	}
}

function changeTime(e) {
	hideKeyboard();
	
	if (OS_IOS) {
		var timePicker = Alloy.createController('elements/time_picker', { 
			value: e.source.value,
			done: function(value) {
				loadTime(value);
				hidePicker();
			},
			cancel: hidePicker
		}).getView();
	
		$.container.add(timePicker);
		
		vars.timePicker = timePicker;
	} else {
		Ti.UI.createPicker({ type : Ti.UI.PICKER_TYPE_TIME }).showTimePickerDialog({
			value: e.source.value,
			callback: function(e) {
				if (e.cancel) {
					
				} else {
					loadTime(e.value);
				}
			}
		}); 
	}
}

function hidePicker() {
  	$.container.remove(vars.timePicker);
  	vars.timePicker = null;
}

function deleteEvent(e) {
	if ( cacheData.eventId ) {
	  	events.get( cacheData.eventId ).destroy();
	  	// Remove notification 
	  	deleteNotification( cacheData.eventId );
	}
	
	Alloy.Globals.PageManager.load('calendar');
}

function saveEvent(e) {
	// Prepare data
	var time = moment($.lblTime.value).format('YYYY-MM-DD HH:mm:ss'),
		validData = false,
		eventData = {
			type	: cacheData.type,
			dates	: cacheData.selectedDates.toString(),
			time	: time
		};

	// If update event
  	if ( cacheData.eventId ) {
  		events.fetch({ query:'SELECT * FROM events WHERE id = "'+ cacheData.eventId +'"' });
  		var eventModel = events.get( cacheData.eventId ),
  			eventModelData = eventModel.toJSON();
  			
  		if ( !$.txtDoctorsName.value && cacheData.type == 'appointment' ) {
  			alert( 'Doctor name can not be blank' );
			validData = false;
  		} else {
  			if ( cacheData.type == 'medication' ) {
				eventData.name   = cacheData.name;
				eventData.dosage = $.txtDosage.value;
			} else {
				eventData.doctor = $.txtDoctorsName.value;
			}
			
			eventModel.set( eventData );
			eventModel.save();
			
			// Save exist notification with event id
			saveNotification( eventData, cacheData.eventId );
			
			validData = true;	
  		}
	// If add new event
  	} else {
  		if ( !$.txtDoctorsName.value && cacheData.type == 'appointment' ) {
  			alert( 'Doctor name can not be blank' );
			validData = false;
  		} else {
  			// If add new medication
  			if ( cacheData.type == 'medication' ) {
  				eventData.name = cacheData.name;
  				eventData.dosage = $.txtDosage.value;
  			// else add new appointment
  			} else {
  				eventData.doctor = $.txtDoctorsName.value;
  			}
  			
  			Alloy.createModel( 'events', eventData ).save();
			
			// Save new notification
			saveNotification( eventData );
			
			validData = true;
  		}
  	}
  	
  	if ( validData ) {
  		Alloy.Globals.PageManager.load('calendar');
  	}
}

function saveNotification( data, id ) {
	var eventData;	
	// 1. Get id of events - if update data.id = id else add new data.id = fetch id from database
	if ( id ) {
		data.id = id;
		
		// 2. Delete old notification and create new one
		notify.unregister( data.id );
	} else {
		events.fetch({ query:'SELECT MAX(id) as id FROM events' });
		eventData = events.toJSON()[0];
		data.id = eventData.id;	
	}
	
	// 3. Parse date of events from string to array
	data.dates = data.dates.split(',');
	
	// 4. Get name of event to show with notification
	if ( data.type == 'medication' ) {
		if ( data.dosage ) {
			data.name = data.name + ' - ' + data.dosage;
		}
	} else {
		data.name = 'You have appointment with Doctor ' + data.doctor;
	}	
	
	for ( var i = 0, ii = data.dates.length; i < ii; i++ ) {
		// 5. Get date time of events
		data.datetime = moment(parseInt( data.dates[i] )).format('YYYY-MM-DD') + ' ' + moment( data.time ).format('HH:mm');
		
		// 6. Set sound for notification
		if ( Ti.App.Properties.getBool('sound_enable', true) ) {
			data.playsound = true;
		} else {
			data.playsound = false;
		}
		
		if ( !OS_IOS ) {
			// 7. Set vibrate for notification
			data.vibrate = Ti.App.Properties.getBool('vibrate_enable', true);
		}

		// 8. Create new notification
		notify.register( data );
	};
}

function deleteNotification( id ) {
	notify.unregister( id );
}

function hideKeyboard() {
  	if ( cacheData.type == 'medication' ) {
		$.txtDosage.blur();
	} else {
		$.txtDoctorsName.blur();
	}
}