"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Auth API Documentation",
            version: "1.0.0",
            description: "API documentation for the login endpoint",
        },
        servers: [
            {
                url: "http://localhost:3000/api",
            },
        ],
    },
    apis: ["./routes/*.js"],
};
exports.default = swaggerOptions;
