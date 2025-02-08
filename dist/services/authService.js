"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateToken = (id, role, expiresIn = "1h") => {
    const secret = process.env.JWT_SECRET || "your-default-secret";
    const payload = { id, role };
    const options = {
        expiresIn: typeof expiresIn === "number" ? expiresIn : expiresIn, // Ensure it's a valid type
    };
    return jsonwebtoken_1.default.sign(payload, secret, options);
};
exports.generateToken = generateToken;
