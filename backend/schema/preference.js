const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PreferenceSchema = new Schema({
	id: Schema.Types.ObjectId,
	applicant_email: String,
	applicant_name: String,
	choices: [{type: Schema.Types.ObjectId, ref: 'course'}]
});

module.exports = mongoose.model('preference', PreferenceSchema);
