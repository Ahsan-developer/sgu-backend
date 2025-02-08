"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userModel_1 = __importDefault(require("../models/userModel"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const seedAdminUser = async () => {
    try {
        const existingAdmin = await userModel_1.default.findOne({ role: "admin" });
        if (existingAdmin) {
            console.log("Admin user already exists.");
            return;
        }
        const hashedPassword = await bcryptjs_1.default.hash("your-strong-password", 10);
        const adminUser = new userModel_1.default({
            firstName: "Admin",
            lastName: "User",
            username: "admin",
            email: "admin@example.com",
            registrationID: "ADM-0001",
            password: hashedPassword,
            status: "active",
            role: "admin",
            isEmailVerified: true,
        });
        await adminUser.save();
        console.log("Admin user seeded successfully.");
    }
    catch (error) {
        console.error("Error seeding admin user:", error);
    }
};
exports.default = seedAdminUser;
