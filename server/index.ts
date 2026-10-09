import app from './app';
import { connectToDatabase, disconnectFromDatabase } from './lib/mongodb';

const PORT = process.env.PORT || 5000;

const handleShutdown = async () => {
  try {
    await disconnectFromDatabase();
  } catch (err) {
    console.error('Error closing database connection:', err);
  }
  process.exit(0);
};

process.on('SIGINT', handleShutdown);
process.on('SIGTERM', handleShutdown);
process.once('SIGUSR2', async () => {
  try {
    await disconnectFromDatabase();
  } catch (err) {
    console.error('Error closing database connection on reload:', err);
  }
  process.kill(process.pid, 'SIGUSR2');
});

// Connect to MongoDB and start Express server (local dev only — Vercel uses api/index.ts)
const start = async () => {
  try {
    await connectToDatabase();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

start();
