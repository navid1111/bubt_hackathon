import express from 'express';
import config from './config/app';
import baseMiddleware from './middleware';

const app = express();

// Apply base middleware
app.use(...baseMiddleware);

// Basic route for testing
app.get('/', (req, res) => {
  res.json({ message: 'Food Waste Management Backend API', version: '1.0.0' });
});

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
const server = app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
  console.log(`Environment: ${config.nodeEnv}`);
});

export default app;
export { server };