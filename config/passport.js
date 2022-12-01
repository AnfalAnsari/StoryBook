const GoogleStrategy = require("passport-google-oauth20").Strategy;
const mongoose = require("mongoose");

const User = require("../models/User");

module.exports = function (passport) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/auth/google/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        const newUser = {
          googleId: profile.id,
          displayName: profile.displayName,
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          image: profile.photos[0].value,
        };

        try {
          let user = await User.findOne({ googleId: profile.id });

          if (user) {
            done(null, user);
          } else {
            user = User.create(newUser);
            done(null, user);
          }
        } catch (err) {
          console.error(err);
        }

        return;
      }
    )
  );

  passport.serializeUser(function (user, done) {
    console.log(user);
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    // done(null, user);
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });
};
