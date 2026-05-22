import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { setIO } from './utils/socketSingleton.js';
import jwt from 'jsonwebtoken';

// Load environment variables FIRST before importing anything that uses them
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Try to load .env file (for local development), but don't fail if it doesn't exist (production uses Render env vars)
const envPath = `${__dirname}/.env`;
const result = dotenv.config({ path: envPath });
if (result.error) {
  console.log('ℹ️ No .env file found (using environment variables from hosting platform)');
} else {
  console.log('✅ .env loaded successfully from file');
}

// Log critical environment variables status
console.log('='.repeat(50));
console.log('Environment Check:');
console.log('- GEMINI_API_KEY:', process.env.GEMINI_API_KEY ? '✅ Set' : '❌ Not set');
console.log('- GROQ_API_KEY:', process.env.GROQ_API_KEY ? '✅ Set' : '❌ Not set');
console.log('- SENDGRID_API_KEY:', process.env.SENDGRID_API_KEY ? '✅ Set' : '❌ Not set');
console.log('- MONGODB_URI:', process.env.MONGODB_URI ? '✅ Set' : '❌ Not set');
console.log('- JWT_SECRET:', process.env.JWT_SECRET ? '✅ Set' : '❌ Not set');
console.log('='.repeat(50));

const app = express();
const httpServer = createServer(app);

// CORS configuration
console.log('CORS Origin: ALL (Accepting requests from anywhere)');

const io = new Server(httpServer, {
  cors: {
    origin: (origin, callback) => callback(null, true), // Dynamically accept all origins
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true
  }
});

// Store io in singleton module (replaces fragile global.io pattern)
setIO(io);
global.io = io; // Kept for backward compatibility during migration

// Socket.io JWT Authentication Middleware
io.use((socket, next) => {
  try {
    const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.split(' ')[1];
    if (!token) {
      return next(new Error('Authentication error: No token provided'));
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = { _id: decoded.id };
    next();
  } catch (err) {
    console.error('Socket authentication error:', err.message);
    return next(new Error('Authentication error: Invalid token'));
  }
});

// Socket.io connection handling for notifications
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join user to their own room for notifications
  socket.on('join', (userId) => {
    const authenticatedUserId = socket.user?._id?.toString();
    if (authenticatedUserId && authenticatedUserId === userId) {
      socket.join(userId);
      console.log(`User ${userId} joined their notification room`);
    } else {
      console.warn(`Unauthorized join attempt from socket ${socket.id} to room ${userId}`);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Middleware
app.use(cors({
  origin: (origin, callback) => callback(null, true), // Dynamically accept all origins
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
const mongoUri = process.env.MONGODB_URI;
if (!mongoUri) {
  console.error('❌ MONGODB_URI environment variable not set!');
  console.error('Please add MONGODB_URI to your Render environment variables.');
  process.exit(1);
}
console.log('📡 Connecting to MongoDB...');
console.log('🔗 Connection string:', mongoUri.substring(0, 50) + '...');
mongoose.connect(mongoUri, {
  serverSelectionTimeoutMS: 5000,
  connectTimeoutMS: 5000
})
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    console.error('📍 Error type:', err.name);
    process.exit(1);
  });

// Dynamically import routes after .env is loaded
async function setupRoutes() {
  const { default: setupMatchmakingModule } = await import('./socket/matchmaking.js');
  const { default: authRoutesModule } = await import('./routes/auth.js');
  const { default: problemRoutesModule } = await import('./routes/problems.js');
  const { default: matchRoutesModule } = await import('./routes/matches.js');
  const { default: userRoutesModule } = await import('./routes/users.js');
  const { default: adminRoutesModule } = await import('./routes/admin.js');
  const { default: explanationRoutesModule } = await import('./routes/explanations.js');
  const { default: categoryRoutesModule } = await import('./routes/categories.js');
  const { default: dailyChallengeRoutesModule } = await import('./routes/dailyChallenge.js');
  const { default: submissionRoutesModule } = await import('./routes/submissions.js');
  const { default: discussionRoutesModule } = await import('./routes/discussions.js');
  const { default: adminChallengeRoutesModule } = await import('./routes/adminChallenges.js');
  const { default: challengeRoutesModule } = await import('./routes/challenges.js');
  const { default: contestRoutesModule } = await import('./routes/contests.js');
  const { default: adminContestRoutesModule } = await import('./routes/adminContests.js');
  const { default: notificationRoutesModule } = await import('./routes/notifications.js');
  const { default: judgeRoutesModule } = await import('./routes/judge.js');
  const { default: verificationRoutesModule } = await import('./routes/verification.js');
  const { default: testEmailRoutesModule } = await import('./routes/test-email.js');
  const { default: fairnessRoutesModule } = await import('./routes/fairness.js');

  // Setup WebSocket
  setupMatchmakingModule(io);

  // Routes
  app.use('/api/auth', authRoutesModule);
  app.use('/api/verification', verificationRoutesModule);
  app.use('/api/test-email', testEmailRoutesModule);
  app.use('/api/fairness', fairnessRoutesModule); // Test email endpoint
  app.use('/api/problems', problemRoutesModule);
  app.use('/api/matches', matchRoutesModule);
  app.use('/api/users', userRoutesModule);
  app.use('/api/admin', adminRoutesModule);
  app.use('/api/explanations', explanationRoutesModule);
  app.use('/api/categories', categoryRoutesModule);
  app.use('/api/daily-challenge', dailyChallengeRoutesModule);
  app.use('/api/submissions', submissionRoutesModule);
  app.use('/api/discussions', discussionRoutesModule);
  app.use('/api/admin/challenges', adminChallengeRoutesModule);
  app.use('/api/challenges', challengeRoutesModule);
  app.use('/api/contests', contestRoutesModule);
  app.use('/api/admin/contests', adminContestRoutesModule);
  app.use('/api/notifications', notificationRoutesModule);
  app.use('/api/judge', judgeRoutesModule);

  const { default: problemMetadataRoutesModule } = await import('./routes/problemMetadata.js');
  app.use('/api/problem-metadata', problemMetadataRoutesModule);

  const { default: storyRoutesModule } = await import('./routes/stories.js');
  app.use('/api/stories', storyRoutesModule);

  const { default: draftRoutesModule } = await import('./routes/drafts.js');
  app.use('/api/drafts', draftRoutesModule);

  const { default: virtualContestRoutesModule } = await import('./routes/virtualContests.js');
  app.use('/api/virtual-contests', virtualContestRoutesModule);
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ message: 'Internal server error' });
});

// Start server AFTER routes are set up
const PORT = process.env.PORT || 5000;

setupRoutes()
  .then(async () => {
    httpServer.listen(PORT, async () => {
      console.log(`✅ Server running on port ${PORT}`);
      console.log(`✅ Frontend URL: ${process.env.FRONTEND_URL}`);
      console.log(`✅ All routes registered successfully`);

      // Initialize Docker container pool (runs in background, doesn't block startup)
      if (process.env.USE_DOCKER === 'true') {
        import('./utils/dockerExecutor.js').then(({ initContainerPool }) => {
          initContainerPool().catch(err => console.error('⚠️  Container pool init failed:', err.message));
        });
      }

      // Restore match timeouts for any in-progress matches from before restart
      try {
        const { restoreActiveTimeouts } = await import('./utils/matchTimeout.js');
        await restoreActiveTimeouts();
      } catch (err) {
        console.error('⚠️  Error restoring match timeouts:', err.message);
      }
    });
  })
  .catch(err => {
    console.error('❌ Error setting up routes:', err);
    process.exit(1);
  });

// ═══ Graceful Shutdown ═══
// Handles SIGTERM (Render/Heroku restart) and SIGINT (Ctrl+C in dev)
// Ensures in-flight requests complete, DB connections close cleanly,
// and Socket.io clients are notified before the process exits.
const gracefulShutdown = async (signal) => {
  console.log(`\n⚠️  ${signal} received. Starting graceful shutdown...`);

  // 1. Stop accepting new connections
  httpServer.close(() => {
    console.log('✅ HTTP server closed (no new connections)');
  });

  // 2. Close Socket.io (disconnects all clients gracefully)
  try {
    io.close();
    console.log('✅ Socket.io connections closed');
  } catch (err) {
    console.error('⚠️  Error closing Socket.io:', err.message);
  }

  // 3. Cleanup Docker container pool
  try {
    if (process.env.USE_DOCKER === 'true') {
      const { cleanupContainerPool } = await import('./utils/dockerExecutor.js');
      await cleanupContainerPool();
      console.log('✅ Docker container pool cleaned up');
    }
  } catch (err) {
    console.error('⚠️  Error cleaning up container pool:', err.message);
  }

  // 4. Close MongoDB connection pool
  try {
    await mongoose.connection.close();
    console.log('✅ MongoDB connection closed');
  } catch (err) {
    console.error('⚠️  Error closing MongoDB:', err.message);
  }

  console.log('👋 Shutdown complete. Exiting.');
  process.exit(0);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

export default app;
