import { Server, Socket } from "socket.io";

export const registerSocketHandlers = (
  socket: Socket,
  io: Server,
  connectedUsers: Map<string, string>
) => {
  // 📩 1. Private Message
  socket.on("private_message", ({ to, message }) => {
    const receiverSocketId = connectedUsers.get(to);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("receive_private_message", {
        from: socket.id,
        message,
      });
    }
  });

  // 📤 2. Broadcast Message to All
  socket.on("broadcast_message", (msg: string) => {
    socket.broadcast.emit("receive_broadcast", msg);
  });

  // 📨 3. Notification to Specific User
  socket.on("notify_user", ({ userId, notification }) => {
    const targetSocket = connectedUsers.get(userId);
    if (targetSocket) {
      io.to(targetSocket).emit("notification", notification);
    }
  });

  // 📢 4. Admin Broadcast (e.g. Maintenance)
  socket.on("admin_broadcast", (msg: string) => {
    io.emit("system_message", msg);
  });

  // 🧃 5. Batch Emit (for multiple users)
  socket.on("batch_emit", ({ users, event, data }) => {
    users.forEach((userId: string) => {
      const userSocketId = connectedUsers.get(userId);
      if (userSocketId) {
        io.to(userSocketId).emit(event, data);
      }
    });
  });

  // ✅ Acknowledgement Test
  socket.on("ping", (cb) => {
    cb("pong");
  });
};
