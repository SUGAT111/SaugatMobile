import express from "express";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const router = express.Router();

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { email, username, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password should be at least 6 characters long" });
    }
    if (username.length < 3) {
      return res.status(400).json({ message: "Username should be at least 3 characters long" });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) return res.status(400).json({ message: "Email already exists" });

    const existingUsername = await User.findOne({ username });
    if (existingUsername) return res.status(400).json({ message: "Username already exists" });

    // get random avatar
    const avatar = `https://api.dicebear.com/7.x/avataaars/png?seed=${Math.random()}`;


    // const avatar = `https://api.adorable.io/avatars/285/${username}.png`;

    // const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ email, username, password, profileImage: avatar });
    await newUser.save();

    const token = generateToken(newUser._id);
    res.status(201).json({
      token,
      user: {
        id: newUser._id,
        email: newUser.email,
        username: newUser.username,
        profileImage: newUser.profileImage,
        createdAt: newUser.createdAt,
      },
    });
  } catch (error) {
    console.log("register route error", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials email" });
    }

    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials password" });
    }

    const token = generateToken(user._id);
    res.status(200).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        profileImage: user.profileImage,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.log("login route error", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
