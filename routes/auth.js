const express = require("express");
const passport = require("passport");
const router = express.Router();

// @desc  Google Authentication
// @route GET /google

router.get("/google", passport.authenticate("google", { scope: ["profile"] }));
// @desc  callback url
// @route GET  /google/callback

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect("/dashboard");
  }
);

// @desc Logout
// @route GET /auth/logout

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;
