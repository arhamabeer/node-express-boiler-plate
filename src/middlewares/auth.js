import jwt from "jsonwebtoken";
import { SECRET } from "../helpers/jwtHelper.js";
import User from "../models/userModel.js";
import { getUserCookie } from "../helpers/sessionCookieHelper.js";

//! JWT
export const verifyUserLogin = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(400).json({
        message: "Bad Request: No token provided",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(400).json({
        message: "Bad Request: Invalid token format",
      });
    }
    const decoded = jwt.verify(token, SECRET);

    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return res.status(404).json({
        message: "Not found: User not found",
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

//! SESSION COOKIES
// export const verifyUserLogin = async (req, res, next) => {
//   try {
//     const authHeaderCookie = req.headers.authorization;

//     if (!authHeaderCookie) {
//       return res.status(400).json({
//         message: "Bad Request: No session id provided",
//       });
//     }

//     const user = getUserCookie(authHeaderCookie);
//     if (!user) {
//       return res.status(401).json({
//         message: "Unauthorized: Invalid session id provided",
//       });
//     }

//     const currentUser = await User.findById(user._id);

//     if (!currentUser) {
//       return res.status(404).json({
//         message: "Not found: User not found",
//       });
//     }

//     req.user = currentUser;
//     next();
//   } catch (error) {
//     return res.status(500).json({
//       message: `Internal server error on verifyUserLogin: ${error.message}`,
//     });
//   }
// };

export const RestrictTo = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role))
      return res
        .status(403)
        .json({
          message:
            "Forbidden: You don't have permission to perform this action.",
        });
    next();
  };
};
