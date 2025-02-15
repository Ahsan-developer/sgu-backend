import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface CustomJwtPayload {
  id: string;
  role: string;
  exp: number; // Token expiration
}

interface CustomRequest extends Request {
  user?: CustomJwtPayload;
}

export const authenticateToken = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): void => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    res
      .status(401)
      .json({ message: "No token provided, authorization denied" });
    return;
  }

  try {
    const secret = process.env.JWT_SECRET || "sgu-market-place";
    const decoded = jwt.verify(token, secret) as CustomJwtPayload;

    // Check for token expiration
    const currentTime = Math.floor(Date.now() / 1000);
    if (decoded.exp < currentTime) {
      res.status(401).json({ message: "Token has expired" });
      return;
    }

    req.user = decoded; // Attach user data to request object
    next(); // Proceed to the next middleware
  } catch (error) {
    console.error("Invalid token:", error);
    res.status(401).json({ message: "Invalid token" });
  }
};
