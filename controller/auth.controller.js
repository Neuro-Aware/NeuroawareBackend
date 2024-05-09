const bcrypt = require('bcrypt');

const User = require('../models/user.model');
const UserProfile = require('../models/userProfile.model');
const sessions = require('express-session');
const { checkPassword } = require('../utils');


async function handleRegister(req, res) {
    const body = req.body;
    if (!body.username || !body.email || !body.password || !body.confirmPassword) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    if (body.password !== body.confirmPassword) {
        return res.status(400).json({ message: 'Confirm Password do not match' });
    }
    const user = new User(body);
    const profile = new UserProfile({ user: user._id });
    try {
        await user.validateAndSave(body.password);
        await profile.save();
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
    const isPasswordValid = await user.checkPassword(password, user.password);
    if (!isPasswordValid) {
        return res.status(403).json({ message: 'Invalid password' });
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
                    
                });
            }
        });
    });
    
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

async function handleChangePassword(req, res) {
    const { oldPassword, newPassword, confirmPassword } = req.body;
    const user = await User.findById(req.session && req.session.userId);
    if (!oldPassword || !newPassword || !confirmPassword) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid password' });
    }
    if (newPassword !== confirmPassword) {
        return res.status(400).json({ message: 'Confirm Password do not match' });
    }
    await user.updatePassword(newPassword);
    res.status(200).json({ message: 'Password updated' });
}


module.exports = { handleLogin, handleRegister, handleLogout, handleChangePassword};
