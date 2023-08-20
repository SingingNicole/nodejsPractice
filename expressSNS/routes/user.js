const express = require('express');

const { isLoggedIn } = require('../middlewares');
const { follow, unfollow } = require('../controllers/user');

const router = express.Router();

// POST /user/:id/follow
router.post('/:id/follow', isLoggedIn, follow);

// DELETE /user/:id/unfollow
router.delete('/:id/unfollow', isLoggedIn, unfollow);

module.exports = router;