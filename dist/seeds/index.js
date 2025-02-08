"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const seedAdmin_1 = __importDefault(require("./seedAdmin"));
const database_1 = require("../config/database");
const runSeeders = async () => {
    await (0, database_1.connectDB)();
    console.log("Starting seed process...");
    // Add all seed files here
    await (0, seedAdmin_1.default)();
    await (0, database_1.disconnectDB)();
    console.log("Seeding completed.");
};
runSeeders();
