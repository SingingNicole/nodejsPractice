const http = require('http');
const fs = require('fs').promises;  

http.createServer(async(req, res) => {
    try{
        // fs 모듈로 html 파일을 읽는다.
        const data = await fs.readFile('./server2.html');
        res.writeHead(200, { 'Content-Type':'text/html; charset=utf-8' });
        res.end(data);
    }catch(err){
        console.error(err);
        // 에러 메시지 출력 => 일반 텍스트이므로 text/plain 사용
        res.writeHead(500, { 'Content-Type':'text/plain; charset=utf-8' });
        res.end(err.message);
    }
}).listen(8081, () => {
    console.log('8081번 포트에서 서버 대기 중입니다.');
});