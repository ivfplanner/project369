var moment = require('moment'); //require('alloy/moment'); // built-ins moment.js is just v 1.7

init(arguments[0]);

function init(args) {
	var time = moment((args.month + 1) + '-01-' + args.year + ' 00:00:00', 'MM-DD-YYYY hh:mm:ss');
	
	$.lblMonth.text = time.format("MMMM YYYY");
	
	loadWeek(args.options);
	
	loadDate(time, args);
};

function loadWeek(options) {
  	var weekNames = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
  	
  	for (var i = 0; i < 7; i++) {
		$.weekContainer.add( Ti.UI.createLabel({ text: weekNames[i], width: options.cellSize.width, left: i ? options.gapSize.left : 0, font: { fontSize: Alloy.CFG.size_15, fontFamily: Alloy.CFG.font_DroidSans }, color: '#ccc', textAlign: 'center', height: '100%' }) );
	};
}

function loadDate(time, args) {
	var dayIndex = time.day(), // Sunday as 0 and Saturday as 6
		options = args.options,
		selectedDate = args.selectedDate,
		selectedLength = selectedDate.length,
  		prevMonth = time.subtract('days', ( dayIndex ? dayIndex : 7 ) - 1),
  		today = moment().startOf('hour').hour(0).toDate().getTime() + '';// get today's time stamp without hours, minutes and seconds
  	
  	for (var i = 0; i < 42; i++) {
  		var date = prevMonth.toDate().getTime() + '',
	  		styles = { 
	  			backgroundGradient: { type: 'linear', colors: [{ color: '#583176', position: 0.0 }, { color: '#441d62', position: 1.0 }] },
	  			color: '#ccc', 
	  			normalBackgroundGradient: { type: 'linear', colors: [{ color: '#583176', position: 0.0 }, { color: '#441d62', position: 1.0 }] }, 
	  			normalColor: '#ccc',
	  			selectedBackgroundGradient: { type: 'linear', colors: [{ color: '#014465', position: 0.0 }, { color: '#0d73a6', position: 1.0 }] },
	  			selectedColor: '#fff',
	  			
	  			calendarDate: date, 
	  			calendarType: 'date', 
	  			font: { fontSize: Alloy.CFG.size_19, fontFamily: Alloy.CFG.font_DroidSans }, 
	  			height: options.cellSize.height, 
	  			isSelected: false,
	  			left: i % 7 ? options.gapSize.left : 0, 
	  			text: prevMonth.date(), 
	  			textAlign: 'center', 
	  			top: options.gapSize.top, // i >= 7 ? options.gapSize.top : 0, 
	  			width: options.cellSize.width
	  		};
  		
  		// highlight previous and next month
  		if (prevMonth.month() != args.month) {
  			styles.color = '#999';
  			styles.backgroundGradient = { type: 'linear', colors: [{ color: '#251225', position: 0.0 }, { color: '#1a0d1a', position: 1.0 }] };
  			styles.touchEnabled = false;
  		}
  		
  		// highlight current date
  		if (date == today) {
  			styles.normalBackgroundGradient = { type: 'linear', colors: [{ color: '#3c383f', position: 0.0 }, { color: '#3a363d', position: 1.0 }] };
  			styles.backgroundGradient = { type: 'linear', colors: [{ color: '#3c383f', position: 0.0 }, { color: '#3a363d', position: 1.0 }] };
  		}
  		
  		// highlight selected dates
  		for(var j = 0; j < selectedLength; j++){
			if (date == selectedDate[j]) {
				styles.color = '#fff';
				styles.backgroundGradient = { type: 'linear', colors: [{ color: '#014465', position: 0.0 }, { color: '#0d73a6', position: 1.0 }] };
				styles.isSelected = true;
			}
		};
  		
		$.dateContainer.add( Ti.UI.createLabel(styles) );
		
		prevMonth.add('days', 1);
	};
}