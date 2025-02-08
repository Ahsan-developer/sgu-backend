"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authMiddleware = (roles = []) => {
    return (req, res, next) => {
        const token = req.header("Authorization")?.replace("Bearer ", "");
        if (!token) {
            return res
                .status(401)
                .json({ message: "No token provided, authorization denied" });
        }
        try {
            const secret = process.env.JWT_SECRET || "your-default-secret";
            const decoded = jsonwebtoken_1.default.verify(token, secret);
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
        }
        catch (error) {
            console.error("Invalid token:", error);
            return res.status(401).json({ message: "Invalid token" });
        }
    };
};
exports.default = authMiddleware;
