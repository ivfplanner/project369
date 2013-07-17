exports.definition = {
	config: {
		columns: {
			id: 'INTEGER PRIMARY KEY AUTOINCREMENT',
			result_key: 'TEXT',
			result_value: 'TEXT'
		},
		adapter: {
			type: 'sql',
			db_name: 'ivfplanner',
			collection_name: 'result',
			idAttribute: "id"
		}
	}
}