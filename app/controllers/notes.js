var vars = {},
	folders = Alloy.createCollection( 'note_folders' );

init();

function init() {
	loadNav();
	loadFolders();
}

function loadNav() {
  	var title = Ti.UI.createView({ width: Ti.UI.SIZE, height: Ti.UI.SIZE, left: 0 });
	title.add( Ti.UI.createImageView({ image: '/images/icons/notes.png', width: Alloy.CFG.size_30, height: Alloy.CFG.size_30, left: Alloy.CFG.size_15 }) );
	title.add( Ti.UI.createLabel({ text: 'notes', font: { fontSize: Alloy.CFG.size_20, fontFamily: 'DroidSans' }, color: '#fff', left: Alloy.CFG.size_50 }) );
	
  	$.nav.init({
		title: title,
		right: {
			icon: '/images/icons/new-folder.png',
			callback: function() {
				var tblFolders = $.tblFolders;
				loadFolder( tblFolders, '', true, '', 'add' );
				tblFolders.scrollToBottom();
			}
		}
	});
}

function loadFolders() {
  	folders.fetch();
  	var folderData = folders.toJSON();
  	
  	$.tblFolders.removeAllChildren();

  	for ( var i = 0, ln = folderData.length; i < ln; i++ ) {
		loadFolder( $.tblFolders, folderData[i].name, i, folderData[i].id, 'show' );	
	};
}

function loadFolder( container, name, hasTop, id, mode ) {
	if ( mode == 'add' ) {
		var folder = Ti.UI.createView({ height: Alloy.CFG.size_51, top: hasTop ? 1 : 0, backgroundColor: '#fff', layout: 'horizontal' });
		
		folder.add( Ti.UI.createImageView({ image: '/images/icons/folder.png', width: Alloy.CFG.size_30, height: Alloy.CFG.size_30, left: 0, touchEnabled: false }) );
		
		// Folder's name field
		var folderNameField = Ti.UI.createTextField({
			folderId: id, 
			value: name, 
			hintText: 'Name', 
			font: { fontSize: Alloy.CFG.size_15, fontFamily: 'DroidSans' }, 
			color: '#444', 
			height: '110%', 
			width: Alloy.CFG.size_260, 
			backgroundColor: 'transparent',
			paddingLeft: 5,
			clearButtonMode: Ti.UI.INPUT_BUTTONMODE_ONFOCUS, 
			returnKeyType: Ti.UI.RETURNKEY_DONE 
		});
		
		if (OS_ANDROID) {
			folderNameField.softKeyboardOnFocus = Ti.UI.Android.SOFT_KEYBOARD_SHOW_ON_FOCUS;
		}
		
		folder.add( folderNameField );
		
		folderNameField.addEventListener('return', function() {
			// Add new folder
			var folderData 	= { name: folderNameField.value },
				addFolder 	= Alloy.createModel( 'note_folders', folderData );
			
			addFolder.save();
			// Get id of new folder
			folders.fetch({ query:'SELECT MAX(id) as id FROM note_folders' });
			var folderData = folders.toJSON()[0];
			// Remove new folder in "add mode"
			container.remove( folder );
			// And reload new folder into "show mode"
			loadFolder( container, folderNameField.value, hasTop, folderData.id, 'show' );
		});
		
		folderNameField.addEventListener('postlayout', postlayout);	
	} else {
		var folder = Ti.UI.createView({ id: id, folderName: name, height: Alloy.CFG.size_51, top: hasTop ? 1 : 0, backgroundColor: '#fff' });
		folder.add( Ti.UI.createLabel({ text: name, font: { fontSize: Alloy.CFG.size_15, fontFamily: 'DroidSans' }, color: '#444', left: Alloy.CFG.size_35, height: '100%', touchEnabled: false }) );
		folder.add( Ti.UI.createImageView({ image: '/images/icons/folder.png', width: Alloy.CFG.size_30, height: Alloy.CFG.size_30, left: 0, touchEnabled: false }) );
	}
	
	folder.addEventListener('swipe', folderSwiped);
	folder.addEventListener('click', folderClicked);

	container.add( folder );
}

function postlayout(e) {
	var el = e.source; 
	el.removeEventListener('postlayout', postlayout);
  	el.focus();
}

function folderSwiped( e ) {
	if (this.isDeleting != true) {
		if (e.direction == 'left') {
			this.isDeleting = true;
			this.add( Ti.UI.createButton({ title: 'Delete', id: 'btnDelete', height: Alloy.CFG.size_32, width: Alloy.CFG.size_64, right: Alloy.CFG.size_10, textAlign: 'center', font: { fontSize: Alloy.CFG.size_14 }, color: '#fbfbfd', backgroundColor: '#34495e', backgroundImage: 'NONE', borderRadius: Alloy.CFG.size_5 }) );
		}
	} else {
		if (e.direction == 'right') {
			this.isDeleting = false;
			this.remove( this.children[2] );
		}
	}
}

function folderClicked( e ) {
	var el = e.source;
	
	if ( el.id ) {
		if ( el.id != 'btnDelete' ) {
	  		Alloy.Globals.PageManager.load( 'note_list', { f_id: el.id, name: el.folderName }, false );
	  	} else {
	  		el = el.parent;
	  		
	  		// Delete notes of folder
	  		var notes = Alloy.createCollection( 'notes' );
	  		notes.fetch({ query:'SELECT * FROM notes WHERE folder_id = "' + el.id + '"' });
	  		var noteData = notes.toJSON();
	  		for ( var i = 0, nlen = noteData.length; i < nlen; i++ ) {
	  			notes.get( noteData[i].id ).destroy();
	  		}
			// Delete folder
	  		folders.fetch({ query:'SELECT * FROM note_folders WHERE id = "' + el.id + '"' });
	  		folders.get( el.id ).destroy();
	  		$.tblFolders.remove( el );
	  	}	
	}
}

