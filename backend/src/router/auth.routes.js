const express = require('express')
const jwt=require('jsonwebtoken')
const { registerController, loginController, logoutController, verifyEmailController, forgetPasswordController, resetPasswordController, updatePasswordController, updateProfileController } = require('../controllers/auth.controller')
const authMiddleware = require('../middlewares/auth.middleware')
const passport = require('passport')
const router = express.Router()
router.post("/register", registerController)
router.post("/login", loginController)
router.post("/logout", authMiddleware, logoutController)
router.get("/verify-email/:token", verifyEmailController)

router.post("/forget-password", forgetPasswordController)
router.get("/reset-password/:token", resetPasswordController)
router.post("/update-password/:userID", updatePasswordController)
router.put("/update-profile/:userID", authMiddleware, updateProfileController);

//Google-auth
router.get("/google", passport.authenticate("google", { scope: ['profile', 'email'], prompt: "select_account" }))

router.get("/google/callback", 
  passport.authenticate('google', { 
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL}/login?error=google_auth_failed`
  }),
  (req, res) => {
    try {
      console.log("Google callback - User authenticated:", req.user.email)
      const token = jwt.sign(
        { id: req.user._id, email: req.user.email, userRole: req.user.userRole }, 
        process.env.JWT_TOKEN, 
        { expiresIn: '24h' }
      );

      // Redirect back to Frontend with the token in the URL
      res.redirect(`${process.env.FRONTEND_URL}/google-auth-success/${token}`)
    } catch (error) {
      console.error("Error in Google callback:", error);
      res.redirect(`${process.env.FRONTEND_URL}/login?error=token_generation_failed`)
    }
  }
);
router.get("/profile", authMiddleware, (req, res) => {
    // authMiddleware decodes the JWT and puts user info in req.user
    res.json({ user: req.user });
});

module.exports = router