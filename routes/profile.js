/**
 * profile API
 *
 * @auth	ldw
 * @date	2017.04.25
 */
var express = require('express');
var router = express.Router();
var UserModel = require('../models/UserModel.js');
var ProfileModel = require('../models/ProfileModel.js');

// 로그인 체크 모듈
var loginRequired = require('../libs/loginRequired');

// CSRF 설정
var csrf = require('csurf');
var csrfProtection = csrf({cookie: true});

// 내 계정 정보 페이지
router.get('/', loginRequired, function(request, response) {
	UserModel.findOne(
		{id: request.user.id}, 
		function (err, user) {
			ProfileModel.findOne(
				{user_id: request.user.id}, 
				function (err, profile) {
					response.render('users/detail', {user: user, profile: profile || '', permission: true});
				}
			);
		}
	);
});

// 내 계정 정보 수정 페이지
router.get('/edit', loginRequired, csrfProtection, function(request, response) {
	UserModel.findOne(
		{id: request.user.id}, 
		function (err, user) {
			ProfileModel.findOne(
				{user_id: request.user.id}, 
				function (err, profile) {
					response.render('users/form', {user: user, profile: profile || '', csrfToken: request.csrfToken(), permission: true});
				}
			);
		}
	);
});

// 내 계정 정보 수정
router.post('/edit', loginRequired, csrfProtection, function (request, response) {
	var body = request.body;
	var queryUser = {
		id: request.user.id,
		displayname: body.displayname
	};
	var queryProfile = {
		user_id: request.user.id,
		birthday: body.birthday,
		phone: body.phone,
		gender: body.gender
	};

	UserModel.update(
		{id: request.user.id}, 
		{$set: queryUser}, 
		function (err) {
			ProfileModel.findOne({user_id: request.user.id}, function (err, data) {
				if (data) {
					ProfileModel.update(
						{user_id: request.user.id}, 
						{$set: queryProfile}, 
						function (err) {
							response.redirect('/profile');
						}
					);
				} else {
					var profile = new ProfileModel(queryProfile);
					profile.save( 
						function (err) {
							response.redirect('/profile');
						}
					);
				}
			});
		}
	);
});


module.exports = router;