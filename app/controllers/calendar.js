var events = Alloy.createCollection('events');

init();

function init() {
	loadNav();
	loadCalendar();
	var firstLoad = moment();
	loadEvents( firstLoad );
}

function loadNav() {
  	var title = Ti.UI.createView({ width: Ti.UI.SIZE, height: Ti.UI.SIZE, left: 0 });
	title.add( Ti.UI.createImageView({ image: '/images/icons/calendar.png', width: Alloy.CFG.size_30, height: Alloy.CFG.size_30, left: Alloy.CFG.size_15 }) );
	title.add( Ti.UI.createLabel({ text: 'calendar', font: { fontSize: Alloy.CFG.size_20, fontFamily: Alloy.CFG.font_DroidSans }, color: '#fff', left: Alloy.CFG.size_50 }) );
	
  	$.nav.init({
		title: title
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
	Alloy.Globals.WinManager.toggleAI(true);
  	loadEvents( moment );
  	Alloy.Globals.WinManager.toggleAI(false);
}

function loadEvents( moment ) {
  	var eventList = $.eventList, eventData,
  		table = events.config.adapter.collection_name,
  		currentDate = Date.parse( moment.format('L') );
  	
  	eventList.remove(eventList.children[0]);
  	
  	var wrapper = Ti.UI.createView({ layout: 'vertical', width: Alloy.CFG.size_290, height: Ti.UI.SIZE, backgroundColor: '#d7d7d7', top: Alloy.CFG.size_10 });

  	events.fetch({query:'SELECT * FROM ' + table + ' WHERE dates LIKE "%' + currentDate + '%" ORDER BY strftime(time) ASC'});
  	
  	eventData = events.toJSON();

  	for ( var i = 0, ln = eventData.length; i < ln; i++ ) {
  		var icon, title,
  			url = '';

  		if ( eventData[i].type == 'medication' ) {
  			icon = '/images/icons/medication.png';
  			title = eventData[i].name + ' - ' + eventData[i].dosage;
  		} else {
  			icon = '/images/icons/appointment.png';
  			title = eventData[i].doctor;
  		}
  		
		var vEvent = Ti.UI.createView({ url: url, height: Alloy.CFG.size_45, top: i ? Alloy.CFG.size_1 : 0, backgroundColor: '#fff' });
		wrapper.add(vEvent);
		
			vEvent.add( Ti.UI.createImageView({ image: icon, width: Alloy.CFG.size_30, height: Alloy.CFG.size_30, left: 0, touchEnabled: false }) );
			
			var vEventInfo = Ti.UI.createView({ layout: 'vertical', left: Alloy.CFG.size_35, touchEnabled: false });
			vEvent.add(vEventInfo);
			
				vEventInfo.add( Ti.UI.createLabel({ text: title, font: { fontSize: Alloy.CFG.size_15, fontFamily: Alloy.CFG.font_DroidSans }, color: '#444', left: 0, top: Alloy.CFG.size_8, touchEnabled: false }) );
				vEventInfo.add( Ti.UI.createLabel({ text: eventData[i].time, font: { fontSize: Alloy.CFG.size_10, fontFamily: Alloy.CFG.font_DroidSans }, color: '#444', left: 0, touchEnabled: false }) );
	};
  	eventList.add(wrapper);
}

function eventClicked(e) {
  	var url = e.source.url;
  	url && Alloy.Globals.PageManager.loadPage(url);
}