const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const QuestionSchema = new Schema({
	id: Schema.Types.ObjectId,
	course: { type: Schema.Types.ObjectId, ref: 'course' },
	user: { type: Schema.Types.ObjectId, ref: 'user' },
	questions: [String],
	create_time: { type: Date, default: Date.now }
});

module.exports = mongoose.model('question', QuestionSchema);
