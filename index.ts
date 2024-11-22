// index.ts
import 'reflect-metadata'; // Import reflect-metadata at the very top
import express from 'express';
import { AppDataSource } from './data-source';
import userRoutes from './routes/userRoutes';

const app = express();
app.use(express.json());

// Use routes
app.use('/api/users', userRoutes);

// Define a port
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Start the server after the data source has initialized
AppDataSource.initialize()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err: Error) => {
    console.error('Error during Data Source initialization:', err);
  });
