/**
 * accounts API
 *
 * @auth	ldw
 * @date	2017.04.19
 */
var express = require('express');
var router = express.Router();
var passwordHash = require('../libs/passwordHash');
var UserModel = require('../models/UserModel.js');

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

// 처음 로그인시 호출
passport.serializeUser(function (user, done) {
	console.log('serializeUser');
	delete user.password;
	done(null, user);
});

// 로그인 후 조회시 호출
passport.deserializeUser(function (user, done) {
	console.log('deserializeUser');
	delete user.password;
	done(null, user);
});

passport.use(new LocalStrategy({
		usernameField: 'username',
		passwordField: 'password',
		passReqToCallback: true
	},
	function (request, username, password, done) {
		UserModel.findOne(
			{
				username: username, 
				password: passwordHash(password)
			},
			function (err, user) {
				if (!user) {
					return done(null, false, {message: '아이디 또는 비밀번호 오류 입니다.'});
				} else {
					return done(null, user);
				}
			}
		);
	})
);


router.get('/', function (request, response) {
	response.send('accounts');
});

// 회원가입 페이지
router.get('/join', function (request, response) {
	response.render('accounts/join');
});

// 회원가입
router.post('/join', function (request, response) {
	var body = request.body;
	var User = new UserModel({
		username: body.username,
		displayname: body.displayname,
		password: passwordHash(body.password)
	});

	User.save(function (err) {
		response.send('<script>alert("회원가입 성공");location.href="/accounts/login";</script>');
	});
});

// 로그인 페이지
router.get('/login', function (request, response) {
	response.render('accounts/login', {flashMessage: request.flash().error});
});

// 로그인
router.post('/login', 
	passport.authenticate('local', {
		failureRedirect: '/accounts/login',
		failureFlash: true
	}),
	function (request, response) {
		response.send('<script>alert("로그인 성공");location.href="/posts";</script>');
	}
);

// 로그인 성공
router.get('/success', function (request, response) {
	response.send(request.user);
});

// 로그아웃
router.get('/logout', function (request, response) {
	request.logout();
	response.redirect('/accounts/login');
});

module.exports = router;