/**
 * 암호화 모듈
 *
 * @auth	ldw
 * @date	2017.04.19
 */
var crypto = require('crypto');
var salt = 'dlejrdn';

module.exports = function (password) {
	return crypto.createHash('sha512').update(password + salt).digest('base64');
};