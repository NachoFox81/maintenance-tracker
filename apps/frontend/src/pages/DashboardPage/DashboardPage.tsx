import React from 'react';
import ManagementMaintenanceWorkspace from '../../components/maintenance/ManagementMaintenanceWorkspace';
import TenantMaintenanceWorkspace from '../../components/maintenance/TenantMaintenanceWorkspace';
import { useAuth } from '../../contexts/AuthContext';
import useDashboardMaintenance from './hooks/useDashboardMaintenance';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const {
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
  } = useDashboardMaintenance(user);

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
      loadError={loadError}
      activeRequestId={activeRequestId}
      pendingDeleteRequest={pendingDeleteRequest}
      operationsError={operationsError}
      operationsErrorRequestId={operationsErrorRequestId}
      statusFilter={statusFilter}
      priorityFilter={priorityFilter}
      canAssign={canAssign}
      assignableUsers={assignableUsers}
      assignmentDrafts={assignmentDrafts}
      onStatusFilterChange={setStatusFilter}
      onPriorityFilterChange={setPriorityFilter}
      onResetFilters={handleResetFilters}
      onStatusUpdate={handleStatusUpdate}
      onPriorityUpdate={handlePriorityUpdate}
      onDeleteCancel={handleDeleteCancel}
      onDeleteConfirm={handleDeleteConfirm}
      onAssignmentDraftChange={handleAssignmentDraftChange}
      onAssignmentUpdate={handleAssignmentUpdate}
      onDeleteRequest={handleDeleteRequest}
    />
  );
};

export default DashboardPage;
