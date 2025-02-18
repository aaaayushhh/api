const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded; // Attach user info to the request object
        next(); // Proceed to the next middleware or route handler
    } catch (err) {
        res.status(401).json({ message: 'Invalid or expired token, Please Login again' });
    }
};