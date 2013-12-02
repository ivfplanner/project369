var args = arguments[0];

function ok(e) {
  	args.ok({
  		name: $.txtFolderName.value
  	});
}

function cancel(e) {
  	args.cancel();
}

exports.focus = function() {
  	$.txtFolderName.focus();
};