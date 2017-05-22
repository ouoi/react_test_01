var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(request, response, next) {
	response.sendFile(path.resolve(__dirname, 'public', 'index.html'));
});

module.exports = router;
