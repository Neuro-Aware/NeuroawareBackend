const controller = require('../controller/auth.controller');
const express = require('express');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

router.post("/register", (req, res) => {
    controller.handleRegister(req, res);
});

router.post("/login", (req, res) => {
    controller.handleLogin(req, res);
});

router.get("/logout", authMiddleware, (req, res) => {
    controller.handleLogout(req, res)
});

router.post("/changepassword", authMiddleware, (req, res) => {
    controller.handleChangePassword(req, res);
});

module.exports = router;