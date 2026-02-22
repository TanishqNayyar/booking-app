require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const apiRoutes = require('./routes/api');

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json());

// Socket.io Setup
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  socket.on('join_expert', (expertId) => {
    socket.join(`expert_${expertId}`);
  });
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Make io accessible in controllers
app.set('io', io);

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('MongoDB Connected');
    
    // Seed experts
    const expertController = require('./controllers/expertController');
    await expertController.seedExperts();
  })
  .catch(err => console.log(err));

// Routes
app.use('/api', apiRoutes);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));