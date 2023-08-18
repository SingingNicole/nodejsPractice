const express = require('express');
const passport = require('passport');

const { isLoggedIn, isNotLoggedIn } = require('../middlewares');
const { join, login, logout } = require('../controllers/auth');

const router = express.Router();

// POST /auth/join
router.post('/join', isNotLoggedIn, join);

// POST /auth/login
router.post('/login', isNotLoggedIn, login);

// GET /auth/logout
router.get('/logoutlocal', isLoggedIn, logout);

// GET / auth/kakao
router.get('/kakao', passport.authenticate('kakao'));

// GET /auth/kakao/callback
router.get('/kakao/callback', passport.authenticate('kakao', {
    failureRedirect: '/?error=카카오로그인 실패',
}), (req, res) => {
    res.redirect('/');  // 성공 시에는 /로 이동
});

router.get('/logoutkakao', isLoggedIn, async (req, res, next) => {
    const redirectLogoutURI = "https://kauth.kakao.com/oauth/logout?client_id=" + process.env.KAKAO_ID + "&logout_redirect_uri=http://localhost:8001/auth/kakao/logout"
    res.redirect(redirectLogoutURI);
});

router.get('/kakao/logout', (req, res) => {
    req.logout(() => {
        res.redirect('/');
    });
});

module.exports = router;