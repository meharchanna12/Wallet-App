const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "jwtsecret";

const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ msg: "Authorization token missing" });
        }
        
        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ msg: "Authorization token missing" });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        if (decoded && decoded.userId) {
            req.userId = decoded.userId;
            next();
        } else {
            return res.status(403).json({ msg: "Invalid token" });
        }
    } catch (err) {
        return res.status(403).json({ msg: "Invalid or expired token", error: err.message });
    }
};

module.exports = {
    authMiddleware
};
