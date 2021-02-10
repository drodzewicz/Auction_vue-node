const User = require("../models/user");
const PassportLocal = require("passport-local");

module.exports = (passport) => {
    passport.use(new PassportLocal(
        function (username, password, done) {
            User.findOne({ username: username }, async function (err, user) {
                if (err) {
                    return done(err);
                }
                if (user) {
                    if (await user.isValidPassword(password)) {
                        done(null, { id: user._id, username: user.username, avatarImage: user.avatarImage });
                    } else {
                        done(null, null);
                    }
                } else {
                    done(null, null);
                }
                return done(null, false, { message: "Bad login" });
            });
        }
    ));

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        User.findOne({ _id: id }, (err, user) => {
            if (err) {
                done(err);
            }
            if (user) {
                done(null, {
                    id: user._id,
                    username: user.username,
                    password: user.password
                });
            } else {
                done({
                    msg: "bad ID"
                });
            }
        });
    });
};
