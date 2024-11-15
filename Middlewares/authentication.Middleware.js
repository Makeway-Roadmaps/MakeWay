const User = require("../models/User.Model/user.Model");

const jwt = require("jsonwebtoken");
require("dotenv").config();
exports.auth = async (req, res, next) => {
  try {
    const token =
      req.body.token ||
      req.cookies.token ||
      (req.header("Authorization") &&
        req.header("Authorization").replace("Bearer ", ""));
    // console.log("Extracted Token:", token);

    // Check the existence of the token
    if (!token) {
      return res.status(401).json({ message: "Token not found" });
    }

    try {
      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // console.log("Decoded User Data:", decoded);

      // req.user = {
      //   // id: decoded.id,
      //   email: decoded.email,
      //   name: decoded.name,
      //   role: decoded.role,
      //   passengerType: decoded.passengerType,
      // };
      req.user = decoded;
      // Assign the decoded data to req.user
      next();
    } catch (error) {
      console.log("Invalid token: Token does not match", error);
      return res.status(401).json({ message: "Invalid token" });
    }
  } catch (error) {
    console.log("Error during authentication", error);
    return res.status(500).json({ message: "Error during authentication" });
  }
};

exports.isUser = async (req, res, next) => {
  try {
    if (req.user.role != "user") {
      return res.status(401).json({
        message: "You are not a user",
      });
    }
    next();
  } catch (error) {
    return res.status(401).json({
      message: "something went wrong while validating ",
    });
  }
};
exports.isAdmin = async (req, res, next) => {
  try {
    if (req.user && req.user.role === "admin") {
      next(); // User is authorized, proceed to the next middleware or route
    } else {
      return res.status(403).json({ message: "Access denied: Admins only" });
    }
  } catch (error) {
    return res.status(401).json({
      message: "something went wrong while validating Admin",
    });
  }
};
