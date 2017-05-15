/**
 * 로그인 체크 모듈
 *
 * @auth	ldw
 * @date	2017.04.22
 */
 module.exports = function (request, response, next) {
 	if (!request.isAuthenticated()) {
 		response.redirect('/accounts/login');
 	} else {
 		return next();
 	}
 };