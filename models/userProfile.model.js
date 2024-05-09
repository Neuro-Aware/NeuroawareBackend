const mongoose = require('mongoose');

const profileSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    name: {
        type: String,
        default: 'Anonymous',
    },
    phoneNo: {
        type: Number,
        default: 0,
    },
    profileImage: {
        type: String,
    },
}, { timestamps: true }
);

module.exports = mongoose.model('Profile', profileSchema);