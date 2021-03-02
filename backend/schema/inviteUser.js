const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const InviteUserSchema = new Schema({
	id: Schema.Types.ObjectId,
	access_token: { type: String, require: true },
	expire_date: { type: Date, require: true },
	create_Date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('invite_user', InviteUserSchema);
