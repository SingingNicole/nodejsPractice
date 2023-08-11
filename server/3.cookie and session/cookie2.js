const http = require('http');
const fs = require('fs').promises;
const path = require('path');

// 쿠키 문자열을 쉽게 사용하기 위해 자바스크립트 객체 형식으로 바꾼다.
const parseCookies = (cookie = '') =>
    cookie
        .split(';')
        .map(v => v.split('='))
        .reduce((acc, [k, v]) => {
            acc[k.trim()] = decodeURIComponent(v);
            return acc;
        }, {});

http.createServer(async(req, res) => {
    const cookies = parseCookies(req.headers.cookie);

    // 주소가 /login으로 시작하는 경우
    if(req.url.startsWith('/login')){
        const url = new URL(req.url, 'http://localhost:8084');
        const name = url.searchParams.get('name');
        const expires = new Date();
        // 쿠키 유효 시간을 현재 시간 + 5분으로 설정
        expires.setMinutes(expires.getMinutes() + 5);
        res.writeHead(302, {
            Location: '/',
            // 헤더에 한글을 설정할 수 없으므로 name 변수를 encodeURIComponent를 사용하여 아스키 코드로 변경.
            // Expires=날짜: 만료 기간
            // HttpOnly: 설정 시 자바스크립트에서 쿠키에 접근할 수 없음. 쿠키 조작 방지.
            'Set-Cookie':`name=${encodeURIComponent(name)}; Expires=${expires.toGMTString()}; HttpOnly; Path=/`,
        });
        res.end();
    }else if(cookies.name){
        // 주소가 /이면서 name이라는 쿠키가 있는 경우
        res.writeHead(200, { 'Content-Type':'text/plain; charset=utf-8' });
        res.end(`${cookies.name}님 안녕하세요.`);
    }else{
        // 주소가 /이면서 name이라는 쿠키가 없는 경우 로그인 할 수 있는 페이지를 보낸다.
        try{
            const data = await fs.readFile(path.join(__dirname, 'cookie2.html'));
            res.writeHead(200, { 'Content-Type':'text/html; charset=utf-8' });
            res.end(data);
        }catch(err){
            res.writeHead(500, { 'Content-Type':'text/plain; charset=utf-8' });
            res.end(err.message);
        }
    }
})
    .listen(8084, () => {
        console.log('8084번 포트에서 서버 대기 중입니다.');
    });