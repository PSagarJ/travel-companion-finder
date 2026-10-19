import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
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
import reviewRoutes from './src/routes/reviewRoutes.js';
import User from './src/models/User.js';
import Trip from './src/models/TripModel.js';

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '.env') });
dotenv.config();

const app = express();

// Origins allowed to call this API — local dev plus deployed frontends.
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:3000",
  "http://127.0.0.1:5173",
  "https://travel-companion-finder-frontend.onrender.com",
  process.env.CLIENT_URL,
].filter(Boolean);

const isOriginAllowed = (origin) => {
  if (!origin) return true; // allow same-origin, curl, server-to-server, mobile
  if (allowedOrigins.includes(origin)) return true;
  // Allow any local dev port
  if (/^http:\/\/localhost:\d+$/.test(origin) || /^http:\/\/127\.0\.0\.1:\d+$/.test(origin)) return true;
  // Allow Vercel preview and production deployments
  if (/^https:\/\/.*\.vercel\.app$/.test(origin)) return true;
  // Allow Render deployments
  if (/^https:\/\/.*\.onrender\.com$/.test(origin)) return true;
  return false;
};

const corsOptions = {
  origin: (origin, callback) => {
    if (isOriginAllowed(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

// Rate Limiters
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30, // 30 requests per 15 min per IP
  message: { message: 'Too many authentication attempts. Please try again in 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300, // 300 requests per 15 min
  standardHeaders: true,
  legacyHeaders: false,
});

// --- 1. GLOBAL MIDDLEWARES ---
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
}));
app.use(express.json({ limit: '1mb' }));
app.use(cors(corsOptions));

// Health Check Endpoints for cloud load balancers and deployment probes
const healthHandler = (req, res) => {
  res.status(200).json({
    status: 'healthy',
    service: 'travel-companion-finder-api',
    uptime: `${Math.floor(process.uptime())}s`,
    timestamp: new Date().toISOString(),
  });
};

app.get('/health', healthHandler);
app.get('/api/health', healthHandler);

app.use('/api', apiLimiter);
app.use('/api/auth', authLimiter);

// --- 2. WRAP EXPRESS WITH HTTP SERVER FOR SOCKET.IO ---
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      callback(null, isOriginAllowed(origin));
    },
    methods: ["GET", "POST"],
    credentials: true,
  }
});

app.set('io', io);

// --- 3. API ROUTES ---
app.use('/api/auth', authRoutes); 
app.use('/api/users', userRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/reviews', reviewRoutes);

// --- 4. OPTIONAL STATIC SERVING IN PRODUCTION ---
const clientDistPath = path.resolve(__dirname, '../client/dist');
app.use(express.static(clientDistPath));

// --- 5. GLOBAL ERROR HANDLER ---
app.use((err, req, res, next) => {
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({ message: 'CORS forbidden: origin not allowed.' });
  }
  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File is too large. Max limit is 5MB.' });
    }
    return res.status(400).json({ message: `Upload error: ${err.message}` });
  }
  console.error('Unhandled server error:', err.message);
  res.status(err.status || 500).json({
    message: err.message && process.env.NODE_ENV !== 'production' ? err.message : 'Internal server error',
  });
});

// Single Page Application routing fallback for production deployment
app.use((req, res, next) => {
  if (req.path.startsWith('/api') || req.path.startsWith('/socket.io')) {
    return res.status(404).json({ message: 'API route not found' });
  }
  const indexPath = path.join(clientDistPath, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) next();
  });
});

// --- 6. SOCKET.IO AUTHENTICATION ---
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error('Authentication required'));

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('name');
    if (!user) return next(new Error('User not found'));

    socket.user = { id: decoded.id, name: user.name };
    next();
  } catch (error) {
    next(new Error('Authentication failed'));
  }
});

// --- 7. SOCKET.IO CHAT LOGIC ---
io.on('connection', (socket) => {
  console.log(`🔌 ${socket.user.name} connected: ${socket.id}`);

  socket.on('join_trip_room', async (tripId) => {
    try {
      if (!mongoose.Types.ObjectId.isValid(tripId)) {
        return socket.emit('chat_error', 'Invalid trip ID format.');
      }

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
    if (!messageData || !messageData.tripId || !messageData.text) return;

    if (!socket.rooms.has(messageData.tripId)) {
      return socket.emit('chat_error', 'You must join the trip room before sending messages.');
    }

    const trimmedText = String(messageData.text).trim();
    if (trimmedText.length === 0 || trimmedText.length > 2000) return;

    const safeMessage = {
      tripId: messageData.tripId,
      text: trimmedText,
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

// --- 8. DATABASE & SERVER BOOTUP ---
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} 🚀`);
});

if (process.env.MONGO_URI) {
  mongoose.connect(process.env.MONGO_URI)
    .then(() => {
      console.log('MongoDB Connected Successfully! 🚀');
    })
    .catch((err) => console.error('❌ Database connection error:', err.message));
} else {
  console.warn('⚠️ MONGO_URI is not set in environment variables');
}