"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.disconnectDB = exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const connectDB = async () => {
    const dbURI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/sgu-database-local";
    try {
        await mongoose_1.default.connect(dbURI);
        console.log("MongoDB connected successfully");
    }
    catch (error) {
        console.error("MongoDB connection failed:", error);
        process.exit(1);
    }
};
exports.connectDB = connectDB;
const disconnectDB = async () => {
    try {
        await mongoose_1.default.disconnect();
        console.log("MongoDB disconnected successfully");
    }
    catch (error) {
        console.error("MongoDB disconnected failed:", error);
        process.exit(1);
    }
};
exports.disconnectDB = disconnectDB;
