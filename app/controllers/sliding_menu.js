var callback;

init(arguments[0]);

function init(args) {
	loadMenu(args.items);
	
	callback = args.callback;
	
	$.menu.addEventListener('postlayout', postlayout);
}

function postlayout(e) {
  	if (e.source.id == 'menu') {
  		$.menu.removeEventListener('postlayout', postlayout);
  		
  		$.menu.bkBottom = ( $.menu.rect.height - Alloy.CFG.size_46 ) * -1;
  	}
}

function loadMenu(items) {
  	for(var i = 0, ii = items.length; i < ii; i++){
		var item = items[i];
		
		var wrapper = Ti.UI.createView({ id: item.id, height: Alloy.CFG.size_55, bottom: Alloy.CFG.size_1 });
		wrapper.add( Ti.UI.createImageView({ image: item.icon, width: Alloy.CFG.size_30, height: Alloy.CFG.size_30, left: Alloy.CFG.size_15, touchEnabled: false }) );
		wrapper.add( Ti.UI.createLabel({ text: item.title, font: { fontSize: Alloy.CFG.size_18, fontFamily: Alloy.CFG.font_DroidSans }, color: '#333', height: '100%', left: Alloy.CFG.size_60, touchEnabled: false }) );
		$.container.add(wrapper);
  	};
}

function toggleMenu(e) {
  	if (e.direction == 'up') {
  		$.menu.animate({
	  		bottom: 0,
	  		curve: Ti.UI.ANIMATION_CURVE_EASE_OUT
	  	});
  	} else if (e.direction == 'down') {
  		$.menu.animate({
	  		bottom: $.menu.bkBottom,
	  		curve: Ti.UI.ANIMATION_CURVE_EASE_OUT
	  	});
  	}
}

function menuClicked(e) {
	if (e.source.id) {
		callback(e.source.id);
  		toggleMenu({ direction: 'down' });
	}
}