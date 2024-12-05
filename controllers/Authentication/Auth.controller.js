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

// resend otp entry with email
exports.resendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if email is provided
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Find the existing OTP entry
    const existingOtpEntry = await OTP.findOne({ email });

    // If an OTP entry exists, delete it (clean up old OTP)
    if (existingOtpEntry) {
      await OTP.deleteOne({ email });
    }

    // Generate a new OTP
    let generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    let otpExists = await OTP.findOne({ otp: generatedOtp });

    // Ensure the OTP is unique
    while (otpExists) {
      generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
      otpExists = await OTP.findOne({ otp: generatedOtp });
    }

    // Save the new OTP entry
    await OTP.create({ email, otp: generatedOtp });
    console.log("New OTP entry created:", generatedOtp);

    res.status(200).json({
      success: true,
      message: "OTP resent successfully",
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

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
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
