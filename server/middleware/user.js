const userMiddleware = {};

userMiddleware.isLoggedIn = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        return res.status(401).json({ msg: "not logged in" });
    }
};

module.exports = userMiddleware;
