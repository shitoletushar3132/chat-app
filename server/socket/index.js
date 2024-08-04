const express = require("express");
const { Server } = require("socket.io");
const http = require("http");
const app = express();
const getUserDetailFromToken = require("../helpers/getUserDetailFromToken");
const UserModel = require("../models/UserModel");
const {
  ConversationModel,
  MessageModel,
} = require("../models/ConversationModel");
const { count } = require("console");
const getConversation = require("../helpers/getConversation");

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

          //get previous message
          const getConversationMessage = await ConversationModel.findOne({
            $or: [
              { sender: user?._id, receiver: userId },
              { sender: userId, receiver: user?._id },
            ],
          })
            .populate("message")
            .sort({ updateAt: -1 });

          socket.emit("message", getConversationMessage?.message);
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    });

    // Handle new messages
    socket.on("new-message", async (data) => {
      try {
        // Check if conversation exists
        let conversation = await ConversationModel.findOne({
          $or: [
            { sender: data?.sender, receiver: data?.receiver },
            { sender: data?.receiver, receiver: data?.sender },
          ],
        });

        // If conversation does not exist, create a new one
        if (!conversation) {
          const createConversation = new ConversationModel({
            sender: data?.sender,
            receiver: data?.receiver,
          });
          conversation = await createConversation.save();
        }

        const message = new MessageModel({
          text: data?.text,
          imageUrl: data?.imageUrl,
          videoUrl: data?.videoUrl,
          msgByUserId: data?.msgByUserId,
        });

        const savedMessage = await message.save();

        await ConversationModel.updateOne(
          { _id: conversation._id },
          {
            $push: { message: savedMessage._id },
          }
        );

        // Get all messages in the conversation
        const getConversationMessage = await ConversationModel.findOne({
          $or: [
            { sender: data?.sender, receiver: data?.receiver },
            { sender: data?.receiver, receiver: data?.sender },
          ],
        })
          .populate("message")
          .sort({ updateAt: -1 });

        io.to(data?.sender).emit(
          "message",
          getConversationMessage?.message || []
        );
        io.to(data?.receiver).emit(
          "message",
          getConversationMessage?.message || []
        );
        // send conversation
        const conversationSender = await getConversation(data?.sender);
        const conversationReceiver = await getConversation(data?.receiver);
        io.to(data?.sender).emit("conversation", conversationSender);
        io.to(data?.receiver).emit("conversation", conversationReceiver);
      } catch (error) {
        console.error("Error handling new message:", error);
      }
    });

    // sidebar
    socket.on("sidebar", async (currentUserId) => {
      const conversation = await getConversation(currentUserId);
      socket.emit("conversation", conversation);
    });

    socket.on("seen", async (msgByUserId) => {
      let conversation = await ConversationModel.findOne({
        $or: [
          { sender: user._id, receiver: msgByUserId },
          { sender: msgByUserId, receiver: user._id },
        ],
      });

      const conversationMessageId = conversation?.message || [];

      const updateMessage = await MessageModel.updateMany(
        {
          _id: { $in: conversationMessageId },
          msgByUserId: msgByUserId,
        },
        { $set: { seen: true } }
      );
      const conversationSender = await getConversation(user?._id?.toString());
      const conversationReceiver = await getConversation(msgByUserId);
      io.to(user?._id?.toString()).emit("conversation", conversationSender);
      io.to(msgByUserId).emit("conversation", conversationReceiver);
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      onlineUsers.delete(user._id.toString());
      io.emit("onlineUser", Array.from(onlineUsers));
    });
  } catch (error) {
    console.error("Connection error:", error);
    socket.disconnect();
  }
});

// Export both app and server
module.exports = { app, server };
