const Profile = require('../models/userProfile.model');
const User = require('../models/user.model');

async function handleUserGetMe(req, res) {
    const user = await User.findById(req.session.userId);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    const userProfile = await Profile.findOne({ user: user._id });
    if (!userProfile) {
        return res.status(404).json({ message: 'Profile not found' });
    }
    return res.status(200).json({
        message: 'Profile success',
        details: {
            username: user.username,
            email: user.email,
            name: userProfile.name,
            phoneNo: userProfile.phoneNo
        }

    });
}

async function handleUpdateDetails(req, res) {
    const body = {
        user: req.session.userId,
        name: req.body.name,
        phoneNo: req.body.phoneNo,
    };
    console.log(body);
    if (!body.name || !body.phoneNo) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const user = await User.findById(req.session.userId);
    const userProfile = await Profile.findOneAndUpdate({ user: req.session.userId }, body, { upsert: true, });
    if (!userProfile) {
        return res.status(404).json({ message: 'Profile not found' });
    }
    return res.status(201).json({
        message: 'Profile updated',
        details: {
            username: user.username,
            email: user.email,
            name: userProfile.name,
            phoneNo: userProfile.phoneNo
        }
    });
}

async function handleUpdateImage(req, res) {
    const body = {
        profileImage: req.file.location,
    };

    if (!body.profileImage) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    const profile = await Profile.findOneAndUpdate({ user: req.session.userId }, body, { upsert: true });
    if (!profile) {
        return res.status(404).json({ message: 'Profile not found' });
    }


    profile.save();

    res.status(201).json({ message: 'Profile Image Updated' });

}

async function handleImageGet(req, res) {
    //send image path in form of image directly
    const profile = await Profile.findOne({ user: req.session.userId });
    if (!profile) {
        return res.status(404).json({ message: 'Profile not found' });
    }
    if (!profile.profileImage) {
        res.status(200).sendFile('uploads/default-profile-picture1.jpg', { root: './' })
    }
    
    res.redirect(profile.profileImage);
}


module.exports = { handleUpdateDetails, handleUserGetMe, handleUpdateImage, handleImageGet }