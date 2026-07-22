import { Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { AuthenticatedRequest } from '../middleware/auth';
import { userService } from '../services/userService';

export const getAssignableUsers = asyncHandler(
  async (_req: AuthenticatedRequest, res: Response) => {
    const users = await userService.getAssignableUsers();

    res.status(200).json({
      success: true,
      message: 'Assignable users retrieved successfully',
      data: { users },
    });
  }
);
