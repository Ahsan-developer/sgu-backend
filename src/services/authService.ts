import jwt, { SignOptions } from "jsonwebtoken";

export const generateToken = (
  id: string,
  role: string,
  expiresIn: SignOptions["expiresIn"] = "1h"
) => {
  const secret = process.env.JWT_SECRET || "your-default-secret";

  const payload = { id, role };

  const options: SignOptions = {
    expiresIn: typeof expiresIn === "number" ? expiresIn : expiresIn, // Ensure it's a valid type
  };

  return jwt.sign(payload, secret, options);
};
