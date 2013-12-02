var cacheData = arguments[0],
	vars = {};

init();

function init() {
	loadNav();
	
	// calendar
	
	var calendarParams = {
		styles: {
			calendarSize: {
				width: Alloy.CFG.size_300,
				height: 'auto'
			},
			cellSize: {
				width: Alloy.CFG.size_42,
				height: Alloy.CFG.size_42
			},
		 	gapSize: {
		 		top: Alloy.CFG.size_1,
		 		left: Alloy.CFG.size_1
		 	}
		}
	};
	
	if (cacheData.selectedDates) {
		calendarParams.selectedDates = cacheData.selectedDates;
	}
	
  	$.calendar.init(calendarParams, dateChanged);
}

function loadNav() {
  	var title = Ti.UI.createView({ width: Ti.UI.SIZE, height: Ti.UI.SIZE, left: 0 });
	title.add( Ti.UI.createImageView({ image: '/images/icons/event.png', width: Alloy.CFG.size_30, height: Alloy.CFG.size_30, left: Alloy.CFG.size_15 }) );
	title.add( Ti.UI.createLabel({ text: 'new ' + cacheData.type, font: { fontSize: Alloy.CFG.size_20, fontFamily: 'DroidSans' }, color: '#fff', left: Alloy.CFG.size_50 }) );
	
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

function dateChanged(selectedDates) {
  	if (selectedDates.length) {
  		if (!vars.btnGo.enabled) {
  			vars.btnGo.children[0].image = '/images/icons/go.png';
  			vars.btnGo.enabled = true;
  		}
  	} else {
  		vars.btnGo.children[0].image = '/images/icons/go-disabled.png';
  		vars.btnGo.enabled = false;
  	}
}

function btnGoClicked(e) {
  	if (e.source.enabled) {
  		cacheData.selectedDates = $.calendar.getSelectedDates();
  		
  		Alloy.Globals.PageManager.load('new_event_configure', cacheData, false);
  	}
}