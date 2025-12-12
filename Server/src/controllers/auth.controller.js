import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

console.log("AUTH CONTROLLER SECRET:", process.env.JWT_SECRET);

const JWT_SECRET = process.env.JWT_SECRET;

// Signup controller
export const signup = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      password: hashedPassword
    });

    await newUser.save();

    // ADD THESE LINES ↓↓↓
    console.log("SIGNUP USING SECRET:", JWT_SECRET);
    console.log("SIGNUP SECRET TYPE:", typeof JWT_SECRET);
    // ADD ABOVE LINES BEFORE jwt.sign()

    const token = jwt.sign(
      { id: newUser._id, username },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({ token, username });

  } catch (error) {
    console.error("SIGNUP ERROR:", error);
    res.status(500).json({
      message: error.message || "Internal Server Error"
    });
  }
};

// Login controller
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    // ADD THESE LINES ↓↓↓
    console.log("LOGIN USING SECRET:", JWT_SECRET);
    console.log("LOGIN SECRET TYPE:", typeof JWT_SECRET);
    // ADD ABOVE LINES BEFORE jwt.sign()

    const token = jwt.sign(
      { id: user._id, username },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({ token, username });

  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({
      message: error.message || "Internal Server Error"
    });
  }
};
