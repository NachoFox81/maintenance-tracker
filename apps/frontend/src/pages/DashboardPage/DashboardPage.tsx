import React, { useEffect, useRef, useState } from 'react';
import ManagementMaintenanceWorkspace from '../../components/maintenance/ManagementMaintenanceWorkspace/ManagementMaintenanceWorkspace';
import TenantMaintenanceWorkspace from '../../components/maintenance/TenantMaintenanceWorkspace/TenantMaintenanceWorkspace';
import { useAuth } from '../../contexts/AuthContext';
import { maintenanceService } from '../../services/maintenanceService';
import {
  AssignableUser,
  CreateMaintenanceRequestFormData,
  MaintenanceRequest,
  MaintenanceRequestPriority,
  MaintenanceRequestStatus,
} from '../../types';

const defaultFormValues: CreateMaintenanceRequestFormData = {
  title: '',
  description: '',
  priority: 'normal',
  propertyUnitIdentifier: '',
};

const replaceRequest = (
  requests: MaintenanceRequest[],
  nextRequest: MaintenanceRequest
) =>
  requests.map(request =>
    request._id === nextRequest._id ? nextRequest : request
  );

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
  const [formValues, setFormValues] =
    useState<CreateMaintenanceRequestFormData>(defaultFormValues);
  const [isLoadingRequests, setIsLoadingRequests] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeRequestId, setActiveRequestId] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [operationsError, setOperationsError] = useState<string | null>(null);
  const [operationsErrorRequestId, setOperationsErrorRequestId] = useState<
    string | null
  >(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [assignableUsers, setAssignableUsers] = useState<AssignableUser[]>([]);
  const [assignmentDrafts, setAssignmentDrafts] = useState<
    Record<string, string>
  >({});
  const [pendingDeleteRequestId, setPendingDeleteRequestId] = useState<
    string | null
  >(null);
  const hasLoadedRequests = useRef(false);

  const isTenant = user?.role === 'tenant';
  const canManageQueue = user?.role === 'manager' || user?.role === 'admin';
  const canAssign = user?.role === 'admin';

  useEffect(() => {
    if (!user) {
      setIsLoadingRequests(false);
      return;
    }

    const loadRequests = async () => {
      try {
        setLoadError(null);
        setOperationsError(null);
        setOperationsErrorRequestId(null);

        if (!hasLoadedRequests.current) {
          setIsLoadingRequests(true);
        } else {
          setIsRefreshing(true);
        }

        if (isTenant) {
          const { maintenanceRequests } =
            await maintenanceService.getMyRequests();
          setRequests(maintenanceRequests);
          return;
        }

        if (canManageQueue) {
          const [{ maintenanceRequests }, { users }] = await Promise.all([
            maintenanceService.getAllRequests({
              ...(statusFilter !== 'all' && {
                status: statusFilter as MaintenanceRequestStatus,
              }),
              ...(priorityFilter !== 'all' && {
                priority: priorityFilter as MaintenanceRequestPriority,
              }),
            }),
            maintenanceService.getAssignableUsers(),
          ]);
          setRequests(maintenanceRequests);
          setAssignableUsers(users);
          return;
        }

        setRequests([]);
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : 'Failed to load maintenance requests';

        if (isTenant) {
          setLoadError(message);
        } else {
          setOperationsError(message);
        }
      } finally {
        hasLoadedRequests.current = true;
        setIsLoadingRequests(false);
        setIsRefreshing(false);
      }
    };

    loadRequests();
  }, [user, isTenant, canManageQueue, statusFilter, priorityFilter]);

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = event.target;
    setFormValues(current => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setIsSubmitting(true);
      setSubmitError(null);

      const { maintenanceRequest } = await maintenanceService.createRequest(
        formValues
      );

      setRequests(current => [maintenanceRequest, ...current]);
      setFormValues(defaultFormValues);
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : 'Failed to submit maintenance request'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

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

  if (isTenant) {
    return (
      <TenantMaintenanceWorkspace
        firstName={user?.firstName}
        requests={requests}
        formValues={formValues}
        isLoadingRequests={isLoadingRequests}
        isSubmitting={isSubmitting}
        loadError={loadError}
        submitError={submitError}
        onChange={handleChange}
        onSubmit={handleSubmit}
      />
    );
  }

  return (
    <ManagementMaintenanceWorkspace
      role={user?.role}
      requests={requests}
      isLoadingRequests={isLoadingRequests}
      isRefreshing={isRefreshing}
      activeRequestId={activeRequestId}
      pendingDeleteRequest={
        requests.find(request => request._id === pendingDeleteRequestId) ?? null
      }
      operationsError={operationsError}
      operationsErrorRequestId={operationsErrorRequestId}
      statusFilter={statusFilter}
      priorityFilter={priorityFilter}
      canAssign={canAssign}
      assignableUsers={assignableUsers}
      assignmentDrafts={assignmentDrafts}
      onStatusFilterChange={setStatusFilter}
      onPriorityFilterChange={setPriorityFilter}
      onResetFilters={() => {
        setStatusFilter('all');
        setPriorityFilter('all');
      }}
      onStatusUpdate={handleStatusUpdate}
      onPriorityUpdate={handlePriorityUpdate}
      onDeleteCancel={handleDeleteCancel}
      onDeleteConfirm={handleDeleteConfirm}
      onAssignmentDraftChange={(requestId, value) =>
        setAssignmentDrafts(current => ({
          ...current,
          [requestId]: value,
        }))
      }
      onAssignmentUpdate={handleAssignmentUpdate}
      onDeleteRequest={handleDeleteRequest}
    />
  );
};

export default DashboardPage;
