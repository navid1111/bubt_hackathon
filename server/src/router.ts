import express, { Request, Response } from 'express';

import { resourcesRouter } from './modules/resources/resources-router';
import { foodRouter } from './modules/foods/food-router';
const router = express.Router();

router.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Welcome to the Food Waste Management API!' });
});

// Health check endpoint
router.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'OK',
    message: 'Food Waste Management API is running',
    timestamp: new Date().toISOString(),
  });
});

router.use('/foods',foodRouter);

router.use('/resources', resourcesRouter);

export default router;
