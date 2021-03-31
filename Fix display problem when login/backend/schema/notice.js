const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const NoticeSchema = new Schema({
	id: Schema.Types.ObjectId,
	content: String,
	create_time: { type: Date, default: Date.now }
});

module.exports = mongoose.model('notice', NoticeSchema);
