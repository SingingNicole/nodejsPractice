// 인증서 없어서 실행 x

const http2 = require('http2');
const fs = require('fs');

// http2는 https와 유사.
// 첫 번째 인수: 인증서 관련 옵션 객체. pem, crt, key
// 두 번째 인수: 서버 로직
http2.createSecureServer({
    // 소지하고 있는 인증서 경로 입력
    cert: fs.readFileSync('도메인 인증서 경로'),
    key: fs.readFileSync('도메인 비밀 키 경로'),
    ca: [
        fs.readFileSync('상위 인증서 경로'),
        fs.readFileSync('상위 인증서 경로'),
    ],
}, (req, res) => {
    res.writeHead(200, { 'Content-Type':'text/html; charset=utf-8' });
    res.write('<h1>Hello Node!</h1>');
    res.end('<p>Hello Server!</p>');
})
    .listen(443, () => {
        // 인증서가 있을 경우 443 포트 사용
        console.log('443번 포트에서 서버 대기 중입니다.');
    });