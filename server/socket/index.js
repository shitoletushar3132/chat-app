const express = require("express");
const { Server } = require("socket.io");
const http = require("http");
const app = express();
const getUserDetailFromToken = require("../helpers/getUserDetailFromToken");
const UserModel = require("../models/UserModel");
const { ConversationModel } = require("../models/ConversationModel");

// Create HTTP server
const server = http.createServer(app);

// Create Socket.IO server and attach it to the HTTP server
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true,
  },
});

// Online users set
const onlineUsers = new Set();

io.on("connection", async (socket) => {
  try {
    const token = socket.handshake.auth.token;
    if (!token) {
      socket.disconnect();
      return;
    }

    // Get current user details
    const user = await getUserDetailFromToken(token);
    if (!user) {
      socket.disconnect();
      return;
    }

    // Join the user room
    socket.join(user._id.toString());
    onlineUsers.add(user._id.toString());

    // Notify all clients about the updated online users list
    io.emit("onlineUser", Array.from(onlineUsers));

    // Handle fetching message page user details
    socket.on("message-page", async (userId) => {
      try {
        const userDetails = await UserModel.findById(userId).select(
          "-password"
        );
        if (userDetails) {
          const payload = {
            _id: userDetails._id,
            name: userDetails.name,
            email: userDetails.email,
            profile_pic: userDetails.profile_pic,
            online: onlineUsers.has(userId),
          };
          socket.emit("message-user", payload);
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    });

    // Handle new messages
    socket.on("new message", async (data) => {
      console.log("new message", data);
      // check conversation is avilabel

      const conversation = await ConversationModel.findOne({
        $or: [
          {
            sender: data?.sender,
            receiver: data?.receiver,
          },
        ],
      });
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      onlineUsers.delete(user._id.toString());
      // Notify all clients about the updated online users list
      io.emit("onlineUser", Array.from(onlineUsers));
    });
  } catch (error) {
    console.error("Connection error:", error);
    socket.disconnect();
  }
});

// Export both app and server
module.exports = { app, server };
