import { createError } from '../middleware/errorHandler';
import { MaintenanceRequestModel } from '../models/MaintenanceRequest';
import { UserModel } from '../models/User';
import {
  AssignMaintenanceRequestInput,
  CreateMaintenanceRequestInput,
} from '../utils/validation';

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

  async getAllRequests() {
    return MaintenanceRequestModel.find({}).sort({
      createdAt: -1,
    });
  }

  async assignRequest(
    requestId: string,
    assignmentData: AssignMaintenanceRequestInput
  ) {
    const maintenanceRequest = await MaintenanceRequestModel.findById(requestId);
    if (!maintenanceRequest) {
      throw createError('Maintenance request not found', 404);
    }

    const assignee = await UserModel.findById(assignmentData.assignedTo);
    if (!assignee) {
      throw createError('Assigned user not found', 404);
    }

    if (!['admin', 'manager'].includes(assignee.role)) {
      throw createError('Assigned user must be an admin or manager', 400);
    }

    maintenanceRequest.assignedTo = assignee._id.toString();
    await maintenanceRequest.save();

    return maintenanceRequest;
  }
}

export const maintenanceRequestService = new MaintenanceRequestService();
