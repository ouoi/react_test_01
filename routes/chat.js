/**
 * chatting API
 *
 * @auth	ldw
 * @date	2017.04.22
 */
var express = require('express');
var router = express.Router();

// 채팅 페이지
router.get('/', function (request, response) {
	if (!request.isAuthenticated()) {
		response.send('<script>alert("로그인이 필요한 서비스입니다.");location.href="/accounts/login";</script>');
	} else {
		response.render('chat/chat');
	}
});





module.exports = router;