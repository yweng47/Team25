const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CourseSchema = new Schema({
	id: Schema.Types.ObjectId,
	faculty: String,
	department: String,
	subject: String,
	catalog: String,
	section: String,
	description: String,
	component: String,
	location: String,
	mode: String,
	_class: String,
	start_date: Date,
	end_date: Date,
	wait_tot: Number,
	current_enrolment: Number,
	cap_enrolment: Number,
	full: Number
});

module.exports = mongoose.model('course', CourseSchema);
