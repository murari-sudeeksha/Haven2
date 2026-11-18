require('dotenv').config();
const app = require('./app');
const { connectDB, disconnectDB } = require('./config/db');

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await connectDB();

    const server = app.listen(PORT, () => {
      console.log(`\n======================================================`);
      console.log(`🏡 HAVEN Backend Service running on port ${PORT}`);
      console.log(`🌐 API Root: http://localhost:${PORT}/api/health`);
      console.log(`🤖 AI Engine: Conversational Real Estate Engine Ready`);
      console.log(`======================================================\n`);
    });

    const gracefulShutdown = async signal => {
      console.log(`\nReceived ${signal}. Shutting down HAVEN server gracefully...`);
      server.close(async () => {
        await disconnectDB();
        console.log('MongoDB connection closed. Server terminated.');
        process.exit(0);
      });
    };

    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  } catch (err) {
    console.error('Fatal error during HAVEN server startup:', err);
    process.exit(1);
  }
}

startServer();
