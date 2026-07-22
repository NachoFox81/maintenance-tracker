import { User } from '../../../types';
import useMaintenanceFilters from './useMaintenanceFilters';
import useMaintenanceRequests from './useMaintenanceRequests';
import useManagementQueueActions from './useManagementQueueActions';
import useTenantRequestForm from './useTenantRequestForm';

const useDashboardMaintenance = (user: User | null) => {
  const isTenant = user?.role === 'tenant';
  const canManageQueue = user?.role === 'manager' || user?.role === 'admin';
  const canAssign = user?.role === 'admin';

  const {
    statusFilter,
    priorityFilter,
    setStatusFilter,
    setPriorityFilter,
    handleResetFilters,
  } = useMaintenanceFilters();

  const {
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
  } = useMaintenanceRequests({
    user,
    isTenant,
    canManageQueue,
    statusFilter,
    priorityFilter,
  });

  const { formValues, isSubmitting, submitError, handleChange, handleSubmit } =
    useTenantRequestForm({
      setRequests,
    });

  const {
    activeRequestId,
    assignmentDrafts,
    pendingDeleteRequest,
    handleStatusUpdate,
    handlePriorityUpdate,
    handleAssignmentDraftChange,
    handleAssignmentUpdate,
    handleDeleteRequest,
    handleDeleteCancel,
    handleDeleteConfirm,
  } = useManagementQueueActions({
    requests,
    setRequests,
    operationsError,
    setOperationsError,
    operationsErrorRequestId,
    setOperationsErrorRequestId,
  });

  return {
    requests,
    formValues,
    isLoadingRequests,
    isSubmitting,
    isRefreshing,
    activeRequestId,
    loadError,
    submitError,
    operationsError,
    operationsErrorRequestId,
    statusFilter,
    priorityFilter,
    canAssign,
    assignableUsers,
    assignmentDrafts,
    isTenant,
    pendingDeleteRequest,
    handleChange,
    handleSubmit,
    handleStatusUpdate,
    handlePriorityUpdate,
    handleAssignmentDraftChange,
    handleAssignmentUpdate,
    handleDeleteRequest,
    handleDeleteCancel,
    handleDeleteConfirm,
    handleResetFilters,
    setStatusFilter,
    setPriorityFilter,
  };
};

export default useDashboardMaintenance;
