const bcrypt = require('bcrypt');

const User = require('../Models/user.model');
const sessions = require('express-session');


async function handleRegister(req, res) {
    const body = req.body;
    if (!body.username || !body.email || !body.password || !body.confirmPassword) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    if (body.password !== body.confirmPassword) {
        return res.status(400).json({ message: 'Confirm Password do not match' });
    }
    const user = new User(body);
    try {
        await user.validateAndSave(body.password);
        res.status(201).json({ message: 'User created' });
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
}

async function handleLogin(req, res) {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    if (!user) {
        return res.status(404).json({ message: 'User not found. Please create new account' });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid password' });
    }

    console.log(req.session);

    req.session.regenerate((err) => {
        if (err) throw err;
        req.session.isAuth = true;
        req.session.userId = user._id;
        req.session.save((err) => {
            if (err) {
                err.status = 500;
                throw err;
            } else {
                return res.status(200).json({
                    message: 'Successfully Logged in',
                    sessionID: req.sessionID,
                });
            }
        });
    });
    // console.log(res.headers.cookies);
}

async function handleLogout(req, res) {

    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: 'Already Logged Out' });
        } else {
            return res.status(200).json({ message: 'Successfully logged out' });
        }
    });
}


module.exports = { handleLogin, handleRegister, handleLogout };
