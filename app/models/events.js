exports.definition = {
	config: {
		columns: {
			id: 'INTEGER PRIMARY KEY AUTOINCREMENT',
			type: 'TEXT',
			dates: 'TEXT',
			time: 'TEXT',
			name: 'TEXT',
			doctor: 'TEXT',
			dosage: 'INTEGER'		
		},
		adapter: {
			type: 'sql',
			db_name: 'ivfplanner',
			collection_name: 'events',
			idAttribute: "id"
		}
	}
}