const express = require('express');
const router = express.Router();
const authConroller = require('../controllers/authConroller');

router.route('/register')
    .post(authConroller.handleNewUser)

router.route('/login')
    .post(authConroller.handleLogin)

router.route('/refresh')
    .get(authConroller.handleRefreshToken)

router.route('/logout')
    .get(authConroller.handleLogout)

module.exports = router;