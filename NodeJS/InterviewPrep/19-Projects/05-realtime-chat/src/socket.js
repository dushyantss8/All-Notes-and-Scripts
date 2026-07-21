/**
 * Socket.IO sketch — auth, join/leave room, persist + broadcast messages.
 */
const { Server } = require("socket.io");
const Message = require("./models/message");
const RoomMember = require("./models/roomMember");
const { socketUserFromHandshake } = require("./middleware/auth");

function attachSocket(httpServer) {
  const io = new Server(httpServer, {
    cors: { origin: true, credentials: true },
  });

  io.use((socket, next) => {
    const user = socketUserFromHandshake(socket);
    if (!user) return next(new Error("unauthorized"));
    socket.user = user;
    next();
  });

  io.on("connection", (socket) => {
    socket.on("join_room", async ({ roomId } = {}, ack) => {
      try {
        if (!roomId || typeof roomId !== "string") {
          throw new Error("roomId required");
        }
        // Demo: upsert membership. Production: invite-only check.
        await RoomMember.updateOne(
          { roomId, userId: socket.user.id },
          { $setOnInsert: { role: "member" } },
          { upsert: true }
        );
        await socket.join(roomId);
        if (typeof ack === "function") ack({ ok: true, roomId });
      } catch (error) {
        socket.emit("error_message", { message: error.message });
        if (typeof ack === "function") ack({ ok: false, error: error.message });
      }
    });

    socket.on("leave_room", async ({ roomId } = {}, ack) => {
      if (roomId) await socket.leave(roomId);
      if (typeof ack === "function") ack({ ok: true });
    });

    socket.on("send_message", async ({ roomId, body } = {}, ack) => {
      try {
        if (!roomId || !body || String(body).trim().length === 0) {
          throw new Error("roomId and body required");
        }
        const member = await RoomMember.findOne({
          roomId,
          userId: socket.user.id,
        });
        if (!member) throw new Error("not a room member");

        const text = String(body).trim().slice(0, 4000);
        const message = await Message.create({
          roomId,
          senderId: socket.user.id,
          body: text,
        });

        // Broadcast to everyone currently in the Socket.IO room.
        io.to(roomId).emit("message", message);
        if (typeof ack === "function") ack({ ok: true, message });
      } catch (error) {
        socket.emit("error_message", { message: error.message });
        if (typeof ack === "function") ack({ ok: false, error: error.message });
      }
    });
  });

  return io;
}

module.exports = { attachSocket };
