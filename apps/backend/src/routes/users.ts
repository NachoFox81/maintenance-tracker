import { Router } from 'express';
import { getAssignableUsers } from '../controllers/userController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.get(
  '/assignable',
  authenticate,
  authorize('manager', 'admin'),
  getAssignableUsers
);

export default router;
