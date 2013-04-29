var vars = arguments[0];

init();

function init() {
  	$.picker.value = vars.value;
}

function done(e) {
  	vars.done( $.picker.value );
}

function cancel(e) {
  	vars.cancel();
}