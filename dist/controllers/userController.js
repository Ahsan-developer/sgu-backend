"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addUser = exports.fetchUsers = void 0;
const userService_1 = require("../services/userService");
const fetchUsers = async (req, res) => {
    try {
        const users = await (0, userService_1.getAllUsers)();
        res.json(users);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching users", error });
    }
};
exports.fetchUsers = fetchUsers;
const addUser = async (req, res) => {
    try {
        const { name, email } = req.body;
        const newUser = await (0, userService_1.createUser)(name, email);
        res.status(201).json(newUser);
    }
    catch (error) {
        res.status(500).json({ message: "Error creating user", error });
    }
};
exports.addUser = addUser;
