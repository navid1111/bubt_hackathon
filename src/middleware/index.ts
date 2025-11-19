
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';

// Base middleware configuration
const baseMiddleware = [
  // Security middleware
  helmet(),
  
  // Enable CORS for all routes
  cors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
    credentials: true,
  }),
  
  // Enable compression
  compression(),
  
  // Parse JSON bodies
  express.json({ limit: '10mb' }),
  
  // Parse URL-encoded bodies
  express.urlencoded({ extended: true, limit: '10mb' }),
];

export default baseMiddleware;