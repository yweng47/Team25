const mongoose = require('mongoose');
const RoleSchema = require('./role');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
	id: Schema.Types.ObjectId,
	email: { type: String, require: true },
	password: { type: String, require: true },
	name: { type: String, require: true },
	roles: { type: [RoleSchema], require: true },
	relateCourses: []
});

module.exports = mongoose.model('user', UserSchema);
