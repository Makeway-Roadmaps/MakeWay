const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
      firstName: {
        type: String,
        required: true,
      },
      lastName: {
        type: String,
      },
      email: {
        type: String,
        required: true,
        unique: true,
      },
      password: {
        type: String,
        required: true,
      },
      role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    },
    profile: {
        name: String,
        bio: String,
        avatar: String
    },
      image: { type: String },
    },
    {
      timestamps: true,
    }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
