/**
 * user model
 *
 * @auth	ldw
 * @date	2017.04.19
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');

var UserSchema = new Schema({
	username: {
		type: String,
		required: [true, '아이디는 필수입니다.']
	},
	displayname: {
		type: String,
		required: [true, '이름은 필수입니다.']
	},
	password: {
		type: String,
		required: [true, '패스워드는 필수입니다.']
	},
	created_at: {
		type: Date,
		default: Date.now()
	}
});

UserSchema.virtual('getDate').get(function () {
	var date = new Date(this.created_at);
	/* return {
		year: date.getFullYear(),
		month: date.getMonth + 1,
		day: date.getDate()
	}; */
	return date.getFullYear() + '년 ' + (date.getMonth() + 1) + '월 ' + date.getDate() + '일';
});

UserSchema.plugin(autoIncrement.plugin, {
	model: 'user',
	field: 'id',
	startAt: 1
});
module.exports = mongoose.model('user', UserSchema);