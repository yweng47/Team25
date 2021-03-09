const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const EnrolmentHourSchema = new Schema({
	id: Schema.Types.ObjectId,
	course: {type: Schema.Types.ObjectId, ref: 'course'},
	lab_hour: Number,
	previous_enrollments: Number,
	previous_ta_hours: Number,
	current_enrollments: Number,
	current_ta_hours: Number,
});

module.exports = mongoose.model('enrolment_hour', EnrolmentHourSchema);
