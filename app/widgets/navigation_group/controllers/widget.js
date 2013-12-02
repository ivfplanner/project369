
/*
 params = {
 	left: {
 		title: '',
 		callback: function(){}
 	},
 	right: {
 		icon: '',
 		callback: function(){}
 	}, // or TiView
 	title: '', // or element
 }
 * */
exports.init = function(params) {
	loadLeftButton(params.left);
  	
	loadRightButton(params.right);
  	
  	loadTitle(params.title);
};

exports.update = function(params) {
	var child = $.left.children;
	if (child.length == 2) {
		$.left.remove(child[1]);
	}
	loadLeftButton(params.left);
	
	child = $.right.children;
	if (child.length == 2) {
		$.right.remove(child[1]);
	}
	loadRightButton(params.right);
	
	if (params.title) {
		$.center.remove($.center.children[0]);
		loadTitle(params.title);
	}
};

function createButton(title) {
  	return Ti.UI.createButton({ title: title, width: Alloy.CFG.size_38, height: Alloy.CFG.size_45, backgroundImage: 'NONE', font: { fontSize: Alloy.CFG.size_9 }, color: '#fff' });
}

function createImageButton(icon) {
  	var button = Ti.UI.createView({ width: Alloy.CFG.size_38, height: Alloy.CFG.size_45 });
	button.add( Ti.UI.createImageView({ image: icon, width: Alloy.CFG.size_30, height: Alloy.CFG.size_30 }) );
	return button;
}

function loadLeftButton(left) {
	if (left) {
		var width,
			leftContainer = $.left;
		
  		if (left.callback) {
  			width = Alloy.CFG.size_48;
  			
  			var btnLeft = left.icon ? createImageButton(left.icon) : createButton(left.title);
			btnLeft.addEventListener('singletap', left.callback);
			leftContainer.add(btnLeft);
  		} else {
  			width = left.width;
  			
  			leftContainer.add(left);
  		}
  		
  		$.center.left = (typeof width == 'number') ? width : 0;
  		leftContainer.width = width;
  		leftContainer.visible = true;
  	} else {
  		$.left.visible = false;
  		$.center.left = 0;
  	}
}

function loadRightButton(right) {
	if (right) {
		var width,
			rightContainer = $.right;
			
  		if (right.callback) {
  			width = Alloy.CFG.size_48;
  			
  			var btnRight = right.icon ? createImageButton(right.icon) : createButton(right.title);
			btnRight.addEventListener('singletap', right.callback);
			rightContainer.add(btnRight);
  		} else {
  			width = right.width;
  			
  			rightContainer.add(right);
  		}
  		
  		$.center.right = (typeof width == 'number') ? width : 0;
  		rightContainer.width = width;
  		rightContainer.visible = true;
  	} else {
  		$.right.visible = false;
  		$.center.right = 0;
  	}
}

function loadTitle(title) {
	if (typeof title == 'string') {
  		$.center.add( Ti.UI.createLabel({ text: title, font: { fontSize: Alloy.CFG.size_20, fontFamily: 'DroidSans' }, color: '#fff', ellipsize: true, wordWrap: true }) );
  	} else {
  		$.center.add( title );
  	}
}