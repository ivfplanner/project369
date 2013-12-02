var cacheData = arguments[0],
	vars = {},
	events = Alloy.createCollection('events');

init();

function init() {
	loadNav();
	
	$.txtMedicationName.addEventListener('return', function() {
		vars.btnGo.fireEvent('click');
	});
}

function loadNav() {
	var title = Ti.UI.createView({ width: Ti.UI.SIZE, height: Ti.UI.SIZE, left: 0 });
	title.add( Ti.UI.createImageView({ image: '/images/icons/event.png', width: Alloy.CFG.size_30, height: Alloy.CFG.size_30, left: Alloy.CFG.size_15 }) );
	title.add( Ti.UI.createLabel({ text: 'new medication', font: { fontSize: Alloy.CFG.size_20, fontFamily: 'DroidSans' }, color: '#fff', left: Alloy.CFG.size_50 }) );
	
	var rightPane = Ti.UI.createView({ layout: 'horizontal', width: Ti.UI.SIZE });
	
		var btnBack = Ti.UI.createView({ width: Alloy.CFG.size_38, height: Alloy.CFG.size_45 });
		rightPane.add(btnBack);
		btnBack.addEventListener('click', function(e) {
		  	Alloy.Globals.PageManager.loadPrevious();
		});
			btnBack.add( Ti.UI.createImageView({ image: '/images/icons/back.png', width: Alloy.CFG.size_30, height: Alloy.CFG.size_30, touchEnabled: false }) );
		
		var btnGo = Ti.UI.createView({ enabled: false, width: Alloy.CFG.size_38, height: Alloy.CFG.size_45 });
		rightPane.add(btnGo);
		btnGo.addEventListener('click', btnGoClicked);
			btnGo.add( Ti.UI.createImageView({ image: '/images/icons/go-disabled.png', width: Alloy.CFG.size_30, height: Alloy.CFG.size_30, touchEnabled: false }) );	
			
		vars.btnGo = btnGo;
	
  	$.nav.init({
		title: title,
		right: rightPane
	});
}

function nameChanged(e) {
  	var name = e.source.value;
  	if (name != '') {
  		loadRelatedNames(name);
  		
  		if (!vars.btnGo.enabled) {
  			vars.btnGo.children[0].image = '/images/icons/go.png';
  			vars.btnGo.enabled = true;
  		}
  	} else {
  		vars.btnGo.children[0].image = '/images/icons/go-disabled.png';
  		vars.btnGo.enabled = false;
  	}
}

function loadRelatedNames(name) {
  	var rows = [],
  		eventData;

  	events.fetch({ query:'SELECT DISTINCT name FROM events WHERE name LIKE "%' + name + '%" ORDER BY name ASC' });
  	eventData = events.toJSON();

  	for( var i = 0, ln = eventData.length, max = ln - 1; i < ln; i++ ){
		var medicationName = eventData[i].name;
		
		var row = Ti.UI.createTableViewRow({ height: Alloy.CFG.size_30, selectedBackgroundColor: 'transparent' });
		row.add( Ti.UI.createLabel({ text: medicationName, font: { fontSize: Alloy.CFG.size_15, fontFamily: 'DroidSans' }, color: '#666', left: Alloy.CFG.size_10, height: Alloy.CFG.size_30 }) );
		
		(i != max) && row.add( Ti.UI.createView({ height: 1, backgroundColor: '#d7d7d7', bottom: 0 }) );
		
		rows.push(row);	
	};
  	
  	$.tblRelatedName.setData(rows);
  	//$.tblRelatedName.visible = true;
}

function relatedNameClicked(e) {
	$.txtMedicationName.value = e.row.children[0].text;
	$.tblRelatedName.setData([]);
	//$.tblRelatedName.visible = false;
}

function btnGoClicked(e) {
  	if (e.source.enabled) {
  		$.txtMedicationName.blur();
  		cacheData.name = $.txtMedicationName.value;
  		Alloy.Globals.PageManager.load('new_event_dates', cacheData, false);
  	}
}