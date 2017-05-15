/**
 * profile model
 *
 * @auth	ldw
 * @date	2017.04.25
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');

var ProfileSchema = new Schema({
	user_id: Number,
	birthday: {
		type: Date
	},
	phone: String,
	gender: String
});

function getTwoDigit(number) {
	return number < 10 ? '0' + number : number;
}

ProfileSchema.virtual('getBirthday').get(function () {
	var date = new Date(this.birthday);
	return date.getFullYear() + '-' + getTwoDigit(date.getMonth() + 1) + '-' + getTwoDigit(date.getDate());
});

ProfileSchema.plugin(autoIncrement.plugin, {
	model: 'profile',
	field: 'id',
	startAt: 1
});
module.exports = mongoose.model('profile', ProfileSchema);