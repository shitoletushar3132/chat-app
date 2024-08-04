const { ConversationModel } = require("../models/ConversationModel");
const getConversation = async (currentUserId) => {
  if (currentUserId) {
    const currentUserConversation = await ConversationModel.find({
      $or: [
        {
          sender: currentUserId,
        },
        { receiver: currentUserId },
      ],
    })
      .sort({ updateAt: -1 })
      .populate("message")
      .populate("sender")
      .populate("receiver");

    const conversation = currentUserConversation.map((conv) => {
      const countUnseenMsg = conv.message.reduce((preve, curr) => {
        const msgByUserId = curr?.msgByUserId?.toString();
        if (msgByUserId !== currentUserId) {
          return preve + (curr.seen ? 0 : 1);
        } else {
          return preve;
        }
      }, 0);
      return {
        _id: conv?._id,
        sender: conv?.sender,
        receiver: conv?.receiver,
        unseenMsg: countUnseenMsg,
        lastMsg: conv.message[conv?.message?.length - 1],
      };
    });

    return conversation;

    // socket.emit("conversation", conversation);
  } else {
    return [];
  }
};

module.exports = getConversation;
