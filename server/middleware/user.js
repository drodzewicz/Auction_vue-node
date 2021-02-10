const userMiddleware = {};
const User = require("../models/user");

userMiddleware.isLoggedIn = async function (req, res, next) {
    try {
        const foundUser = await User.findById(req.user.id);
        req.user = {
            user: foundUser.username,
            id: foundUser.id,
            avatarImage: foundUser.avatarImage
        };
        return next();
    } catch (error) {
        return res.status(401).json({ msg: "not logged in" });
    }
};

module.exports = userMiddleware;
