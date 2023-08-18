const axios = require('axios');

// 변수명 꼭 확인!
const URL = process.env.API_URL;
axios.defaults.headers.origin = process.env.ORIGIN; // origin 헤더 추가

/* 
exports.test = async (req, res, next) => {
    try {
        if(!req.session.jwt) {
            const tokenResult = await axios.post('http://localhost:8002/v1/token', {
                clientSecret: process.env.CLIENT_SECRET,
            });
            if(tokenResult.data?.code === 200) {
                req.session.jwt = tokenResult.data.token;
            } else {
                return res.json(tokenResult.data);
            }
        }
        const result = await axios.get('http://localhost:8002/v1/test', {
            headers: { authorization: req.session.jwt },
        });
        return res.json(result.data);
    } catch(error) {
        if(error.response?.status === 419) {
            return res.json(error.response.data);
        }
        return next(error);
    }
};
*/

const request = async (req, api) => { 
    try {
        if(!req.session.jwt) {  // 세션에 토큰이 없으면 발급 시도
            const tokenResult = await axios.post(`${URL}/token`, {
                // .env와 변수명 일치시켜야 함.
                clientSecret: process.env.CLIENT_SECRET,
            });
            if(tokenResult.data?.code === 200) {    // 토큰 발급 성공
                req.session.jwt = tokenResult.data.token;   // 세션에 토큰 저장
            }
            return await axios.get(`${URL}${api}`, {
                headers: { authorization: req.session.jwt },
            }); // api 요청
        }
    } catch(error) {
        if(error.response?.status === 419) {    // 토큰 만료 시
            delete req.session.jwt;
            return request(req, api);
        }   // 419 외 다른 에러일 경우
        return error.response;
    }
};

exports.getMyPosts = async (req, res, next) => {
    try {
        const result = await request(req, '/posts/my');
        res.json(result.data);
    } catch(error) {
        console.error(error);
        next(error);
    }
};

exports.searchByHashtag = async (req, res, next) => {
    try {
        const result = await request(
            req, `/posts/hashtag/${encodeURIComponent(req.params.hashtag)}`,
        );
        res.json(result.data);
    } catch(error) {
        if(error.code) {
            console.error(error);
            next(error);
        }
    }
};

exports.renderMain = (rez, res) => {
    res.render('main', { key: process.env.CLIENT_SECRET });
};