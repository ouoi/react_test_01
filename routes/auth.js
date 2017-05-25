/**
 * auth API
 *
 * @auth	ldw
 * @date	2017.04.19
 */
var express = require('express');
var router = express.Router();
var UserModel = require('../models/UserModel.js');

var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;

// 처음 로그인시 호출
passport.serializeUser((user, done) => {
	console.log('serializeUser - facebook');
	done(null, user);
});

// 로그인 후 조회시 호출
passport.deserializeUser((user, done) => {
	console.log('deserializeUser - facebook');
	done(null, user);
});

passport.use(new FacebookStrategy({
		clientID: '1876861529269291',
		clientSecret: '695161849e6f417eb9a14d01e88e8f17',
		callbackURL: 'http://localhost:3000/auth/facebook/callback',
		profileFields: ['id', 'displayName', 'photos', 'email']
	},
	function (accessToken, refreshToken, profile, done) {
		UserModel.findOne(
			{username: "fb_" + profile.id},
			function (err, user) {
				if (!user) {
					// 회원 가입이 안되어있는 경우 회원 가입 후 로그인 처리
					var regData = {
						username: "fb_" + profile.id,
						displayname: profile.displayName,
						password: profile.id
					};
					var User = new UserModel(regData);
					User.save(function (err) {
						done(null, regData);
					});
				} else {
					return done(null, user);
				}
			}
		);
	})
);

// 페이스북 로그인 요청
router.get('/facebook', passport.authenticate('facebook', {scope: 'email'}));

// 페이스북 로그인 callback 등록
router.get('/facebook/callback', 
	passport.authenticate('facebook', {
		successRedirect: '/posts',
		failureRedirect: '/auth/facebook/fail'
	})
);

// 페이스북 로그인 성공
router.get('/facebook/success', function (request, response) {
	response.send(request.user);
});

// 페이스북 로그인 실패
router.get('/facebook/fail', function (request, response) {
	response.send('Facebook Login Fail');
});

module.exports = router;