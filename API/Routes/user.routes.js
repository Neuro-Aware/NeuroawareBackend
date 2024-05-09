const controller = require('../controller/user.controller');
const express = require('express');
const authMiddleware = require('../middleware/auth.middleware');
const multer = require('multer');
const multerS3 = require("multer-s3");
const { S3Client } = require("@aws-sdk/client-s3");
const path = require('path');

const s3 = new S3Client({
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    },
    region: process.env.AWS_REGION
})

const s3Storage = multerS3({
    s3: s3,
    bucket: process.env.AWS_BUCKET_NAME,
    acl: "public-read",
    metadata: (req, file, cb) => {
        cb(null, {fieldname: file.fieldname})
    },
    key: (req, file, cb) => {
        const fileName = Date.now() + "_" + file.fieldname + "_" + file.originalname;
        cb(null, fileName);
    }
});

function sanitizeFile(file, cb) {
    const fileExts = [".png", ".jpg", ".jpeg", ".gif", ".webp"];

    const isAllowedExt = fileExts.includes(
        path.extname(file.originalname.toLowerCase())
    );

    const isAllowedMimeType = file.mimetype.startsWith("image/");

    if (isAllowedExt && isAllowedMimeType) {
        return cb(null, true);
    } else {
        cb("Error: File type not allowed!");
    }
}

const router = express.Router();

const multerUpload = multer({
    storage: s3Storage,
    fileFilter: (req, file, callback) => {
        sanitizeFile(file, callback)
    },
    limits: {
        fileSize: 1024 * 1024 * 2 // 2mb file size
    }
})

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
router.put('/updateImage', authMiddleware, multerUpload.single('profileImage'), (req, res) => {
    controller.handleUpdateImage(req, res);
});

module.exports = router;