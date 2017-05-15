/**
 * socket connection 모듈
 *
 * @auth	ldw
 * @date	2017.04.26
 */
require('./removeByValue')();

module.exports = function (io) {
	var userList = [];

	io.on('connection', function (socket) {
		var session = socket.request.session.passport;
		var user = (typeof session !== 'undefined') ? session.user : '';

		// 사용자 연결 추가
		if (user && userList.indexOf(user.displayname) === -1) {
			userList.push(user.displayname);
		}
		io.emit('join', userList);

		// 사용자 연결 해제
		socket.on('disconnect', function () {
			userList.removeByValue(user.displayname);
			io.emit('leave', userList);
		});

		socket.on('chat message', function (data) {
			io.emit('to-client', {message: data.message, displayname: user.displayname});
		});
	});
};