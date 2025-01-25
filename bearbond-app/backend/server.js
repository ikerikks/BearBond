import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { v2 as cloudinary } from 'cloudinary';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';

import authRoutes from './routes/auth.route.js';
import userRoutes from './routes/user.route.js';
import postRoutes from './routes/post.route.js';
import notificationRoutes from './routes/notification.route.js';

import { 
  startConversation,
  getUserConversations,
  sendMessage,
  getMessages, 
} from './controllers/conversation.controller.js';

import connectMongoDB from './db/connectMongoDB.js';


dotenv.config();
// Connect the Cloudinary for media management
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
})

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware: Enable CORS
app.use(cors({
  origin: 'http://localhost:3000', // Frontend URL
}));
// Middleware for parsing JSON and form data
app.use(express.json({limit: '3mb'})); // parse the req.body (form data of the app) limit not to high : dos attack
app.use(express.urlencoded({extended: true}));
// Middleware: parse cookies
app.use(cookieParser())
// Defined routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes); 
app.use('/api/posts', postRoutes); 
app.use('/api/notifications', notificationRoutes);

// http server to integrate Socket.IO
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000', 
    methods: ['GET', 'POST'],
  },
});
// Attach Socket.IO to instance to the app for global access
app.set('io', io);

// Bind the socket events
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on('startConversation', async (data, callback) => {
    try {
      const conversation = await startConversation(data);
      callback({success: true, data:conversation});
    } catch (err) {
      console.log(err);
      callback({success: false, error: err.message});
    }
  });

  socket.on('getUserConversations', async (data, callback) => {
    try {
      const conversations = await getUserConversations(data.userId);
      callback({success: true, data:conversations});
    } catch (err) {
      console.error(err);
      callback({success: false, error: err.message});
    }
  });

  socket.on('sendMessage', async (data, callback) => {
    try {
      const message = await sendMessage(data);
      io.to(data.conversationId).emit('newMessage', message);
      callback({success: true, data:message});
    } catch (err) {
      console.error(err);
      callback({success: false, error: err.message});
    }
  });

  socket.on('getMessages', async (data, callback) => {
    try {
      const messages = await getMessages(data.conversationId);
      callback({ success: true, data:messages });
    } catch (err) {
      console.error(err);
      callback({success: false, error: err.message});
    }
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// Connect the database once the server is running
server.listen(PORT, () => {
  console.log('Server running on port:' + PORT);
  connectMongoDB();
})

