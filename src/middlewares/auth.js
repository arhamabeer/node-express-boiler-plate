import jwt from "jsonwebtoken";
import { SECRET } from "../helpers/jwtHelper.js";
import User from "../models/userModel.js";

export const verifyUserLogin = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        message: "Unauthorized: No token provided",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "Unauthorized: Invalid token format",
      });
    }
    const decoded = jwt.verify(token, SECRET);

    console.log("Decoded token:", decoded);
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return res.status(401).json({
        message: "Unauthorized: User not found",
      });
    }

    req.user = currentUser;
    next();
  } catch (error) {
    return res.status(500).json({
      message: `Internal server error on verifyUserLogin: ${error.message}`,
    });
  }
};
