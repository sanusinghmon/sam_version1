// middleware/roleCheck.js
module.exports = (roles) => {
    return (req, res, next) => {
        if (roles.includes(req.user.role)) {
            return next();
        }
        res.status(403).send('Access denied');
    };
};
