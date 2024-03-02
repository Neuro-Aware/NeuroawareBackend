const controller = require('../Controller/auth.controller');
const express = require('express');
const authMiddleware = require('../Middleware/auth.middleware');

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

module.exports = router;