/**
 * users API
 *
 * @auth	ldw
 * @date	2017.04.25
 */
var express = require('express');
var router = express.Router();
var UserModel = require('../models/UserModel.js');
var ProfileModel = require('../models/ProfileModel.js');

// 사용자 리스트 페이지
router.get('/', function(request, response) {
	UserModel.find({}, function (err, data) {
		response.render('users/list', {users: data});
	});
});

// 사용자 정보 상세 페이지
router.get('/:id', function (request, response) {
	UserModel.findOne(
		{id: request.params.id}, 
		function (err, user) {
			ProfileModel.findOne(
				{user_id: request.params.id}, 
				function (err, profile) {
					response.render('users/detail', {user: user, profile: profile || '', permission: false});
				}
			);
		}
	);
});

module.exports = router;