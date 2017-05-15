var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

/* start - ldw */
// flash message
var flash = require('connect-flash');

// passport login
var passport = require('passport');
var session = require('express-session');

// Database 연동
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var autoIncrement = require('mongoose-auto-increment');
var db = mongoose.connection;
db.on('error', console.error);
db.on('open', function () {
	console.log('MongoDB Connect');
});

var connect = mongoose.connect('mongodb://127.0.0.1:27017/exercise');
autoIncrement.initialize(connect);
/* end - ldw */

var index = require('./routes/index');

/* start - ldw URL 연동 */
var users = require('./routes/users');
var profile = require('./routes/profile');
var posts = require('./routes/posts');
var contact = require('./routes/contact');
var accounts = require('./routes/accounts');
var auth = require('./routes/auth');
var chat = require('./routes/chat');
/* end - ldw */

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/* start - ldw */
// 파일 업로드 경로
app.use('/uploads', express.static('uploads'));

// session 설정
/*
app.use(session({
	secret: 'dlejrdn',
	resave: false,
	saveUninitialized: true,
	cookie: {
		maxAge: 1000 * 60 * 60 * 2 // 유효시간 2시간
	}
}));
*/
var sessionMiddleWare = session({
	secret: 'dlerjdn',
	resave: false,
	saveUninitialized: true,
	cookie: {
		maxAge: 2000 * 60 * 60 // 지속시간 2시간
	}
});
app.use(sessionMiddleWare);

// passport 설정
app.use(passport.initialize());
app.use(passport.session());

// flash message 설정
app.use(flash());

// 뷰에서 사용할 데이터 설정
app.use(function (request, response, next) {
	app.locals.isLogin = request.isAuthenticated();	// 로그인 여부
	//app.locals.urlparameter = req.url;	// URL 정보
	//app.locals.userData = req.user;	// 사용자 정보
	next();
});
/* end - ldw */

app.use('/', index);

/* start - ldw 페이지 연동 */
app.use('/users', users);
app.use('/profile', profile);
app.use('/posts', posts);
app.use('/contact', contact);
app.use('/accounts', accounts);
app.use('/auth', auth);
app.use('/chat', chat);
/* end - ldw */

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handler
app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});


/* start - ldw */
// socket.io 설정
app.io = require('socket.io')();
app.io.use(function (socket, next) {
	sessionMiddleWare(socket.request, socket.request.res, next);
});
require('./libs/socketConnection')(app.io);
/* end - ldw */

module.exports = app;
