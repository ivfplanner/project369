exports.definition = {
	config: {
		columns: {
			id: 'INTEGER PRIMARY KEY AUTOINCREMENT',
			name: 'TEXT'
		},
		adapter: {
			type: 'sql',
			db_name: 'ivfplanner',
			collection_name: 'medicine',
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
				}
			}
		});

		return Model;
	}
}