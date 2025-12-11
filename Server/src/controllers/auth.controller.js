import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "privyra_secret";

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
