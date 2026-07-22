import api, { handleApiError, handleApiResponse } from './api';
import {
  AssignableUser,
  CreateMaintenanceRequestFormData,
  MaintenanceRequestFilters,
  MaintenanceRequest,
  MaintenanceRequestPriority,
  MaintenanceRequestStatus,
} from '../types';

export const maintenanceService = {
  async getAssignableUsers(): Promise<{ users: AssignableUser[] }> {
    try {
      const response = await api.get('/users/assignable');
      return handleApiResponse<{ users: AssignableUser[] }>(response);
    } catch (error) {
      return handleApiError(error);
    }
  },

  async getMyRequests(): Promise<{ maintenanceRequests: MaintenanceRequest[] }> {
    try {
      const response = await api.get('/maintenance-requests');
      return handleApiResponse<{ maintenanceRequests: MaintenanceRequest[] }>(
        response
      );
    } catch (error) {
      return handleApiError(error);
    }
  },

  async getAllRequests(
    filters: MaintenanceRequestFilters = {}
  ): Promise<{ maintenanceRequests: MaintenanceRequest[] }> {
    try {
      const response = await api.get('/maintenance-requests/all', {
        params: filters,
      });
      return handleApiResponse<{ maintenanceRequests: MaintenanceRequest[] }>(
        response
      );
    } catch (error) {
      return handleApiError(error);
    }
  },

  async createRequest(
    requestData: CreateMaintenanceRequestFormData
  ): Promise<{ maintenanceRequest: MaintenanceRequest }> {
    try {
      const response = await api.post('/maintenance-requests', requestData);
      return handleApiResponse<{ maintenanceRequest: MaintenanceRequest }>(
        response
      );
    } catch (error) {
      return handleApiError(error);
    }
  },

  async updateStatus(
    requestId: string,
    status: MaintenanceRequestStatus
  ): Promise<{ maintenanceRequest: MaintenanceRequest }> {
    try {
      const response = await api.patch(
        `/maintenance-requests/${requestId}/status`,
        { status }
      );
      return handleApiResponse<{ maintenanceRequest: MaintenanceRequest }>(
        response
      );
    } catch (error) {
      return handleApiError(error);
    }
  },

  async updatePriority(
    requestId: string,
    priority: MaintenanceRequestPriority
  ): Promise<{ maintenanceRequest: MaintenanceRequest }> {
    try {
      const response = await api.patch(
        `/maintenance-requests/${requestId}/priority`,
        { priority }
      );
      return handleApiResponse<{ maintenanceRequest: MaintenanceRequest }>(
        response
      );
    } catch (error) {
      return handleApiError(error);
    }
  },

  async assignRequest(
    requestId: string,
    assignedTo: string
  ): Promise<{ maintenanceRequest: MaintenanceRequest }> {
    try {
      const response = await api.patch(
        `/maintenance-requests/${requestId}/assign`,
        { assignedTo }
      );
      return handleApiResponse<{ maintenanceRequest: MaintenanceRequest }>(
        response
      );
    } catch (error) {
      return handleApiError(error);
    }
  },

  async deleteRequest(requestId: string): Promise<void> {
    try {
      const response = await api.delete(`/maintenance-requests/${requestId}`);
      handleApiResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  },
};
