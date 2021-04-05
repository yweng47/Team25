const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const AllocationSchema = new Schema({
	id: Schema.Types.ObjectId,
	enrollment: {type: Schema.Types.ObjectId, ref: 'enrolment_hour'},
	applicant_name: String,
	applicant_email: String,
	hour: Number
});

module.exports = mongoose.model('allocation', AllocationSchema);
