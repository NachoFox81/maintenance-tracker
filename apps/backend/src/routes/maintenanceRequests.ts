import { Router } from 'express';
import {
  assignMaintenanceRequest,
  getAllMaintenanceRequests,
  getTenantMaintenanceRequests,
  submitMaintenanceRequest,
} from '../controllers/maintenanceRequestController';
import { authenticate, authorize } from '../middleware/auth';
import { validateBody, validateParams } from '../middleware/validate';
import {
  assignMaintenanceRequestSchema,
  createMaintenanceRequestSchema,
  maintenanceRequestParamsSchema,
} from '../utils/validation';

const router = Router();

router.get(
  '/all',
  authenticate,
  authorize('manager', 'admin'),
  getAllMaintenanceRequests
);

router.patch(
  '/:id/assign',
  authenticate,
  authorize('admin'),
  validateParams(maintenanceRequestParamsSchema),
  validateBody(assignMaintenanceRequestSchema),
  assignMaintenanceRequest
);

router.get('/', authenticate, authorize('tenant'), getTenantMaintenanceRequests);

router.post(
  '/',
  authenticate,
  authorize('tenant'),
  validateBody(createMaintenanceRequestSchema),
  submitMaintenanceRequest
);

export default router;
