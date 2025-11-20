import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import app from './server';
import config from './config/app';
import prisma from './config/database';
import baseMiddleware from './middleware';

// Simple CORS - Allow frontend origin
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

// Add base middleware
baseMiddleware.forEach(mw => app.use(mw));

const startServer = async () => {
  try {
    // Connect to database
    await prisma.$connect();
    console.log('✅ Connected to database');

    // Start the server
    app.listen(config.port, () => {
      console.log(`✅ Server is running on port ${config.port}`);
      console.log(`🏥 Health check: http://localhost:${config.port}/api/health`);
      console.log(`🔑 Clerk Auth: ${process.env.CLERK_SECRET_KEY ? 'Configured' : 'Not configured'}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;