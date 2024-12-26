require('dotenv').config();
const express = require('express');
const cors = require('cors');
const WebSocket = require('ws');
const http = require('http');
const connectDB = require('./config/db');
const createDefaultUser = require('./config/seedUser');

// Routes
const authRoutes = require('./routes/auth');
const testRoutes = require('./routes/tests');
const uploadRoutes = require('./routes/upload');

const app = express();
const server = http.createServer(app);

// WebSocket server for real-time feedback
const wss = new WebSocket.Server({ server });

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tests', testRoutes);
app.use('/api', uploadRoutes);

// WebSocket connection handling
wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    // Handle real-time messages
    const data = JSON.parse(message);
    
    // Broadcast to all connected clients
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
  });
});

// Connect to MongoDB and create default user
connectDB().then(() => {
  createDefaultUser();
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;