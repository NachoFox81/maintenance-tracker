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

export const getTenantMaintenanceRequests = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
      throw createError('Authenticated tenant is required', 401);
    }

    const maintenanceRequests =
      await maintenanceRequestService.getTenantRequests(req.user.id);

    res.status(200).json({
      success: true,
      message: 'Maintenance requests retrieved successfully',
      data: { maintenanceRequests },
    });
  }
);

export const getAllMaintenanceRequests = asyncHandler(
  async (_req: AuthenticatedRequest, res: Response) => {
    const maintenanceRequests =
      await maintenanceRequestService.getAllRequests();

    res.status(200).json({
      success: true,
      message: 'All maintenance requests retrieved successfully',
      data: { maintenanceRequests },
    });
  }
);

export const assignMaintenanceRequest = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const maintenanceRequest = await maintenanceRequestService.assignRequest(
      req.params.id,
      req.body
    );

    res.status(200).json({
      success: true,
      message: 'Maintenance request assigned successfully',
      data: { maintenanceRequest },
    });
  }
);

export const updateMaintenanceRequestStatus = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const maintenanceRequest = await maintenanceRequestService.updateStatus(
      req.params.id,
      req.body
    );

    res.status(200).json({
      success: true,
      message: 'Maintenance request status updated successfully',
      data: { maintenanceRequest },
    });
  }
);

export const updateMaintenanceRequestPriority = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const maintenanceRequest = await maintenanceRequestService.updatePriority(
      req.params.id,
      req.body
    );

    res.status(200).json({
      success: true,
      message: 'Maintenance request priority updated successfully',
      data: { maintenanceRequest },
    });
  }
);
