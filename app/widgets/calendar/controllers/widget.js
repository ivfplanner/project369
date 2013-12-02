var moment = require('moment'), //require('alloy/moment'), // built-ins moment.js is just v 1.7
	vars = {};

/*
 args = {
 	styles: {
 		calendarSize: {
	 		width: 300,
	 		height: 'auto'
	 	},
	 	gapSize: {
	 		top: 0,
	 		left: 0
	 	},
	 	cellSize: {
	 		width: 42,
	 		height: 30
	 	},
 	}
 	selectedDates: []
 }
 * */
exports.init = function(args, callback) {
	var options = _.extend({
		calendarSize: 	{ width: 300, height: 'auto' },
	 	gapSize: 		{ top: 1, left: 1 },
	 	cellSize: 		{ width: 42, height: 42 }
	}, args.styles);
	vars.options = options;
	
	vars.selectedDates = args.selectedDates || [];
	
	vars.callback = callback;
	
	//
	
	var calendarSize = options.calendarSize;
	$.container.applyProperties({
		width: calendarSize.width,
		height: calendarSize.height == 'auto' ? Ti.UI.SIZE : calendarSize.height
	});
	
	//
	
	var oMoment = moment();
	vars.month = oMoment.month(); // 0 -> 11
	vars.year = oMoment.year();
	
	loadCalendar();
};

function loadCalendar() {
	var calendarContainer = $.calendarContainer;
	
	// hide lblMonth
	var lblMonth = calendarContainer.children[0].children[0];
	lblMonth && (lblMonth.visible = false);
	
	calendarContainer.add( Alloy.createWidget('calendar', 'calendar', { month: vars.month, year: vars.year, selectedDates: vars.selectedDates, options: vars.options }).getView() );
	calendarContainer.remove(calendarContainer.children[0]);
}

function loadPreviousMonth(e) {
	if (vars.month != 0) {
		vars.month--;
	} else {
		vars.month = 11;
		vars.year--;
	}
	
  	loadCalendar();
}

function loadNextMonth(e) {
	if (vars.month != 11) {
		vars.month++;
	} else {
		vars.month = 0;
		vars.year++;
	}
	
  	loadCalendar();
}

function calendarClicked(e) {
	var el = e.source;
	
  	if (el.calendarType != 'date') {
  		return;
  	}
  	
  	if (el.isSelected !== true) {
  		el.applyProperties({
  			backgroundGradient: el.selectedBackgroundGradient,
  			color: el.selectedColor
  		});
  		
  		vars.selectedDates.push(el.calendarDate);
  		
  		el.isSelected = true;
  	} else {
  		el.applyProperties({
  			backgroundGradient: el.normalBackgroundGradient,
  			color: el.normalColor
  		});
  		
  		vars.selectedDates = _.without(vars.selectedDates, el.calendarDate);
  		
  		el.isSelected = false;
  	}
  	
  	vars.callback && vars.callback(vars.selectedDates);
}

function calendarSwipe(e) {
  	switch (e.direction) {
  		case 'left':
  		case 'up':
  			loadNextMonth();
  			break;
  			
  		default: 
  			loadPreviousMonth();
  			break;	
  	}
}

exports.getSelectedDates = function() {
  	return _.sortBy(vars.selectedDates, function(num){ return parseInt(num); });
};