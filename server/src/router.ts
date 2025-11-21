import express, { Request, Response } from 'express';

import { foodRouter } from './modules/foods/food-router';
import { imageRouter } from './modules/images/image-router';
import { inventoryRouter } from './modules/inventories/inventory-router';
import { resourcesRouter } from './modules/resources/resources-router';
import { usersRouter } from './modules/users/users-router';
import { sharingRouter } from './modules/sharing/sharing-router';
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
    clerkConfigured: !!process.env.CLERK_SECRET_KEY,
  });
});

// Public routes
router.use('/foods', foodRouter);
router.use('/resources', resourcesRouter);

// Protected routes (require authentication)
router.use('/users', usersRouter);
router.use('/inventories', inventoryRouter);
router.use('/images', imageRouter);
router.use('/sharing', sharingRouter);

export default router;
