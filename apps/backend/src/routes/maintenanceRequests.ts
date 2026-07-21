import { Router } from 'express';
import {
  assignMaintenanceRequest,
  getAllMaintenanceRequests,
  getTenantMaintenanceRequests,
  submitMaintenanceRequest,
  updateMaintenanceRequestPriority,
  updateMaintenanceRequestStatus,
} from '../controllers/maintenanceRequestController';
import { authenticate, authorize } from '../middleware/auth';
import { validateBody, validateParams } from '../middleware/validate';
import {
  assignMaintenanceRequestSchema,
  createMaintenanceRequestSchema,
  maintenanceRequestParamsSchema,
  updateMaintenanceRequestPrioritySchema,
  updateMaintenanceRequestStatusSchema,
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

router.patch(
  '/:id/status',
  authenticate,
  authorize('manager', 'admin'),
  validateParams(maintenanceRequestParamsSchema),
  validateBody(updateMaintenanceRequestStatusSchema),
  updateMaintenanceRequestStatus
);

router.patch(
  '/:id/priority',
  authenticate,
  authorize('manager', 'admin'),
  validateParams(maintenanceRequestParamsSchema),
  validateBody(updateMaintenanceRequestPrioritySchema),
  updateMaintenanceRequestPriority
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
