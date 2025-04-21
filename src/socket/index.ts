import { Server } from "socket.io";
import http from "http";
import { registerSocketHandlers } from "./handlers";
import { initializeSocketEmitter } from "./socketEmitter";

const connectedUsers = new Map<string, any>();

export const initSocketServer = (server: http.Server) => {
  const io = new Server(server, {
    cors: {
      origin: "*", // Adjust for your frontend origin
    },
  });

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Handle user registration for mapping
    socket.on("register", (userId: string) => {
      connectedUsers.set(userId, socket.id);
      console.log(`User ${userId} registered with socket ${socket.id}`);
    });
    socket.emit("test", "testing");
    // Initialize the emitter
    initializeSocketEmitter(io);
    registerSocketHandlers(socket, io, connectedUsers);

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
      // remove user from connectedUsers
      for (let [key, value] of connectedUsers.entries()) {
        if (value === socket.id) {
          connectedUsers.delete(key);
          break;
        }
      }
    });
  });

  return io;
};
