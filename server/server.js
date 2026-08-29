import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import http from 'http'; 
import { Server } from 'socket.io'; 

// Import Routes
import userRoutes from './src/routes/userRoutes.js';
import tripRoutes from './src/routes/tripRoutes.js';
import matchRoutes from './src/routes/matchRoutes.js';
import expenseRoutes from './src/routes/expenseRoutes.js';
import authRoutes from './src/routes/authRoutes.js';
import postRoutes from './src/routes/postRoutes.js';
import router from './src/routes/userRoutes.js';

dotenv.config();

const app = express();

// Origins allowed to call this API — local dev plus the deployed frontend.
// Add CLIENT_URL as an env var on Render if you ever change/add a frontend domain.
const allowedOrigins = [
  "http://localhost:5173",
  "https://travel-buddy-finder-frontend.onrender.com",
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

// --- 3. API ROUTES ---
app.use('/api/auth', authRoutes); 
app.use('/api/users', userRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/posts', postRoutes);

// --- 4. SOCKET.IO CHAT LOGIC ---
io.on('connection', (socket) => {
  console.log(`🔌 New User Connected: ${socket.id}`);

  socket.on('join_trip_room', (tripId) => {
    socket.join(tripId);
    console.log(`User ${socket.id} joined Trip Room: ${tripId}`);
  });

  socket.on('send_message', (messageData) => {
    socket.to(messageData.tripId).emit('receive_message', messageData);
  });

  socket.on('disconnect', () => {
    console.log(`❌ User Disconnected: ${socket.id}`);
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