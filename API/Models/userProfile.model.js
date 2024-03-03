const mongoose = require('mongoose');

const profileSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    name: {
        type: String,
    },
    phoneNo: {
        type: Number,
    },
    profileImage: {
        type: String,
    },
}, { timestamps: true }
);

module.exports = mongoose.model('Profile', profileSchema);