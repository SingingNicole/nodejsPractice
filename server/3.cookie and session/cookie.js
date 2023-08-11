const http = require('http');

http.createServer((req, res) => {
    console.log(req.url, req.headers.cookie);   // 기록된 쿠키 출력
    res.writeHead(200, { 'Set-Cookie':'mycookie=test' });
    res.end('Hello Cookie');    // 웹 페이지에서 출력
}).listen(8083, () => {
    console.log('8083번 포트에서 서버 대기 중입니다.');
});