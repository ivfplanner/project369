// The contents of this file will be executed before any of
// your view controllers are ever executed, including the index.
// You have access to all functionality on the `Alloy` namespace.
//
// This is a great place to do any initialization for your app
// or create any global variables/functions that you'd like to
// make available throughout your app. You can easily make things
// accessible globally by attaching them to the `Alloy.Globals`
// object. For example:
//
// Alloy.Globals.someGlobalFunction = function(){};

var sizeManager = require('size_manager');
sizeManager.init([ 
	-10,
	1, 2, 3, 4, 5, 6, 7, 8, 9,
	10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
	20, 21, 22, 23, 24, 25, 26, 27,
	30, 32, 34, 35, 36, 37, 38,
	40, 42, 43, 45, 46, 48, 49,
	50, 51, 55, 56,
	60, 62, 63, 64, 65,
	70, 76, 78,
	80, 85,
	120,
	135,
	140, 145, 148, 149,
	150,
	175,
	180,
	220,
	256,
	260,
	270,
	290, 297,
	300, 305, 309,
	335,
	344
]);
Alloy.Globals.SizeManager = sizeManager;