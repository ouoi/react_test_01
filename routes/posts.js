/**
 * posts API
 *
 * @auth	ldw
 * @date	2017.04.08
 */
var express = require('express');
var router = express.Router();
var PostModel = require('../models/PostModel.js');
var CommentModel = require('../models/CommentModel.js');

// 로그인 체크 모듈
var loginRequired = require('../libs/loginRequired');

// file upload
var path = require('path');
var uploadDir = path.join(__dirname, '../uploads');
var fs = require('fs');

var multer = require('multer');
var storage = multer.diskStorage({
	destination: function (request, file, callback) {
		callback(null, uploadDir);
	},
	filename: function (request, file, callback) {
		callback(null, 'posts-' + Date.now() + '.' + file.mimetype.split('/')[1]);
	}
});
var upload = multer({storage: storage});

// 글 리스트 페이지
router.get('/list', (request, response) => {
	PostModel.find({}, (err , posts) => {
		response.json({posts: posts});
	});
});

// 글 작성 페이지
router.get('/write', loginRequired, function (request, response) {
	response.render('posts/form', {post : ''});
});

// 글 작성
router.post('/write', loginRequired, upload.single('thumbnail'), function (request, response) {
	var body = request.body;
	var post = new PostModel({
		title: body.title,
		content: body.content,
		thumbnail: (request.file) ? request.file.filename : "",
		username: request.user.displayname
	});

	// validation check
	var validationError = post.validateSync();
	if (validationError) {
		response.send(validationError);
	} else {
		post.save((err) => {
			response.json({message:"success"});
		});
	}
});

// 글 상세 정보
router.get('/detail/:id', (request, response) => {
	PostModel.findOne({id: request.params.id}, (err, post) => {
		CommentModel.find({post_id: request.params.id}, (err, comments) => {
			response.json({post: post, comments: comments});
		});
	});
});

// 글 수정 페이지
router.get('/edit/:id', loginRequired, function (request, response) {
	PostModel.findOne(
		{id: request.params.id}, 
		function (err, data) {
			response.render('posts/form', {post: data, csrfToken: request.csrfToken()});
		}
	);
});

// 글 수정
router.post('/edit/:id', loginRequired, upload.single('thumbnail'), function (request, response) {
	// 이전 파일명 얻기
	PostModel.findOne({id: request.params.id}, function (err, post) {
		// 파일이 존재할 경우 이전 이미지 삭제
		if (request.file) {
			fs.unlinkSync(uploadDir + '/' + post.thumbnail);
		}

		var body = request.body;
		var query = {
			title: body.title,
			content: body.content,
			thumbnail: (request.file) ? request.file.filename : post.thumbnail,
			username: request.user.displayname
		};

		// valication check
		var post = new PostModel(query);
		if (!post.validateSync()) {
			PostModel.update(
				{id: request.params.id}, 
				{$set: query}, 
				function (err) {
					response.redirect('/posts/detail/' + request.params.id);
				}
			);
		}
	});
});

// 글 삭제
router.get('/delete/:id', (request, response) => {
	// 파일 삭제를 위한 조회
	PostModel.findOne({id: request.params.id}, (err, post) => {
		// 파일이 존재할 경우 이전 이미지 삭제
		if (post.thumbnail) {
			fs.unlinkSync(uploadDir + '/' + post.thumbnail);
		}
		
		PostModel.remove(
			{id: request.params.id}, 
			(err) => {
				response.redirect('/posts');
			}
		);
	});
});

module.exports = router;