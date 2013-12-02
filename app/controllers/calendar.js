var events = Alloy.createCollection('events');

init();

function init() {
	loadNav();
	loadCalendar();
	loadEvents( moment() );
}

exports.reload = function(){
	init();
};

function loadNav() {
  	var title = Ti.UI.createView({ width: Ti.UI.SIZE, height: Ti.UI.SIZE, left: 0 });
	title.add( Ti.UI.createImageView({ image: '/images/icons/calendar.png', width: Alloy.CFG.size_30, height: Alloy.CFG.size_30, left: Alloy.CFG.size_15 }) );
	title.add( Ti.UI.createLabel({ text: 'calendar', font: { fontSize: Alloy.CFG.size_20, fontFamily: 'DroidSans' }, color: '#fff', left: Alloy.CFG.size_50 }) );
	
  	$.nav.init({
		title: title,
		right: {
			icon: '/images/icons/plus.png',
			callback: function() {
				loadNewEvent();
			}
		}
	});
}

function loadCalendar() {
  	$.calendar.init({
		cellSize: {
			width: Alloy.CFG.size_42,
			height: Alloy.CFG.size_30
		}
	}, calendarChanged);
}

function calendarChanged( moment ) {
	Alloy.Globals.toggleAI(true);
  	loadEvents( moment );
  	Alloy.Globals.toggleAI(false);
}

function loadEvents( m ) {
  	var eventList = $.eventList, 
  		eventData,
  		table = events.config.adapter.collection_name,
  		currentDate = Date.parse( m.format('L') );

  	eventList.remove(eventList.children[0]);
  	
  	var wrapper = Ti.UI.createView({ layout: 'vertical', width: Alloy.CFG.size_290, height: Ti.UI.SIZE, backgroundColor: '#d7d7d7', top: Alloy.CFG.size_10 });

  	events.fetch({ query:'SELECT * FROM ' + table + ' WHERE dates LIKE "%' + currentDate + '%" ORDER BY strftime("%s", time) ASC' });
  	
  	eventData = events.toJSON();

  	for ( var i = 0, ln = eventData.length; i < ln; i++ ) {
  		var icon, title, time;
  		
  		time = moment( eventData[i].time ).format('h:mm a');

  		if ( eventData[i].type == 'medication' ) {
  			icon = '/images/icons/medication.png';
  			if ( eventData[i].dosage ) {
  				title = eventData[i].name + ' - ' + eventData[i].dosage;
  			} else {
  				title = eventData[i].name;
  			}
  		} else {
  			icon = '/images/icons/appointment.png';
  			title = eventData[i].doctor;
  		}
  		
		var vEvent = Ti.UI.createView({ eventId: eventData[i].id, eventType: eventData[i].type, height: Ti.UI.SIZE, top: i ? 1 : 0, backgroundColor: '#fff' });
		wrapper.add(vEvent);
		
			vEvent.add( Ti.UI.createImageView({ image: icon, width: Alloy.CFG.size_30, height: Alloy.CFG.size_30, left: 0, touchEnabled: false }) );
			
			var vEventInfo = Ti.UI.createView({ layout: 'vertical', height: Ti.UI.SIZE, bottom: Alloy.CFG.size_5, left: Alloy.CFG.size_35, touchEnabled: false });
			vEvent.add(vEventInfo);
			
				vEventInfo.add( Ti.UI.createLabel({ text: title, font: { fontSize: Alloy.CFG.size_15, fontFamily: 'DroidSans' }, color: '#444', left: 0, top: Alloy.CFG.size_8, touchEnabled: false }) );
				vEventInfo.add( Ti.UI.createLabel({ text: time, font: { fontSize: Alloy.CFG.size_10, fontFamily: 'DroidSans' }, color: '#444', left: 0, touchEnabled: false }) );
	};
	
	// no event
	if (ln == 0) {
		var inner = Ti.UI.createView({ height: Alloy.CFG.size_45, top: 0, backgroundColor: '#fff' });
		inner.add( Ti.UI.createLabel({ text: 'No event', font: { fontSize: Alloy.CFG.size_15, fontFamily: 'DroidSans' }, color: '#444', left: Alloy.CFG.size_35, top: Alloy.CFG.size_8, touchEnabled: false }) );
		wrapper.add(inner);
	}
	
  	eventList.add(wrapper);
}

function eventClicked(e) {
	if ( e.source.eventId ) {
		Alloy.Globals.PageManager.load('new_event_configure', { eventId: e.source.eventId, eventType: e.source.eventType }, false);
	}
}

function loadNewEvent() {
	Alloy.Globals.PageManager.load('new_event');
}
