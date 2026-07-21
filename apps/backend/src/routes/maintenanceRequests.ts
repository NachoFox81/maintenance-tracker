import { Router } from 'express';
import { submitMaintenanceRequest } from '../controllers/maintenanceRequestController';
import { authenticate, authorize } from '../middleware/auth';
import { validateBody } from '../middleware/validate';
import { createMaintenanceRequestSchema } from '../utils/validation';

const router = Router();

router.post(
  '/',
  authenticate,
  authorize('tenant'),
  validateBody(createMaintenanceRequestSchema),
  submitMaintenanceRequest
);

export default router;
