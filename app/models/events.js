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
	},

	extendModel: function(Model) {
		_.extend(Model.prototype, {
			validate: function (attrs) {
				for ( var key in attrs ) {
					var value = attrs[key];
					if (key === "name") {
                        if (value.length <= 0) {
                            return "Error: No name!";
                        }
                    }
                    if (key === "doctor") {
                        if (value.length <= 0) {
                            return "Error: No doctor!";
                        }
                    }
				}
			}
		});

		return Model;
	}
}