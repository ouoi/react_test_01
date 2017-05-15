/**
 * contact API
 *
 * @auth	ldw
 * @date	2017.04.13
 */
var express = require('express');
var router = express.Router();
var ContactModel = require('../models/ContactModel.js');

// 글 리스트 페이지
router.get('/', function (request, response) {
	ContactModel.find({}, function (err, data) {
		response.render('contact/list', {contactList: data});
	});
});

// 글 작성 페이지
router.get('/write', function (request, response) {
	response.render('contact/form', {contact: ''});
});

// 글 작성
router.post('/write', function (request, response) {
	var body = request.body;
	var contact = new ContactModel({
		title: body.title,
		content: body.content
	});
	contact.save(function (err) {
		response.redirect('/contact');
	});
});

// 상세글 페이지
router.get('/detail/:id', function (request, response) {
	ContactModel.findOne(
		{id: request.params.id}, 
		function (err, data) {
			response.render('contact/detail', {contact: data});
		}
	);
});

// 글 수정 페이지
router.get('/edit/:id', function (request, response) {
	ContactModel.findOne(
		{id: request.params.id}, 
		function (err, data) {
			response.render('contact/form', {contact: data});
		}
	);
});

// 글 수정
router.post('/edit/:id', function (request, response) {
	var body = request.body;
	var query = {
		title: body.title,
		content: body.content
	};
	ContactModel.update(
		{id: request.params.id}, 
		{$set: query}, 
		function (err) {
			response.redirect('/contact/detail/' + request.params.id);
		}
	);
});

// 글 삭제
router.get('/delete/:id', function (request, response) {
	ContactModel.remove(
		{id: request.params.id}, 
		function (err) {
			response.redirect('/contact');
		}
	);
});


/********** 댓글 **********/


module.exports = router;