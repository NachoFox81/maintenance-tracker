import { useEffect, useRef, useState } from 'react';
import { maintenanceService } from '../../../services/maintenanceService';
import {
  AssignableUser,
  MaintenanceRequest,
  MaintenanceRequestPriority,
  MaintenanceRequestStatus,
  User,
} from '../../../types';

interface UseMaintenanceRequestsParams {
  user: User | null;
  isTenant: boolean;
  canManageQueue: boolean;
  statusFilter: string;
  priorityFilter: string;
}

const useMaintenanceRequests = ({
  user,
  isTenant,
  canManageQueue,
  statusFilter,
  priorityFilter,
}: UseMaintenanceRequestsParams) => {
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
  const [assignableUsers, setAssignableUsers] = useState<AssignableUser[]>([]);
  const [isLoadingRequests, setIsLoadingRequests] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [operationsError, setOperationsError] = useState<string | null>(null);
  const [operationsErrorRequestId, setOperationsErrorRequestId] = useState<
    string | null
  >(null);
  const hasLoadedRequests = useRef(false);

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

    void loadRequests();
  }, [user, isTenant, canManageQueue, statusFilter, priorityFilter]);

  return {
    requests,
    setRequests,
    assignableUsers,
    isLoadingRequests,
    isRefreshing,
    loadError,
    operationsError,
    operationsErrorRequestId,
    setOperationsError,
    setOperationsErrorRequestId,
  };
};

export default useMaintenanceRequests;
