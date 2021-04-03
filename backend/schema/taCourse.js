const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const TaCourseSchema = new Schema({
	id: Schema.Types.ObjectId,
	course: {type: Schema.Types.ObjectId, ref: 'course'},
	need_ta: Boolean
});

module.exports = mongoose.model('ta_course', TaCourseSchema);
