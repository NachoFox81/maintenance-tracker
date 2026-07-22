import { useState } from 'react';
import { maintenanceService } from '../../../services/maintenanceService';
import {
  MaintenanceRequest,
  MaintenanceRequestPriority,
  MaintenanceRequestStatus,
} from '../../../types';
import { replaceRequest } from './dashboardMaintenanceUtils';

interface UseManagementQueueActionsParams {
  requests: MaintenanceRequest[];
  setRequests: React.Dispatch<React.SetStateAction<MaintenanceRequest[]>>;
  operationsError: string | null;
  setOperationsError: React.Dispatch<React.SetStateAction<string | null>>;
  operationsErrorRequestId: string | null;
  setOperationsErrorRequestId: React.Dispatch<
    React.SetStateAction<string | null>
  >;
}

const useManagementQueueActions = ({
  requests,
  setRequests,
  operationsError,
  setOperationsError,
  operationsErrorRequestId,
  setOperationsErrorRequestId,
}: UseManagementQueueActionsParams) => {
  const [activeRequestId, setActiveRequestId] = useState<string | null>(null);
  const [assignmentDrafts, setAssignmentDrafts] = useState<
    Record<string, string>
  >({});
  const [pendingDeleteRequestId, setPendingDeleteRequestId] = useState<
    string | null
  >(null);

  const handleStatusUpdate = async (
    requestId: string,
    status: MaintenanceRequestStatus
  ) => {
    try {
      setActiveRequestId(requestId);
      setOperationsError(null);
      setOperationsErrorRequestId(null);
      const { maintenanceRequest } = await maintenanceService.updateStatus(
        requestId,
        status
      );
      setRequests(current => replaceRequest(current, maintenanceRequest));
    } catch (error) {
      setOperationsErrorRequestId(requestId);
      setOperationsError(
        error instanceof Error
          ? error.message
          : 'Failed to update request status'
      );
    } finally {
      setActiveRequestId(null);
    }
  };

  const handlePriorityUpdate = async (
    requestId: string,
    priority: MaintenanceRequestPriority
  ) => {
    try {
      setActiveRequestId(requestId);
      setOperationsError(null);
      setOperationsErrorRequestId(null);
      const { maintenanceRequest } = await maintenanceService.updatePriority(
        requestId,
        priority
      );
      setRequests(current => replaceRequest(current, maintenanceRequest));
    } catch (error) {
      setOperationsErrorRequestId(requestId);
      setOperationsError(
        error instanceof Error
          ? error.message
          : 'Failed to update request priority'
      );
    } finally {
      setActiveRequestId(null);
    }
  };

  const handleAssignmentDraftChange = (requestId: string, value: string) => {
    setAssignmentDrafts(current => ({
      ...current,
      [requestId]: value,
    }));
  };

  const handleAssignmentUpdate = async (requestId: string) => {
    const assignedTo = assignmentDrafts[requestId]?.trim();
    if (!assignedTo) {
      setOperationsErrorRequestId(requestId);
      setOperationsError('Enter a manager or admin user id to assign a request.');
      return;
    }

    try {
      setActiveRequestId(requestId);
      setOperationsError(null);
      setOperationsErrorRequestId(null);
      const { maintenanceRequest } = await maintenanceService.assignRequest(
        requestId,
        assignedTo
      );
      setRequests(current => replaceRequest(current, maintenanceRequest));
    } catch (error) {
      setOperationsErrorRequestId(requestId);
      setOperationsError(
        error instanceof Error
          ? error.message
          : 'Failed to assign maintenance request'
      );
    } finally {
      setActiveRequestId(null);
    }
  };

  const handleDeleteRequest = async (requestId: string) => {
    setPendingDeleteRequestId(requestId);
  };

  const handleDeleteCancel = () => {
    if (activeRequestId) {
      return;
    }

    setPendingDeleteRequestId(null);
  };

  const handleDeleteConfirm = async () => {
    if (!pendingDeleteRequestId) {
      return;
    }

    try {
      setActiveRequestId(pendingDeleteRequestId);
      setOperationsError(null);
      setOperationsErrorRequestId(null);
      await maintenanceService.deleteRequest(pendingDeleteRequestId);
      setRequests(current =>
        current.filter(request => request._id !== pendingDeleteRequestId)
      );
      setPendingDeleteRequestId(null);
    } catch (error) {
      setOperationsErrorRequestId(pendingDeleteRequestId);
      setOperationsError(
        error instanceof Error
          ? error.message
          : 'Failed to delete maintenance request'
      );
    } finally {
      setActiveRequestId(null);
    }
  };

  return {
    activeRequestId,
    assignmentDrafts,
    pendingDeleteRequest:
      requests.find(request => request._id === pendingDeleteRequestId) ?? null,
    operationsError,
    operationsErrorRequestId,
    handleStatusUpdate,
    handlePriorityUpdate,
    handleAssignmentDraftChange,
    handleAssignmentUpdate,
    handleDeleteRequest,
    handleDeleteCancel,
    handleDeleteConfirm,
  };
};

export default useManagementQueueActions;
