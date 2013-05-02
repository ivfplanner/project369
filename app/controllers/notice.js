init();

function init() {
	loadNav();
}

function loadNav() {
  	var title = Ti.UI.createView({ width: Ti.UI.SIZE, height: Ti.UI.SIZE, left: 0 });
	title.add( Ti.UI.createImageView({ image: '/images/icons/heart.png', width: Alloy.CFG.size_30, height: Alloy.CFG.size_30, left: Alloy.CFG.size_15 }) );
	title.add( Ti.UI.createLabel({ text: 'legal notice', font: { fontSize: Alloy.CFG.size_20, fontFamily: Alloy.CFG.font_DroidSans }, color: '#fff', left: Alloy.CFG.size_50 }) );
  	
  	$.nav.init({
		title: title
	});
}

function loadHomePage(e) {
	Ti.App.Properties.setBool('agreement_agreed', true);
  	Alloy.Globals.WinManager.loadWindow('index');
}