const mongoose = require('mongoose');
const { hashPassword,checkPassword } = require('../utils');

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        match: /^[a-zA-Z0-9._-]+$/
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
    },
    password: { type: String, required: true },
}, { timestamps: true }
);

userSchema.methods.validateAndSave = async function (password) {
    if (await this.constructor.exists({ $or: [{ username: this.username }, { email: this.email }] })) {
        throw new Error('User already exists');
    }
    this.password = await hashPassword(password);
    return this.save();
};

userSchema.methods.checkPassword = async function (password) {
    return await checkPassword(password, this.password);
};

userSchema.methods.updatePassword = async function (password) {
    this.password = hashPassword(password);
    return this.save();
};

module.exports = mongoose.model('User', userSchema);