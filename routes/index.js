var express = require('express');
var router = express.Router();
var PostModel = require('../models/PostModel.js');

/* GET home page. */
router.get('/', function(request, response, next) {
	PostModel.find({}, function (err, data) {
		response.render('index', {posts: data});
	});
});

module.exports = router;
