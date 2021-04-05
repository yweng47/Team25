const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const RoleSchema = new Schema({
	id: Schema.Types.ObjectId,
	name: { type: String, require: true },
	description: String
});

module.exports = mongoose.model('role', RoleSchema);
