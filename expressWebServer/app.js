const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const dotenv = require('dotenv');
const path = require('path');
const nunjucks = require('nunjucks');

dotenv.config();
const indexRouter = require('./routes');
const userRouter = require('./routes/user');

const app = express();  // express 모듈을 app 변수에 할당
app.set('port', process.env.PORT || 3000);  // 실행될 포트 설정
// 퍼그 익스프레스
    // app.set('views', path.join(__dirname, 'views'));
    // app.set('view engine', 'pug');

// nunjucks 사용하기
app.set('view engine', 'html');
nunjucks.configure('views', {
    express: app,
    watch: true,
});

// 미들웨어 사용하기
app.use(morgan('dev')); // 요청과 응답에 대한 정보를 콘솔에 기록. combined, common, short, tiny 등도 활용 가능
app.use('/', express.static(path.join(__dirname, 'public')));   // 정적인 파일을 제공하는 라우터.
// body-parser 미들웨어: 폼 데이터나 AJAX 요청 데이터 처리.
app.use(express.json());
app.use(express.urlencoded({ extended: false }));   // false일 경우 노드의 querystring 모듈 사용, true일 경우 qs 모듈 사용
// cookie-parser: 동봉된 쿠키를 해석해 req.cookies 객체로 변환
app.use(cookieParser(process.env.COOKIE_SECRET));
// express-session: 세션 관리용 미들웨어. 로그인 등의 이유로 세션을 구현하거나 특정 사용자를 위한 데이터를 임시 저장할 때 유용
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: false,
    },
    name: 'session-cookie',
}));

app.use('/', indexRouter);
app.use('/user', userRouter);

//app.use((req, res, next) => {
//    res.status(404).send('Not Found');
//});

// multer 사용
const multer = require('multer');
const fs = require('fs');

try {
    fs.readdirSync('uploads');
} catch(error) {
    console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
    fs.mkdirSync('uploads');
}
const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, done){
            done(null, 'uploads/');
        },
        filename(req, file, done){
            const ext = path.extname(file.originalname);
            done(null, path.basename(file.originalname, ext) + Date.now() + ext);
        },
    }),
    limits: { fileSize: 5 * 1024 * 1024 },
});
app.get('/upload', (req, res) => {
    res.sendFile(path.join(__dirname, 'multipart.html'));
});
app.post('/upload', upload.single('image'), (req, res) => {
    console.log(req.file);
    res.send('ok');
});

app.use((req, res, next) => {
    console.log('모든 요청에 다 실행됩니다.');
    next();
});

app.get('/', (req, res, next) => {
    // res.send('Hello, Express.');
    // res.sendFile(path.join(__dirname, '/index.html'));
    console.log('GET / 요청에서만 실행됩니다.');
    next();
}, (req, res) => {
    throw new Error('에러는 에러 처리 미들웨어로 갑니다.')
});

app.use((req, res, next) => {
    const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
    error.status = 404;
    next(error);
});

app.use((err, req, res, next) => {
    // console.log(err);
   // res.status(500).send(err.message);
   res.locals.message = err.message;
   res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
   res.status(err.status || 500);
   res.render('error');
});

app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기 중.');
});