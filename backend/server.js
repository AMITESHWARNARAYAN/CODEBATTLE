import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Load environment variables FIRST before importing anything that uses them
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const envPath = `${__dirname}/.env`;
console.log('Loading .env from:', envPath);
const result = dotenv.config({ path: envPath });
if (result.error) {
  console.error('Error loading .env:', result.error);
} else {
  console.log('✅ .env loaded successfully');
  console.log('GEMINI_API_KEY:', process.env.GEMINI_API_KEY ? '✅ Set' : '❌ Not set');
  console.log('GROQ_API_KEY:', process.env.GROQ_API_KEY ? '✅ Set' : '❌ Not set');
}

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors({
  origin: '*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

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

  // Setup WebSocket
  setupMatchmakingModule(io);

  // Routes
  app.use('/api/auth', authRoutesModule);
  app.use('/api/problems', problemRoutesModule);
  app.use('/api/matches', matchRoutesModule);
  app.use('/api/users', userRoutesModule);
  app.use('/api/admin', adminRoutesModule);
  app.use('/api/explanations', explanationRoutesModule);
  app.use('/api/categories', categoryRoutesModule);
}

setupRoutes().catch(err => console.error('Error setting up routes:', err));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ message: 'Internal server error' });
});

// Start server
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Frontend URL: ${process.env.FRONTEND_URL}`);
});

export default app;

