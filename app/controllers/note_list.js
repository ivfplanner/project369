var notes = Alloy.createCollection( 'notes' ),
	moment = require( 'moment' );

init( arguments[0] );

function init( args ) {
	$.folderName.text = args.name;
	
	loadNav( args );
	loadNotes( args );
}

exports.reload = function( args ) {
	if ( args ) { 
		var f_id = parseInt( args.f_id, 10 );
	    // Add new note
	  	if ( args.mode == 'add' ) {
	  		var note = Alloy.createModel( 'notes', {
				title: args.name,
				description: args.content,
				created: args.created,
				folder_id: f_id
			});
			if ( note.isValid() ) { // Load new note 
				note.save();
			}
		// Update note
	  	} else {
			var noteModel = notes.get( args.id ),
				noteData  = {
					title: args.name,
					description: args.content
				};
			
			noteModel.set( noteData );
			noteModel.save();	  	
	  	}
	  		
		// Reload all note in folder
		loadNotes({ f_id: args.f_id });
	}
};

function loadNav( f_data ) {
  	var title = Ti.UI.createView({ width: Ti.UI.SIZE, height: Ti.UI.SIZE, left: 0 });
	title.add( Ti.UI.createImageView({ image: '/images/icons/notes.png', width: Alloy.CFG.size_30, height: Alloy.CFG.size_30, left: Alloy.CFG.size_15 }) );
	title.add( Ti.UI.createLabel({ text: 'notes', font: { fontSize: Alloy.CFG.size_20, fontFamily: 'DroidSans' }, color: '#fff', left: Alloy.CFG.size_50 }) );
	
	var rightPane = Ti.UI.createView({ layout: 'horizontal', width: Ti.UI.SIZE });
	
		var btnBack = Ti.UI.createView({ width: Alloy.CFG.size_38, height: Alloy.CFG.size_45 });
		rightPane.add( btnBack );
		btnBack.addEventListener( 'click', function( e ) {
		  	Alloy.Globals.PageManager.loadPrevious();
		});
			btnBack.add( Ti.UI.createImageView({ image: '/images/icons/back.png', width: Alloy.CFG.size_30, height: Alloy.CFG.size_30, touchEnabled: false }) );
		
		var btnAddNew = Ti.UI.createView({ width: Alloy.CFG.size_38, height: Alloy.CFG.size_45 });
		rightPane.add( btnAddNew );
		btnAddNew.addEventListener('click', function() { newNote( f_data ); } );
			btnAddNew.add( Ti.UI.createImageView({ image: '/images/icons/new-note.png', width: Alloy.CFG.size_30, height: Alloy.CFG.size_30, touchEnabled: false }) );	
			
  	$.nav.init({
		title: title,
		right: rightPane
	});
}

// Load note of current folder
function loadNotes( args ) {
  	var time, notesData;
		
	notes.fetch({ query:'SELECT * FROM notes WHERE folder_id = "' + args.f_id + '"' });
  	notesData = notes.toJSON();
	
	if ( notesData.length == 0 ) {
		var inner = Ti.UI.createView({ height: Alloy.CFG.size_45, top: 0, backgroundColor: '#fff' });
		inner.add( Ti.UI.createLabel({ text: 'No note', font: { fontSize: Alloy.CFG.size_15, fontFamily: 'DroidSans' }, color: '#444', left: Alloy.CFG.size_35, top: Alloy.CFG.size_8, touchEnabled: false }) );
		$.tblNotes.add( inner );
	} else {
		$.tblNotes.removeAllChildren();
		for ( var i = 0, nl = notesData.length; i < nl; i++ ) {
	  		time = moment( notesData[i].created ).format("MMM Do");
			$.tblNotes.add( addNote( time + ' - ' + notesData[i].title, notesData[i].id, notesData[i].folder_id, i ) );
		};
	}
}

function addNote( title, id, f_id, hasTop ) {
  	var row = Ti.UI.createView({ f_id: f_id, n_id: id, noteName: title, height: Alloy.CFG.size_51, top: hasTop ? 1 : 0, backgroundColor: '#fff' });
	row.add( Ti.UI.createLabel({ text: title, font: { fontSize: Alloy.CFG.size_15, fontFamily: 'DroidSans' }, color: '#444', left: Alloy.CFG.size_2, height: Alloy.CFG.size_51, touchEnabled: false }) );
	return row;
}

// Navigate to note_view to add new note
function newNote( f_data ) {
  	Alloy.Globals.PageManager.load( 'note_view', { f_id: f_data.f_id, name: '', content: '', mode: 'add' }, false );
}

// Navigate to note_view to view and update current note
function tblNotesClicked( e ) {
	var el = e.source;
	if (el.id != 'btnDelete') {
		if (el.isDeleting != true) {
			if (el.f_id) {
				notes.fetch({ query:'SELECT * FROM notes WHERE id = "'+ el.n_id +'"' });
				var noteData = notes.toJSON()[0];
			  	Alloy.Globals.PageManager.load( 'note_view', { id: noteData.id, f_id: noteData.folder_id, name: noteData.title, content: noteData.description, mode: 'view' }, false );
			}
		} else {
			removeDeleteButton(el);
		}
	} else {
		el = el.parent;

		// Delete notes of folder
  		notes.fetch({ query:'SELECT * FROM notes WHERE id = "' + el.n_id + '"' });
  		var noteData = notes.toJSON();
  		notes.get( noteData[0].id ).destroy();
  		$.tblNotes.remove( el );
	}
}

function tblNotesSwiped(e) {
  	var el = e.source;
  	if (el.f_id) {
  		if (e.direction == 'left' && el.isDeleting != true) {
			el.isDeleting = true;
			el.add( Ti.UI.createButton({ title: 'Delete', id: 'btnDelete', height: Alloy.CFG.size_32, width: Alloy.CFG.size_64, right: Alloy.CFG.size_10, textAlign: 'center', font: { fontSize: Alloy.CFG.size_14 }, color: '#fbfbfd', backgroundColor: '#34495e', backgroundImage: 'NONE', borderRadius: Alloy.CFG.size_5 }) );
		} else if (e.direction == 'right' && el.isDeleting) {
			removeDeleteButton(el);
		}
  	}
}

function removeDeleteButton(element) {
  	element.isDeleting = false;
	element.remove( element.children[1] );
}