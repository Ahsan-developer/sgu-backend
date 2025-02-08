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

const authMiddleware = (roles: string[] = []) => {
  return (req: CustomRequest, res: Response, next: NextFunction) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res
        .status(401)
        .json({ message: "No token provided, authorization denied" });
    }

    try {
      const secret = process.env.JWT_SECRET || "your-default-secret";
      const decoded = jwt.verify(token, secret) as CustomJwtPayload;

      // Check for token expiration
      const currentTime = Math.floor(Date.now() / 1000);
      if (decoded.exp < currentTime) {
        return res.status(401).json({ message: "Token has expired" });
      }

      // Check role
      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({
          message: "Access denied. You do not have the required role.",
        });
      }

      req.user = decoded;
      next();
    } catch (error) {
      console.error("Invalid token:", error);
      return res.status(401).json({ message: "Invalid token" });
    }
  };
};

export default authMiddleware;
