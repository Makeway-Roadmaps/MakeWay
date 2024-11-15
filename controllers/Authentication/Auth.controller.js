const OTP = require("../../models/OTP.Model/Otp.model");
const User = require("../../models/User.Model/user.Model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
// const otpGenerator = require("otp-generator");
const mailSender = require("../../utls/mailSender/mailsender.utls");

// otp sender
exports.otpSender = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    let generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    let otpExists = await OTP.findOne({ otp: generatedOtp });

    while (otpExists) {
      generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
      otpExists = await OTP.findOne({ otp: generatedOtp });
    }

    await OTP.create({ email, otp: generatedOtp });
    console.log("OTP entry created:", generatedOtp);

    res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.error("Error occurred while sending OTP:", error);
    res.status(500).json({ message: "Error occurred while sending OTP" });
  }
};

// Resend OTP function
exports.resendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const otpRecord = await OTP.findOne({ email });
    if (!otpRecord) {
      return res
        .status(404)
        .json({ message: "No OTP request found for this email" });
    }

    let newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(newOtp);
    let otpExists = await OTP.findOne({ otp: newOtp });

    while (otpExists) {
      newOtp = Math.floor(100000 + Math.random() * 900000).toString();
      otpExists = await OTP.findOne({ otp: newOtp });
    }

    await OTP.findOneAndUpdate(
      { email },
      { otp: newOtp, createdAt: Date.now() },
      { new: true, upsert: true }
    );
    await mailSender(email, newOtp);

    res.status(200).json({
      success: true,
      message: "New OTP sent successfully",
    });
  } catch (error) {
    console.error("Error occurred while resending OTP:", error);
    res.status(500).json({ message: "Error occurred while resending OTP" });
  }
};
// Signup Logic
exports.signup = async (req, res) => {
  try {
    const { firstName, lastName, email, password, confirmPassword, otp } =
      req.body;

    // Check if all required fields are present
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !otp
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Validate password match
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Get the most recent OTP for the email
    const recentOtp = await OTP.findOne({ email }).sort({ createdAt: -1 });

    // Check if OTP is valid
    if (!recentOtp) {
      return res.status(400).json({ message: "OTP not found" });
    }

    // Check if OTP matches
    if (recentOtp.otp.trim() !== otp.trim()) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Optional: Check OTP expiry (e.g., 5 minutes)
    const otpExpirationTime = 5 * 60 * 1000; // 5 minutes
    const otpIsExpired =
      Date.now() - recentOtp.createdAt.getTime() > otpExpirationTime;
    if (otpIsExpired) {
      return res.status(400).json({ message: "OTP has expired" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user to the database
    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName}${lastName}`,
    });

    res.status(200).json({
      message: "User created successfully",
      user: { firstName, lastName, email },
      success: true,
    });
  } catch (error) {
    console.error("Error occurred while signing up:", error);
    res.status(500).json({ message: "Error occurred while signing up" });
  }
};

// login logic
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please enter both email and password" });
    }


    // check if user exists 
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const payload = {
      _id: user._id,
      email: user.email,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    res
      .cookie("token", token, {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      })
      .status(200)
      .json({ message: "User logged in successfully", token, user });
  } catch (error) {
    console.error("Error while logging in:", error);
    res.status(500).json({ message: "Error while logging in" });
  }
};
