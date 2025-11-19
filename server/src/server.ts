import express from 'express';
import config from './config/app';
import baseMiddleware from './middleware';
import foodRouter from './modules/foods/food-router'

const app = express();

// Apply base middleware
app.use(...baseMiddleware);

// Register routes
app.use('/api/foods', foodRouter);  // Food items routes

// Basic route for testing
app.get('/', (req, res) => {
  res.json({ message: 'Food Waste Management Backend API', version: '1.0.0' });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
const server = app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
  console.log(`Environment: ${config.nodeEnv}`);
});

export default app;
export { server };