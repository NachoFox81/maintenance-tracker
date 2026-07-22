import api, { handleApiError, handleApiResponse } from './api';
import {
  CreateMaintenanceRequestFormData,
  MaintenanceRequest,
} from '../types';

export const maintenanceService = {
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
};
