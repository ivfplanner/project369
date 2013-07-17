exports.definition = {
	config: {
		columns: {
			id: 'INTEGER PRIMARY KEY AUTOINCREMENT',
			title: 'TEXT',
			description: 'TEXT',
			created: 'TEXT',
			folder_id: 'INTEGER'
		},
		adapter: {
			type: 'sql',
			db_name: 'ivfplanner',
			collection_name: 'notes',
			idAttribute: "id"
		}
	},

	extendModel: function(Model) {
		_.extend(Model.prototype, {
			validate: function (attrs) {
				for ( var key in attrs ) {
					var value = attrs[key];
					if (key === "title") {
                        if (value.length <= 0) {
                            return "Error: No title!";
                        }
                    }
				}
			}	
		});

		return Model;
	}
}