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

// generator 모듈
var co = require('co');

// CSRF 설정
var csrf = require('csurf');
var csrfProtection = csrf({cookie: true});

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
router.get('/list', function (request, response) {
	PostModel.find({}, (err , posts) => {
		response.json({posts: posts});
	});
});

// 글 작성 페이지
router.get('/write', loginRequired, csrfProtection, function (request, response) {
	response.render('posts/form', {post : '', csrfToken: request.csrfToken()});
});

// 글 작성
router.post('/write', loginRequired, upload.single('thumbnail'), csrfProtection, function (request, response) {
	var body = request.body;
	var post = new PostModel({
		title: body.title,
		content: body.content,
		thumbnail : (request.file) ? request.file.filename : "",
		username: request.user.displayname
	});

	// validation check
	var validationError = post.validateSync();
	if (validationError) {
		response.send(validationError.errors.title.message);
	} else {
		post.save(function (err) {
			response.redirect('/posts');
		});
	}
});

// 상세글 페이지
router.get('/detail/:id', csrfProtection, function (request, response) {
	var getPost = co(function* () {
		var post = yield PostModel.findOne({id: request.params.id}).exec();
		var comments = yield CommentModel.find({post_id: request.params.id}).exec(); 
		return {
			post: post,
			comments: comments
		};
	});
	getPost.then(result => {
		response.render('posts/detail', {post: result.post, comments: result.comments, csrfToken: request.csrfToken()});
	});
});

// 글 수정 페이지
router.get('/edit/:id', loginRequired, csrfProtection, function (request, response) {
	PostModel.findOne(
		{id: request.params.id}, 
		function (err, data) {
			response.render('posts/form', {post: data, csrfToken: request.csrfToken()});
		}
	);
});

// 글 수정
router.post('/edit/:id', loginRequired, upload.single('thumbnail'), csrfProtection, function (request, response) {
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
router.get('/delete/:id', csrfProtection, function (request, response) {
	// 파일 삭제를 위한 조회
	PostModel.findOne({id: request.params.id}, function (err, post) {
		// 파일이 존재할 경우 이전 이미지 삭제
		if (post.thumbnail) {
			fs.unlinkSync(uploadDir + '/' + post.thumbnail);
		}
		
		PostModel.remove(
			{id: request.params.id}, 
			function (err) {
				response.redirect('/posts');
			}
		);
	});
});


/********** comment **********/
// ajax 댓글 추가
router.post('/ajax_comment/insert', csrfProtection, function (request, response) {
	var body = request.body;
	var comment = new CommentModel({
		content: body.content,
		post_id: parseInt(body.post_id)
	});
	comment.save(function (err, data) {
		response.json({
			id: data.id,
			content: data.content,
			message: 'success'
		});
	});
});

// ajax 댓글 삭제
router.post('/ajax_comment/delete', function (request, response) {
	CommentModel.remove(
		{id: request.body.comment_id}, 
		function (err) {
			response.json({message: 'success'});
		}
	);
});

module.exports = router;