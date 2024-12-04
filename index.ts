import 'reflect-metadata'; // Import reflect-metadata at the very top
import express from 'express';
import http from 'http';
import WebSocket from 'ws';
import cors from 'cors'; // Import cors
import { AppDataSource } from './data-source';
import userRoutes from './routes/userRoutes';

const app = express();

// Use cors middleware
app.use(
  cors({
    origin: process.env.ORIGIN || 'http://localhost:3000', // Allow requests from this origin
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  })
);

app.use(express.json());

// Use routes
app.use('/api/users', userRoutes);

// Define a port
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Start the server after the data source has initialized
AppDataSource.initialize()
  .then(() => {
    // Create an HTTP server and pass the Express app to it
    const server = http.createServer(app);

    // Create a WebSocket server and attach it to the HTTP server
    const wss = new WebSocket.Server({ server, path:'/ws' });

    // Set up WebSocket connection handler
    wss.on('connection', (ws: WebSocket) => {
      console.log('New client connected via WebSocket');

      // Send a message to the connected client
      ws.send('Hello from the server via WebSocket!');

      // Set up message handler
      ws.on('message', (message: WebSocket.Data) => {
        console.log(`Received message from client: ${message}`);
        // Echo the message back to the client
        ws.send(`Server received: ${message}`);
      });

      // Handle WebSocket close event
      ws.on('close', () => {
        console.log('Client disconnected');
      });
    });

    // Start the HTTP server
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err: Error) => {
    console.error('Error during Data Source initialization:', err);
  });
