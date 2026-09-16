import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import http from 'http'; 
import { Server } from 'socket.io'; 
import jwt from 'jsonwebtoken';

// Import Routes
import userRoutes from './src/routes/userRoutes.js';
import tripRoutes from './src/routes/tripRoutes.js';
import matchRoutes from './src/routes/matchRoutes.js';
import expenseRoutes from './src/routes/expenseRoutes.js';
import authRoutes from './src/routes/authRoutes.js';
import postRoutes from './src/routes/postRoutes.js';
import router from './src/routes/userRoutes.js';
import User from './src/models/User.js';
import Trip from './src/models/TripModel.js';

dotenv.config();

const app = express();

// Origins allowed to call this API — local dev plus the deployed frontend.
// Add CLIENT_URL as an env var on Render if you ever change/add a frontend domain.
const allowedOrigins = [
  "http://localhost:5173",
  "https://travel-companion-finder-frontend.onrender.com",
  process.env.CLIENT_URL,
].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. curl, server-to-server) and known origins
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

// --- 1. GLOBAL MIDDLEWARES ---
app.use(express.json()); // Essential for reading req.body
app.use(cors(corsOptions)); // Essential for cross-origin frontend requests

// --- 2. WRAP EXPRESS WITH HTTP SERVER FOR SOCKET.IO ---
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"]
  }
});

// Lets controllers (e.g. expenseController) broadcast real-time updates
// to everyone currently viewing a trip, via req.app.get('io').
app.set('io', io);

// --- 3. API ROUTES ---
app.use('/api/auth', authRoutes); 
app.use('/api/users', userRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/posts', postRoutes);

// --- 4. SOCKET.IO AUTHENTICATION ---
// Runs once per connection, before any events are allowed. A socket that
// fails this never gets to call join_trip_room or send_message at all.
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error('Authentication required'));

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('name');
    if (!user) return next(new Error('User not found'));

    // Attach a verified identity to this socket — every handler below
    // trusts socket.user, never anything the client sends in message data.
    socket.user = { id: decoded.id, name: user.name };
    next();
  } catch (error) {
    next(new Error('Authentication failed'));
  }
});

// --- 5. SOCKET.IO CHAT LOGIC ---
io.on('connection', (socket) => {
  console.log(`🔌 ${socket.user.name} connected: ${socket.id}`);

  socket.on('join_trip_room', async (tripId) => {
    try {
      const trip = await Trip.findById(tripId);
      if (!trip) {
        return socket.emit('chat_error', 'Trip not found.');
      }

      const isMember =
        trip.creatorId === socket.user.id ||
        trip.approvedMembers.some((m) => m.userId === socket.user.id);

      if (!isMember) {
        return socket.emit('chat_error', 'You are not a member of this trip.');
      }

      socket.join(tripId);
      console.log(`${socket.user.name} joined Trip Room: ${tripId}`);
    } catch (error) {
      socket.emit('chat_error', 'Unable to join trip chat.');
    }
  });

  socket.on('send_message', (messageData) => {
    // sender identity always comes from the verified socket, never the client payload —
    // otherwise anyone could impersonate another crew member in chat.
    const safeMessage = {
      tripId: messageData.tripId,
      text: messageData.text,
      sender: socket.user.name,
      senderId: socket.user.id,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    socket.to(messageData.tripId).emit('receive_message', safeMessage);
  });

  socket.on('disconnect', () => {
    console.log(`❌ ${socket.user.name} disconnected: ${socket.id}`);
  });
});

// --- 5. DATABASE & SERVER BOOTUP ---
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB Connected Successfully! 🚀');
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => console.log('❌ Database connection error:', err));