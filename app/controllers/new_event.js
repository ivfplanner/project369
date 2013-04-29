var vars = {};

init();

function init() {
	loadNav();
	loadEventTypes();
}

function loadNav() {
  	var title = Ti.UI.createView({ width: Ti.UI.SIZE, height: Ti.UI.SIZE, left: 0 });
	title.add( Ti.UI.createImageView({ image: '/images/icons/event.png', width: Alloy.CFG.size_30, height: Alloy.CFG.size_30, left: Alloy.CFG.size_15 }) );
	title.add( Ti.UI.createLabel({ text: 'new event', font: { fontSize: Alloy.CFG.size_20, fontFamily: Alloy.CFG.font_DroidSans }, color: '#fff', left: Alloy.CFG.size_50 }) );
	
  	$.nav.init({
		title: title
	});
}

function loadEventTypes() {
  	var rows = [],
  		data = [
			{ title: 'Medication', url: 'new_event_medication' },
			{ title: 'Appointment', url: 'new_event_dates' }
		];
  	
  	for(var i = 0, ii = data.length; i < ii; i++){
		var oData = data[i];
		
		var row = Ti.UI.createTableViewRow({ url: oData.url, height: Alloy.CFG.size_65, selectedBackgroundColor: 'transparent' });
		row.add( Ti.UI.createImageView({ image: '/images/icons/check.png', width: Alloy.CFG.size_30, height: Alloy.CFG.size_30, left: 0, visible: false }) );
		row.add( Ti.UI.createLabel({ text: oData.title, font: { fontSize: Alloy.CFG.size_18, fontFamily: Alloy.CFG.font_DroidSans }, color: '#666', left: Alloy.CFG.size_37, height: '100%' }) );
		
		rows.push(row);	
	};
  	
  	$.tblEventType.setData(rows);
}

function eventTypeClicked(e) {
  	alert('TODO');
}