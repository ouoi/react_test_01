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
passport.serializeUser((user, done) => {
	console.log('serializeUser');
	delete user.password;
	done(null, user);
});

// 로그인 후 조회시 호출
passport.deserializeUser((user, done) => {
	console.log('deserializeUser');
	delete user.password;
	done(null, user);
});

passport.use(new LocalStrategy({
		usernameField: 'username',
		passwordField: 'password',
		passReqToCallback: true
	},
	(request, username, password, done) => {
		UserModel.findOne(
			{
				username: username, 
				password: passwordHash(password)
			},
			(err, user) => {
				if (!user) {
					return done(null, false, {message: '아이디 또는 비밀번호 오류 입니다.'});
				} else {
					return done(null, user);
				}
			}
		);
	})
);


router.get('/', (request, response) => {
	response.send('accounts');
});

// 회원가입 페이지
router.get('/join', (request, response) => {
	response.render('accounts/join');
});

// 회원가입
router.post('/join', (request, response) => {
	var body = request.body;
	var User = new UserModel({
		username: body.username,
		displayname: body.displayname,
		password: passwordHash(body.password)
	});

	User.save((err) => {
		response.json({message: "success"});
	});
});

// 로그인 페이지
router.get('/login', (request, response) => {
	response.render('accounts/login', {flashMessage: request.flash().error});
});

// 로그인
router.post('/login', (request, response, next) => {
	passport.authenticate('local', (err, user, info) => {
		if (!user) {
			return response.json({message: info.message});
		}
		request.logIn(user, (err) => {
			return response.json({message: "success"});
		});
	})(request, response, next);
});

// 로그인 성공
router.get('/success', (request, response) => {
	response.send(request.user);
});

// 로그아웃
router.get('/logout', (request, response) => {
	request.logout();
	response.redirect('/accounts/login');
});

// 로그인 상태
router.get('/status', (request, response) => {
	response.json({isLogin: request.isAuthenticated()});
});

module.exports = router;