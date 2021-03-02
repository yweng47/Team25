const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
	id: Schema.Types.ObjectId,
	email: { type: String, require: true },
	password: { type: String, require: true },
	name: { type: String, require: true },
	roles: [{ type: Schema.Types.ObjectId, ref: 'role', require: true }],
	relateCourses: [{ type: Schema.Types.ObjectId, ref: 'course' }]
});

module.exports = mongoose.model('user', UserSchema);
