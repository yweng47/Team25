const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ReviewSchema = new Schema({
	id: Schema.Types.ObjectId,
	user: { type: Schema.Types.ObjectId, ref: 'user' },
	review: Boolean
});

module.exports = mongoose.model('review', ReviewSchema);
