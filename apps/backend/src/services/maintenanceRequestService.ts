import { createError } from '../middleware/errorHandler';
import {
  MaintenanceRequestModel,
  MaintenanceRequestStatus,
} from '../models/MaintenanceRequest';
import { UserModel } from '../models/User';
import {
  AssignMaintenanceRequestInput,
  CreateMaintenanceRequestInput,
  MaintenanceRequestFilterQuery,
  UpdateMaintenanceRequestPriorityInput,
  UpdateMaintenanceRequestStatusInput,
} from '../utils/validation';

const VALID_STATUS_TRANSITIONS: Record<
  MaintenanceRequestStatus,
  MaintenanceRequestStatus[]
> = {
  open: ['in-progress', 'cancelled'],
  'in-progress': ['completed', 'cancelled'],
  completed: [],
  cancelled: [],
};

export class MaintenanceRequestService {
  private readonly requestPopulation = [
    {
      path: 'createdBy',
      select: 'firstName lastName email role',
    },
    {
      path: 'assignedTo',
      select: 'firstName lastName email role',
    },
  ] as const;

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

    return MaintenanceRequestModel.find({ createdBy: tenantId })
      .populate(this.requestPopulation)
      .sort({
        createdAt: -1,
      });
  }

  async getAllRequests(filters: MaintenanceRequestFilterQuery = {}) {
    return MaintenanceRequestModel.find({
      ...(filters.status && { status: filters.status }),
      ...(filters.priority && { priority: filters.priority }),
    })
      .populate(this.requestPopulation)
      .sort({
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

    return maintenanceRequest.populate(this.requestPopulation);
  }

  async updateStatus(
    requestId: string,
    statusData: UpdateMaintenanceRequestStatusInput
  ) {
    const maintenanceRequest = await MaintenanceRequestModel.findById(requestId);
    if (!maintenanceRequest) {
      throw createError('Maintenance request not found', 404);
    }

    const nextStatus = statusData.status;
    const allowedTransitions =
      VALID_STATUS_TRANSITIONS[maintenanceRequest.status];

    if (!allowedTransitions.includes(nextStatus)) {
      throw createError(
        `Cannot change status from ${maintenanceRequest.status} to ${nextStatus}`,
        400
      );
    }

    maintenanceRequest.status = nextStatus;
    maintenanceRequest.completedAt =
      nextStatus === 'completed' ? new Date() : null;

    await maintenanceRequest.save();

    return maintenanceRequest.populate(this.requestPopulation);
  }

  async updatePriority(
    requestId: string,
    priorityData: UpdateMaintenanceRequestPriorityInput
  ) {
    const maintenanceRequest = await MaintenanceRequestModel.findById(requestId);
    if (!maintenanceRequest) {
      throw createError('Maintenance request not found', 404);
    }

    maintenanceRequest.priority = priorityData.priority;
    await maintenanceRequest.save();

    return maintenanceRequest.populate(this.requestPopulation);
  }

  async deleteRequest(requestId: string) {
    const maintenanceRequest =
      await MaintenanceRequestModel.findByIdAndDelete(requestId);

    if (!maintenanceRequest) {
      throw createError('Maintenance request not found', 404);
    }
  }
}

export const maintenanceRequestService = new MaintenanceRequestService();
