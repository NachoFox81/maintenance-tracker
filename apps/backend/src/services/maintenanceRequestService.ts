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
}

export const maintenanceRequestService = new MaintenanceRequestService();
