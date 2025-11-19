import app from './server';
import { config } from './config/app';
import prisma from './config/database';
import { requestLogger } from './middleware';

// Add request logging middleware
app.use(requestLogger);

const startServer = async () => {
  try {
    // Connect to database
    await prisma.$connect();
    console.log('Connected to database');

    // Start the server
    app.listen(config.port, () => {
      console.log(`Server is running on port ${config.port}`);
      console.log(`Health check: http://localhost:${config.port}/api/health`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;