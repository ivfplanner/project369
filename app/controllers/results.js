var results = Alloy.createCollection( 'result' );

init();

function init() {
	loadNav();
	loadResults();
}

function loadNav() {
	var title = Ti.UI.createView({ width: Ti.UI.SIZE, height: Ti.UI.SIZE, left: 0 });
	title.add( Ti.UI.createImageView({ image: '/images/icons/results.png', width: Alloy.CFG.size_30, height: Alloy.CFG.size_30, left: Alloy.CFG.size_15 }) );
	title.add( Ti.UI.createLabel({ text: 'results', font: { fontSize: Alloy.CFG.size_20, fontFamily: Alloy.CFG.font_DroidSans }, color: '#fff', left: Alloy.CFG.size_50 }) );
  	
  	$.nav.init({
		title: title,
		right: {
			icon: '/images/icons/new-note.png',
			callback: function() {
				var vResults = $.vResults;
				loadResult( vResults, '', '', true, '', true );
				vResults.scrollToBottom();
			}
		}
	});
}

// Load all result
function loadResults() {
  	results.fetch();
  	var resultData = results.toJSON();
  	
  	$.vResults.removeAllChildren();
	
  	for ( var i = 0, rlen = resultData.length; i < rlen; i++ ) {
		loadResult( $.vResults, resultData[i].result_key, resultData[i].result_value, i, resultData[i].id, false );
	};
}

function loadResult( container, key, value, hasTop, id, focusTextField ) {
	var result = Ti.UI.createView({ width: Alloy.CFG.size_290, height: Alloy.CFG.size_51, top: hasTop ? 1 : 0, backgroundColor: '#fff' });

	var btnDelete = Ti.UI.createImageView({ resultId: id, image: '/images/icons/delete.png', width: Alloy.CFG.size_20, height: Alloy.CFG.size_20, left: Alloy.CFG.size_270 });
	
	btnDelete.addEventListener('click', deleteResult );
	
	// Key field
	var resultKeyField = Ti.UI.createTextField({ 
		value: key,
		hintText: 'Name', 
		font: { fontSize: Alloy.CFG.size_15, fontFamily: Alloy.CFG.font_DroidSans }, 
		color: '#444', 
		height: '110%', 
		width: Alloy.CFG.size_140, 
		backgroundColor: 'transparent',
		paddingLeft: 10, 
		clearButtonMode: Ti.UI.INPUT_BUTTONMODE_ONFOCUS, 
		returnKeyType: Ti.UI.RETURNKEY_NEXT,
		left: 0
	});
	
	if (OS_ANDROID) {
		resultKeyField.softKeyboardOnFocus = Ti.UI.Android.SOFT_KEYBOARD_SHOW_ON_FOCUS;
	}
	
	resultKeyField.addEventListener('return', function() {
		resultValueField.focus();
	});
	
	// Value field
	var resultValueField = Ti.UI.createTextField({
		resultId: id,
		value: value, 
		hintText: 'Value', 
		font: { fontSize: Alloy.CFG.size_15, fontFamily: Alloy.CFG.font_DroidSans }, 
		color: '#444', 
		height: '110%', 
		width: Alloy.CFG.size_140, 
		backgroundColor: 'transparent', 
		paddingLeft: 10, 
		clearButtonMode: Ti.UI.INPUT_BUTTONMODE_ONFOCUS, 
		returnKeyType: Ti.UI.RETURNKEY_DONE,
		left: Alloy.CFG.size_140
	});
	
	resultValueField.addEventListener('return', function(e) {
		var resultValue = saveResult( resultKeyField.value, resultValueField.value, this.resultId );

		if ( resultValue ) {
			if ( resultValue.mode == 'add' ) {
				this.resultId = btnDelete.resultId = resultValue.id;
			} else {
				this.resultId = resultValue.id;
				container.remove( result );
			}
		}
	});
	
	result.add( btnDelete );
	result.add( resultKeyField );
	result.add( resultValueField );
	container.add( result );
	
	if ( focusTextField ) {
		resultKeyField.addEventListener( 'postlayout', postlayout );
	}
}

function postlayout(e) {
	var el = e.source; 
	el.removeEventListener( 'postlayout', postlayout );
  	el.focus();
}

function saveResult( key, value, id ) {
	var resultData = {
		result_key: key,
		result_value: value || ''
	};
	
	// Update record
	if ( id ) {
		results.fetch({ query:'SELECT * FROM result WHERE id = "'+ id +'"' });
		var resultModel = results.get( id );

		if ( resultData.result_key ) {
			resultModel.set( resultData );
			resultModel.save();
		} else {
			alert('Result name can not be blank');
		}
	// Add record
	} else {
		if ( resultData.result_key ) {
			var addResult = Alloy.createModel( 'result', resultData );
			addResult.save();
			results.fetch({ query:'SELECT MAX(id) as id FROM result' });
			resultID = results.toJSON()[0];
			return { mode: 'add', id: resultID.id };
		} else {
			results.fetch({ query:'SELECT MAX(id) as id FROM result' });
			resultID = results.toJSON()[0];
			return { mode: 'delete', id: resultID.id + 1 };
		}
	}
}

function deleteResult(e) {
	if ( e.source ) {		
		var el = e.source.parent;
			id = e.source.resultId;
		
		if ( id ) {
			results.fetch({ query:'SELECT * FROM result WHERE id = "'+ id +'"' });
	  		results.get( id ).destroy();
	  		$.vResults.remove( el );
		} else {
			$.vResults.remove( el );
		}
	}
}
