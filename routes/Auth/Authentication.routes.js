const express = require("express");
const router = express.Router();
const UserControllers = require("../../controllers/Authentication/Auth.controller");
const { auth } = require("../../Middlewares/authentication.Middleware");

// route mounting

// use localhost:8000/api/v1 for testing
router.post("/signup", UserControllers.signup);
router.post("/otp-Sender", UserControllers.otpSender);
router.post("/resend-otp", UserControllers.resendOtp);
router.post("/login", UserControllers.login);

//protected routes

router.get("/user", auth, (req, res) => {
  res.status(200).json({
    success: true,
    message: "User is authenticated",
  });
});
router.get("/admin", auth, (req, res) => {
  res.status(200).json({
    success: true,
    message: "User is authenticated",
  });
});

module.exports = router;
