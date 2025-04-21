// utils/socketEmitter.ts
import { Server } from "socket.io";

let io: Server;

export const initializeSocketEmitter = (socketServer: Server) => {
  io = socketServer;
};

export const emitToUser = (userId: string, event: string, data: any) => {
  if (!io) throw new Error("Socket server not initialized");
  io.to(userId).emit(event, data);
};

export const emitToAll = (event: string, data: any) => {
  if (!io) throw new Error("Socket server not initialized");
  io.emit(event, data);
};

export const emitToRoom = (room: string, event: string, data: any) => {
  if (!io) throw new Error("Socket server not initialized");
  io.to(room).emit(event, data);
};
