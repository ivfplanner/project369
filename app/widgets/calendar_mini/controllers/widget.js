var moment = require('moment'), //require('alloy/moment'), // built-ins moment.js is just v 1.7
	vars = {};

/*
 args = {
 	cellSize: {
 		width: 42,
 		height: 30
 	}
 }
 * */
exports.init = function(args, onChanged) {
	var options = _.extend({
	 	
	}, args);
	vars.options = options;
	
	//
	
	var oMoment = moment().startOf('hour').hour(0);// today without hours, minutes and seconds
	vars.month = oMoment.month(); // 0 -> 11
	vars.year = oMoment.year();
	
	// today is selected date
	vars.selectedDate = oMoment.toDate().getTime() + '';
	
	loadCalendar(vars.selectedDate);
	
	vars.onChanged = onChanged;
};

function loadCalendar(selectedDate) {
	var calendarContainer = $.calendarContainer;
	
	// hide lblMonth
	var lblMonth = calendarContainer.children[0].children[0];
	lblMonth && (lblMonth.visible = false);
	
	calendarContainer.add( Alloy.createWidget('calendar_mini', 'calendar', { month: vars.month, year: vars.year, options: vars.options, selectedDate: selectedDate, callback: callback }).getView() );
	
	calendarContainer.remove( calendarContainer.children[0] );
}

function loadPreviousMonth(e) {
	if (vars.month != 0) {
		vars.month--;
	} else {
		vars.month = 11;
		vars.year--;
	}
	
  	loadCalendar(loadSelectedDate());
}

function loadNextMonth(e) {
	if (vars.month != 11) {
		vars.month++;
	} else {
		vars.month = 0;
		vars.year++;
	}
	
  	loadCalendar(loadSelectedDate());
}

function callback(selectedDate) {
	vars.selectedDate = selectedDate;
	
	vars.onChanged(moment(parseInt(selectedDate)));
}

function loadSelectedDate() {
  	var selectedDate = vars.selectedDate,
		oDate = moment(parseInt(selectedDate));
		
  	if (oDate.month() != vars.month || oDate.year() != vars.year) {
  		var firstDateOfMonth = moment((vars.month + 1) + '-01-' + vars.year + ' 00:00:00', 'MM-DD-YYYY hh:mm:ss');
  		
  		selectedDate = firstDateOfMonth.toDate().getTime() + '';
  		
  		vars.onChanged(firstDateOfMonth);
  	}
  	
  	return selectedDate;
}