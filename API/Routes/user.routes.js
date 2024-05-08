const controller = require('../controller/user.controller');
const express = require('express');
const authMiddleware = require('../middleware/auth.middleware');
const multer = require('multer');


const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString().replace(/:/g, '-') + "-" + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});

router.get('/imageGet', authMiddleware, (req, res) => {
    controller.handleImageGet(req, res);
}
);

router.get('/getMe', authMiddleware, (req, res) => {
    controller.handleUserGetMe(req, res);
});

router.post('/updateDetails', authMiddleware, (req, res) => {
    controller.handleUpdateDetails(req, res);
});
router.post('/updateImage', authMiddleware, (req, res, next) => {
    // check if there is a file
    console.log(req);
    if (!req.files) {
        console.log('No file uploaded');
        // return res.status(400).json({ error: 'No file uploaded' });
    } else{
        log(req.files);
    }
    next();
}, upload.single('profileImage'), (req, res) => {
    controller.handleUpdateImage(req, res);
});

module.exports = router;