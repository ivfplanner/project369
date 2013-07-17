init();

function init() {
	if ( !Ti.App.Properties.getBool( 'populateData', false ) ) {
		populateMedication();
		populateResult();
		populateFolder();
		Ti.App.Properties.setBool( 'populateData', true );	
	}
	
	var controller;
	if ( !Ti.App.Properties.getBool('agreement_agreed', false) ) {
		controller = Alloy.createController('notice');
	} else {
		controller = Alloy.createController('main_window');
	}
	controller.getView().open();
}

// Load initiate medicine data 
function populateMedication() {
	Alloy.createCollection('events');
	var medications = [
		'Antibiotics',
	 	'Augmentin',
	 	'Baby Aspririn',
	 	'Bravelle',
	 	'Cetrorelix',
	 	'Centrotide',
	 	'Clexane',
	 	'Crinone',
	 	'Crinone gel / cream',
	 	'DHEA',
	 	'Doxycycline',
	 	'Estrace',
	 	'Estrogen patch',
		'Follicle Stimulating Hormone (FSH)',
		'Gonadotropin-releasing hormone (GnRH)',
	 	'Gonadotropins',
	 	'Gonal-F',
		'Human Chorionic Gonadotropin (hCG)',
		'Human Menopausal Gonadotropin (hMG)',
	 	'Leuprolide Acetate',
	 	'Lucrib',
	 	'Lupron',
	 	'Menotropin',
	 	'Menopur',
	 	'Micronized DHEA',
	 	'Micronized Estradiol',
	 	'Noverel',
	 	'Orgalutran',
	 	'Ovidrel',
	 	'Prednisone',
		'Prenatal Vitamins',
	 	'Progresterone',
		'Prometrium',
	 	'Puregon',
	 	'Repronex',
	 	'Synarel'
	];
	var db = Ti.Database.open('ivfplanner');
	db.execute('BEGIN;');
	for ( var i = 0, ml = medications.length; i < ml; i++ ) {
		var sql = "INSERT INTO events('name') VALUES ('" + medications[i] + "')";
  		db.execute( sql );
	}
	db.execute('COMMIT;');
	db.close();
}

// Load initiate result data 
function populateResult() {
	Alloy.createCollection('result');
	var result = [
		{ key: 'Blood Type'	, value: ''	 },
		{ key: 'AMH Level'	, value: ''	 },
		{ key: 'FSH Level'	, value: ''  },
		{ key: 'Sperm Count', value: ''  }
	];
	var db = Ti.Database.open('ivfplanner');
	db.execute('BEGIN;');
	for ( var i = 0, rl = result.length; i < rl; i++ ) {
		var sql = "INSERT INTO result('result_key', 'result_value') VALUES ('" + result[i].key + "', '" + result[i].value + "')";
  		db.execute( sql );
	} 
	db.execute('COMMIT;');
	db.close();
}

// Load initiate folder data 
function populateFolder() {
	Alloy.createCollection('note_folders');
	var folder = [
		'Symptoms',
		'Questions',
		'General'
	];
	var db = Ti.Database.open('ivfplanner');
	db.execute('BEGIN;');
	for ( var i = 0, rl = folder.length; i < rl; i++ ) {
		var sql = "INSERT INTO note_folders('name') VALUES ('" + folder[i] + "')";
  		db.execute( sql );
	} 
	db.execute('COMMIT;');
	db.close();
}
