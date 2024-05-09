const JWT = require('jsonwebtoken');
const Key = process.env.JWT_SECRET;

async function authMiddleware(req, res, next) {
    const session = req.session;
    if (!session.isAuth) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    next();
}

module.exports = authMiddleware;