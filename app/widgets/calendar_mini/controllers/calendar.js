var moment = require('moment'), //require('alloy/moment'); // built-ins moment.js is just v 1.7
	selectedIndex,
	callback; 

init(arguments[0]);

function init(args) {
	var time = moment((args.month + 1) + '-01-' + args.year + ' 00:00:00', 'MM-DD-YYYY hh:mm:ss');
	
	$.lblMonth.text = time.format("MMMM YYYY");
	
	loadDate(time, args);
	
	callback = args.callback;
};

function loadDate(time, args) {
	var options = args.options,
		daysInMonth = time.daysInMonth() + 4,
		prevMonth = time.subtract('days', 2),
  		today = moment().startOf('hour').hour(0).toDate().getTime() + '',// get today's time stamp without hours, minutes and seconds
  		weekNames = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
  	
  	for (var i = 0; i < daysInMonth; i++) {
  		var date = prevMonth.toDate().getTime() + '',
	  		styles = { 
	  			backgroundGradient: { type: 'linear', colors: [{ color: '#724c8f', position: 0.0 }, { color: '#492367', position: 1.0 }] },
	  			normalBackgroundGradient: { type: 'linear', colors: [{ color: '#724c8f', position: 0.0 }, { color: '#492367', position: 1.0 }] },
	  			borderWidth: Alloy.CFG.size_1,
	  			borderColor: '#fff',
	  			calendarDate: date, 
	  			calendarIndex: i,
	  			calendarType: 'date', 
	  			height: Ti.UI.SIZE,
	  			top: 0,
	  			width: Alloy.CFG.size_60,
	  			layout: 'vertical'
	  		},
	  		labelStyles = { text: prevMonth.date(), font: { fontSize: Alloy.CFG.size_20, fontFamily: Alloy.CFG.font_DroidSans }, color: '#fff', height: Ti.UI.SIZE, top: Alloy.CFG.size_3, bottom: Alloy.CFG.size_12, touchEnabled: false };
  		
  		// highlight previous and next month
  		if (prevMonth.month() != args.month) {
  			styles.backgroundGradient = { type: 'linear', colors: [{ color: '#bebebe', position: 0.0 }, { color: '#bebebe', position: 1.0 }] };
  			styles.touchEnabled = false;
  		}
  		
  		// highlight current date
  		if (date == today) {
  			styles.backgroundGradient = { type: 'linear', colors: [{ color: '#3c383f', position: 0.0 }, { color: '#3a363d', position: 1.0 }] };
  			styles.normalBackgroundGradient = { type: 'linear', colors: [{ color: '#3c383f', position: 0.0 }, { color: '#3a363d', position: 1.0 }] };
  		}
  		
  		// highlight selected date
  		if (selectedIndex == null && date == args.selectedDate) {
  			styles.backgroundGradient = { type: 'linear', colors: [{ color: '#014465', position: 0.0 }, { color: '#0d73a6', position: 1.0 }] };
  			styles.width = Alloy.CFG.size_80;
  			labelStyles.font.fontSize = Alloy.CFG.size_27;
  			selectedIndex = i;
  		}
  		
  		var wrapper = Ti.UI.createView(styles);
  		wrapper.add( Ti.UI.createLabel({ text: weekNames[prevMonth.day()], font: { fontSize: Alloy.CFG.size_15, fontFamily: Alloy.CFG.font_DroidSans }, color: '#fff', top: Alloy.CFG.size_5, touchEnabled: false }) );
  		wrapper.add( Ti.UI.createLabel(labelStyles) );
		$.dateContainer.add(wrapper);
		
		prevMonth.add('days', 1);
	};
	
	$.dateContainer.contentWidth = daysInMonth * Alloy.CFG.size_60 + Alloy.CFG.size_20;
	
	if (selectedIndex != null) {
		$.dateContainer.addEventListener('postlayout', postLayout);
	}
}

function postLayout() {
	$.dateContainer.removeEventListener('postlayout', postLayout);
	scrollTo();
}

function scrollTo() {
  	$.dateContainer.scrollTo((selectedIndex - 2) * Alloy.CFG.size_60, 0);
}

function calendarClicked(e) {
  	var el = e.source;
	
  	if (el.calendarType != 'date') {
  		return;
  	}
  	
  	// highlight selected date
  	
  	el.applyProperties({
		backgroundGradient: { type: 'linear', colors: [{ color: '#014465', position: 0.0 }, { color: '#0d73a6', position: 1.0 }] },
		width: Alloy.CFG.size_80
	});
  	el.children[1].font = { fontSize: Alloy.CFG.size_27, fontFamily: Alloy.CFG.font_DroidSans };
  	
  	// remove highlight previous selected date
  	
  	if (selectedIndex != null) {
  		var lastDate = $.dateContainer.children[selectedIndex];
  		lastDate.applyProperties({
  			backgroundGradient: lastDate.normalBackgroundGradient,
  			width: Alloy.CFG.size_60
  		});
  		lastDate.children[1].font = { fontSize: Alloy.CFG.size_20, fontFamily: Alloy.CFG.font_DroidSans };
  	}
  	
  	// update selected index
  	
  	selectedIndex = el.calendarIndex;
  	
  	scrollTo();
  	
  	callback(el.calendarDate);
}