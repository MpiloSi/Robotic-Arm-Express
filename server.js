/*import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

const ESP32_IP = 'http://192.168.1.100'; // Replace with your ESP32's IP address

let isSorting = false;
let performanceMetrics = {
  objectsSorted: 0,
  accuracy: 0,
  sortingRate: 0
};

app.post('/start', async (req, res) => {
  try {
    const response = await fetch(`${ESP32_IP}/start`, { method: 'POST' });
    if (response.ok) {
      isSorting = true;
      io.emit('sortingStatus', { isSorting });
      res.json({ success: true, message: 'Sorting started' });
    } else {
      res.status(500).json({ success: false, message: 'Failed to start sorting' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error communicating with ESP32' });
  }
});

app.post('/stop', async (req, res) => {
  try {
    const response = await fetch(`${ESP32_IP}/stop`, { method: 'POST' });
    if (response.ok) {
      isSorting = false;
      io.emit('sortingStatus', { isSorting });
      res.json({ success: true, message: 'Sorting stopped' });
    } else {
      res.status(500).json({ success: false, message: 'Failed to stop sorting' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error communicating with ESP32' });
  }
});

app.get('/metrics', (req, res) => {
  res.json(performanceMetrics);
});

// Simulating updates to performance metrics
setInterval(() => {
  if (isSorting) {
    performanceMetrics.objectsSorted += Math.floor(Math.random() * 5);
    performanceMetrics.accuracy = 90 + Math.random() * 10;
    performanceMetrics.sortingRate = 10 + Math.random() * 5;
    io.emit('performanceUpdate', performanceMetrics);
  }
}, 5000);

io.on('connection', (socket) => {
  console.log('A client connected');
  socket.emit('sortingStatus', { isSorting });
  socket.emit('performanceUpdate', performanceMetrics);
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));*/