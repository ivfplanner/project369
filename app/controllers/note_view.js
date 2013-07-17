var mode,
	moment = require('moment');

init(arguments[0]);

function init( args ) {
	mode = args.mode;

	if ( args.mode == 'add' ) {
		$.txtName.addEventListener('postlayout', postlayout);
	}

	$.txtName.value = args.name;
	$.txtContent.value = args.content;	
	
	loadNav( args.f_id, args.id );
}

function loadNav( f_id, id ) {
  	var title = Ti.UI.createView({ width: Ti.UI.SIZE, height: Ti.UI.SIZE, left: 0 }),
  		n_created = moment().format('YYYY-MM-DD HH:mm:ss');
  		
	title.add( Ti.UI.createImageView({ image: '/images/icons/notes.png', width: Alloy.CFG.size_30, height: Alloy.CFG.size_30, left: Alloy.CFG.size_15 }) );
	title.add( Ti.UI.createLabel({ text: 'notes', font: { fontSize: Alloy.CFG.size_20, fontFamily: Alloy.CFG.font_DroidSans }, color: '#fff', left: Alloy.CFG.size_50 }) );
  	
  	$.nav.init({
		title: title,
		right: {
			icon: '/images/icons/go.png',
			callback: function() {
				if ( $.txtName.value ) {
					var noteData = {
						f_id: f_id,
				  		name: $.txtName.value,
				  		content: $.txtContent.value,
				  		mode: mode,
				  		created: n_created
					}
					
					// Update current note, if don't have id, it will be a new note
					if ( id ) {
						noteData.id = id;
					}

					Alloy.Globals.PageManager.loadPrevious( noteData );
				} else {
					alert( "Note's name can not blank." );
				}	
			}
		}
	});
}

function postlayout(e) {
	var el = e.source; 
	el.removeEventListener('postlayout', postlayout);
  	el.focus();
}