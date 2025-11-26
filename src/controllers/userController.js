import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
import User from "../models/userModel.js";
import { GenerateToken } from "../helpers/jwtHelper.js";
import { setUserCookie } from "../helpers/sessionCookieHelper.js";

export const createUser = async (req, res) => {
  try {
    if (!req.body)
      return res.status(400).json({ message: "User data not provided." });
    const { firstName, lastName, email, password, dob, gender } = req.body;
    const existingUser = await User.findOne({ email: email });
    if (existingUser)
      return res
        .status(400)
        .json({ message: "User with this email already exists." });

    const response = await User.create({
      firstName,
      lastName,
      email,
      password,
      dob,
      gender,
    });

    if (response._id) {
      res.status(201).json({
        message: "User created successfully.",
        data: response,
      });
    } else {
      res.status(400).json({ message: "User creation failed." });
    }
  } catch (err) {
    res.status(500).json({ message: `Internal server error: ${err.message}` });
  }
};
export const userLogin = async (req, res) => {
  try {
    if (!req.body)
      return res.status(400).json({ message: "Credentials not provided." });
    const { email, password } = req.body;
    const user = await User.findOne({ email: email, password: password });
    if (!user) return res.status(401).json({ message: "Invalid credentials." });

    //! JWT STATE-LESS AUTHENTICATION
    const token = GenerateToken({ id: user._id, email: user.email });
    return res
      .status(200)
      .json({ message: "Login successful.", data: { user, token } });

    //! SESSION COOKIES STATE-FULL AUTHENTICATION
    // const sessionId = uuidv4();
    // setUserCookie(sessionId, user);
    // res.cookie("node-test-uid", sessionId);
    // return res.status(200).json({ message: "Login successful.", data: user });
  } catch (err) {
    res.status(500).json({ message: `Internal server error: ${err.message}` });
  }
};
export const getSingleUser = async (req, res) => {
  try {
    const isValidId = mongoose.Types.ObjectId.isValid(req.params.id);
    if (!isValidId) return res.status(400).json({ message: "Invalid user ID" });

    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    return res
      .status(200)
      .json({ message: "User fetched successfully", data: user });
  } catch (err) {
    res.status(500).json({ message: `Internal server error: ${err.message}` });
  }
};
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    if (!users) return res.status(404).json({ message: "Users not available" });

    return res
      .status(200)
      .json({ message: "Users fetched successfully", data: users });
  } catch (err) {
    res.status(500).json({ message: `Internal server error: ${err.message}` });
  }
};

export const updateSingleUser = async (req, res) => {
  try {
    const isValidId = mongoose.Types.ObjectId.isValid(req.params.id);
    if (!isValidId) return res.status(400).json({ message: "Invalid user ID" });

    const response = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!response) return res.status(404).json({ message: "User not found" });

    return res
      .status(200)
      .json({ message: "User data updated successfully", data: response });
  } catch (err) {
    res.status(500).json({ message: `Internal server error: ${err.message}` });
  }
};
export const deleteSingleUser = async (req, res) => {
  try {
    const isValidId = mongoose.Types.ObjectId.isValid(req.params.id);
    if (!isValidId) return res.status(400).json({ message: "Invalid user ID" });

    const response = await User.findByIdAndDelete(req.params.id);

    if (!response) return res.status(404).json({ message: "User not found" });

    return res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: `Internal server error: ${err.message}` });
  }
};
