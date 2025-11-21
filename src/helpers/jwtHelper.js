import jwt from "jsonwebtoken";

export const SECRET = "njudfdfj$4r234r#$F#$g4543GFBec9EBN97vb74342B34$w";

export const GenerateToken = (payload) => {
  return jwt.sign(payload, SECRET, { expiresIn: "1h" });
};
