var callback,
	isVisible = true,
	touchPoint;

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
  	var rows = [];
  	for(var i = 0, ii = items.length; i < ii; i++){
		var item = items[i];
		
		var wrapper = Ti.UI.createTableViewRow({ id: item.id, height: Alloy.CFG.size_56, backgroundImage: '/images/menu/bg-item.png' });
		wrapper.add( Ti.UI.createImageView({ image: item.icon, width: Alloy.CFG.size_30, height: Alloy.CFG.size_30, left: Alloy.CFG.size_15, touchEnabled: false }) );
		wrapper.add( Ti.UI.createLabel({ text: item.title, font: { fontSize: Alloy.CFG.size_18, fontFamily: Alloy.CFG.font_DroidSans }, color: '#333', height: Alloy.CFG.size_56, left: Alloy.CFG.size_60, touchEnabled: false }) );
		
		rows.push(wrapper);
  	};
  	$.container.setData(rows);
}

function handlerClicked(e) {
  	toggleMenu(!isVisible);
}

function handlerSwiped(e) {
  	if (e.direction == 'up') {
  		toggleMenu(true);
  	} else if (e.direction == 'down') {
  		toggleMenu(false);
  	}
}

function toggleMenu(visible) {
  	if (visible) {
  		$.menu.animate({
	  		bottom: 0,
	  		curve: Ti.UI.ANIMATION_CURVE_EASE_OUT
	  	});
  	} else {
  		$.menu.animate({
	  		bottom: $.menu.bkBottom,
	  		curve: Ti.UI.ANIMATION_CURVE_EASE_OUT
	  	});
  	}
  	
  	isVisible = visible;
}

function menuClicked(e) {
	if (e.source.id) {
		callback(e.source.id);
  		toggleMenu(false);
	}
}

function touchstart(e) {
  	touchPoint = { x: e.x, y: e.y };
}

function touchmove(e) {
  	var menu = $.menu,
  		max = menu.bkBottom,
  		pos = e.source.convertPointToView({ x: e.x, y: e.y }, menu.parent),
  		bottom = Ti.Platform.displayCaps.platformHeight - pos.y - menu.rect.height + touchPoint.y;
  	
  	if (bottom <= 0 && bottom >= max) {
  		menu.bottom = bottom;
  	}
}

function touchend(e) {
	var menu = $.menu;
	
  	if (menu.bottom > menu.bkBottom / 2) {
  		toggleMenu(true);
  	} else {
  		toggleMenu(false);
  	}
}