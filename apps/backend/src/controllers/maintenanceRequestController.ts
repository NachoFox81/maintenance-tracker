import { Response } from 'express';
import { asyncHandler, createError } from '../middleware/errorHandler';
import { AuthenticatedRequest } from '../middleware/auth';
import { maintenanceRequestService } from '../services/maintenanceRequestService';

export const submitMaintenanceRequest = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
      throw createError('Authenticated tenant is required', 401);
    }

    const maintenanceRequest = await maintenanceRequestService.createRequest(
      req.user.id,
      req.body
    );

    res.status(201).json({
      success: true,
      message: 'Maintenance request submitted successfully',
      data: { maintenanceRequest },
    });
  }
);
