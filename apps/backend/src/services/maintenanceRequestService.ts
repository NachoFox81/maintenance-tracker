import { createError } from '../middleware/errorHandler';
import { MaintenanceRequestModel } from '../models/MaintenanceRequest';
import { CreateMaintenanceRequestInput } from '../utils/validation';

export class MaintenanceRequestService {
  async createRequest(
    tenantId: string,
    requestData: CreateMaintenanceRequestInput
  ) {
    if (!tenantId) {
      throw createError('Authenticated tenant is required', 401);
    }

    const maintenanceRequest = await MaintenanceRequestModel.create({
      ...requestData,
      createdBy: tenantId,
      status: 'open',
    });

    return maintenanceRequest;
  }

  async getTenantRequests(tenantId: string) {
    if (!tenantId) {
      throw createError('Authenticated tenant is required', 401);
    }

    return MaintenanceRequestModel.find({ createdBy: tenantId }).sort({
      createdAt: -1,
    });
  }
}

export const maintenanceRequestService = new MaintenanceRequestService();
