import Conversation from '../models/conversation.model.js';
import Message from '../models/message.model.js';
import User from '../models/user.model.js';
import Notification from '../models/notification.model.js';


const startConversation = async ({userId, recipientId}) => {
  try {
    let conversation = await Conversation.findOne({
      participants: { $all: [userId, recipientId] },
    });

    if (!conversation) {
      conversation = new Conversation({
        participants: [userId, recipientId],
      });
      await conversation.save();

      await User.findByIdAndUpdate(userId, {
        $push: { conversations: conversation._id }
      });
      await User.findByIdAndUpdate(recipientId, {
        $push: { conversations: conversation._id }
      });
    }
    // const notification = new Notification({
    //   type: 'message',
    //   from: userId,
    //   to: recipientId,
    // });
    // await notification.save();
    
    return conversation;
  } catch (err) {
    throw new Error('Error in the start conversation');
  }
}

const getUserConversations = async (userId) => {
  try {
    const user = await User.findById(userId)
    .populate({
      path: 'conversations',
      populate: [
        { path: 'participants', select: '-password' },
        { path: 'lastMessage', select: ''},
      ],
    });

    return user.conversations;
  } catch (err) {
    throw new Error('Error in the get user conversations');
  }
}

const sendMessage = async ({
  conversationId, 
  senderId, 
  text
}) => {
  try {
    const message = new Message({
      conversation: conversationId,
      sender: senderId,
      text,
    });
    await message.save();

    await Conversation.findByIdAndUpdate(conversationId, {
      $push: {messages: message._id},
      lastMessage: message._id,
    });

    return message.populate({path: 'sender', select: '-password'});
  } catch (err) {
    throw new Error('Error in the send message');
  }
}

const getMessages = async (conversationId) => {
  try {
    const messages = await Conversation.findById(conversationId)
    .populate({
      path: 'messages',
      populate: [
        {path: 'sender', select: ['userName', 'profileImg']},
      ],
    })
    .populate({path: 'participants', select: '-password'});

    return messages;
  } catch (err) {
    throw new Error('Error in get messages');
  }
}

export {
  startConversation,
  getUserConversations,
  sendMessage,
  getMessages,
}