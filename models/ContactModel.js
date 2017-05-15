/**
 * contact model
 *
 * @auth	ldw
 * @date	2017.04.13
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');

var ContactSchema = new Schema({
	title: String,
	content: String,
	created_at: {
		type: Date,
		default: Date.now()
	}
});

ContactSchema.virtual('getDate').get(function () {
	var date = new Date(this.created_at);
	/* return {
		year: date.getFullYear(),
		month: date.getMonth + 1,
		day: date.getDate()
	}; */
	return date.getFullYear() + '년 ' + (date.getMonth() + 1) + '월 ' + date.getDate() + '일';
});

ContactSchema.plugin(autoIncrement.plugin, {
	model: 'contact',
	field: 'id',
	startAt: 1
});
module.exports = mongoose.model('contact', ContactSchema);