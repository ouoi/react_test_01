/**
 * comment model
 *
 * @auth	ldw
 * @date	2017.04.13
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');

var CommentSchema = new Schema({
	content: String,
	created_at: {
		type: Date,
		default: Date.now()
	},
	post_id: Number
});

function getTwoDigit(number) {
	return number < 10 ? '0' + number : number;
}

CommentSchema.virtual('getDate').get(function () {
	var date = new Date(this.created_at);
	return date.getFullYear() + '.' + getTwoDigit(date.getMonth() + 1) + '.' + getTwoDigit(date.getDate());
});

CommentSchema.plugin(autoIncrement.plugin, {
	model: 'comment',
	field: 'id',
	startAt: 1
});
module.exports = mongoose.model('comment', CommentSchema);