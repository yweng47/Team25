const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ApplicationSchema = new Schema({
	id: Schema.Types.ObjectId,
	course: {type: Schema.Types.ObjectId, ref: 'course'},
	applicant_name: String,
	applicant_email: String,
	answers: [String],
	status: Number,
	order: Number
});

module.exports = mongoose.model('application', ApplicationSchema);
