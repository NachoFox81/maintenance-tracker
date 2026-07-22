import React from 'react';
import {
  ClipboardList,
  Filter,
  Loader2,
  RefreshCw,
  ShieldCheck,
  Trash2,
} from 'lucide-react';
import MaintenanceRequestDeleteModal from '../MaintenanceRequestDeleteModal/MaintenanceRequestDeleteModal';
import {
  AssignableUser,
  MaintenanceRequest,
  MaintenanceRequestPriority,
  MaintenanceRequestStatus,
  UserRole,
} from '../../../types';
import {
  formatDate,
  formatRequestUser,
  priorityClasses,
  priorityOptions,
  statusClasses,
  statusOptions,
} from '../maintenanceViewUtils';

interface ManagementMaintenanceWorkspaceProps {
  role?: UserRole;
  requests: MaintenanceRequest[];
  isLoadingRequests: boolean;
  isRefreshing: boolean;
  activeRequestId: string | null;
  pendingDeleteRequest: MaintenanceRequest | null;
  operationsError: string | null;
  operationsErrorRequestId: string | null;
  statusFilter: string;
  priorityFilter: string;
  canAssign: boolean;
  assignableUsers: AssignableUser[];
  assignmentDrafts: Record<string, string>;
  onStatusFilterChange: (value: string) => void;
  onPriorityFilterChange: (value: string) => void;
  onResetFilters: () => void;
  onStatusUpdate: (
    requestId: string,
    status: MaintenanceRequestStatus
  ) => Promise<void>;
  onPriorityUpdate: (
    requestId: string,
    priority: MaintenanceRequestPriority
  ) => Promise<void>;
  onAssignmentDraftChange: (requestId: string, value: string) => void;
  onAssignmentUpdate: (requestId: string) => Promise<void>;
  onDeleteCancel: () => void;
  onDeleteConfirm: () => Promise<void>;
  onDeleteRequest: (requestId: string) => Promise<void>;
}

const ManagementMaintenanceWorkspace: React.FC<
  ManagementMaintenanceWorkspaceProps
> = ({
  role,
  requests,
  isLoadingRequests,
  isRefreshing,
  activeRequestId,
  pendingDeleteRequest,
  operationsError,
  operationsErrorRequestId,
  statusFilter,
  priorityFilter,
  canAssign,
  assignableUsers,
  assignmentDrafts,
  onStatusFilterChange,
  onPriorityFilterChange,
  onResetFilters,
  onStatusUpdate,
  onPriorityUpdate,
  onAssignmentDraftChange,
  onAssignmentUpdate,
  onDeleteCancel,
  onDeleteConfirm,
  onDeleteRequest,
}) => {
  const isDeletingPendingRequest =
    pendingDeleteRequest?._id !== undefined &&
    activeRequestId === pendingDeleteRequest._id;

  return (
    <>
      <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">
            Operations Workspace
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-gray-900">
            Maintenance queue for {role}
          </h1>
          <p className="mt-2 max-w-3xl text-sm text-gray-600">
            Triage the full request queue, apply live filters, and update
            workflow details without leaving the dashboard.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl bg-gray-900 px-5 py-4 text-white shadow-lg">
            <p className="text-xs uppercase tracking-[0.2em] text-gray-300">
              Total Requests
            </p>
            <p className="mt-2 text-3xl font-semibold">{requests.length}</p>
          </div>
          <div className="rounded-2xl bg-white px-5 py-4 shadow-lg ring-1 ring-gray-200">
            <p className="text-xs uppercase tracking-[0.2em] text-gray-500">
              Open
            </p>
            <p className="mt-2 text-3xl font-semibold text-gray-900">
              {requests.filter(request => request.status === 'open').length}
            </p>
          </div>
          <div className="rounded-2xl bg-white px-5 py-4 shadow-lg ring-1 ring-gray-200">
            <p className="text-xs uppercase tracking-[0.2em] text-gray-500">
              Urgent
            </p>
            <p className="mt-2 text-3xl font-semibold text-gray-900">
              {requests.filter(request => request.priority === 'urgent').length}
            </p>
          </div>
        </div>
      </div>

      <section className="card overflow-hidden shadow-md">
        <div className="card-header border-b border-gray-100 bg-white">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-sky-100 p-2 text-sky-700">
                <Filter className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Queue filters
                </h2>
                <p className="text-sm text-gray-600">
                  Narrow the request queue by lifecycle stage or urgency.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onResetFilters}
              className="btn-outline btn-md"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Reset filters
            </button>
          </div>
        </div>

        <div className="card-content grid gap-4 pt-6 md:grid-cols-2 xl:grid-cols-[220px_220px_1fr]">
          <div>
            <label
              className="mb-2 block text-sm font-medium text-gray-700"
              htmlFor="statusFilter"
            >
              Status
            </label>
            <select
              id="statusFilter"
              value={statusFilter}
              onChange={event => onStatusFilterChange(event.target.value)}
              className="input"
            >
              <option value="all">All statuses</option>
              {statusOptions.map(option => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              className="mb-2 block text-sm font-medium text-gray-700"
              htmlFor="priorityFilter"
            >
              Priority
            </label>
            <select
              id="priorityFilter"
              value={priorityFilter}
              onChange={event => onPriorityFilterChange(event.target.value)}
              className="input"
            >
              <option value="all">All priorities</option>
              {priorityOptions.map(option => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <div className="rounded-2xl bg-sky-50 px-4 py-3 text-sm text-sky-900">
              {isRefreshing ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Updating queue...
                </span>
              ) : (
                `${requests.length} request${requests.length === 1 ? '' : 's'} in the current view`
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="card overflow-hidden shadow-md">
        <div className="card-header border-b border-gray-100 bg-white">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-gray-100 p-2 text-gray-700">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Active maintenance queue
              </h2>
              <p className="text-sm text-gray-600">
                Update lifecycle and urgency in-place. Admins can route work to
                managers and other admins directly from this queue.
              </p>
            </div>
          </div>
        </div>

        <div className="card-content pt-6">
          {isLoadingRequests ? (
            <div className="flex min-h-[280px] items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50">
              <div className="flex items-center gap-3 text-sm text-gray-500">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading maintenance queue...
              </div>
            </div>
          ) : requests.length === 0 ? (
            <div className="flex min-h-[280px] flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-6 text-center">
              <ClipboardList className="h-10 w-10 text-gray-400" />
              <p className="mt-4 text-sm font-medium text-gray-900">
                No requests match the current filters
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Try loosening the filter combination to see the full queue again.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {requests.map(request => {
                const isRowUpdating = activeRequestId === request._id;
                const requestError =
                  operationsErrorRequestId === request._id
                    ? operationsError
                    : null;

                return (
                  <article
                    key={request._id}
                    className="rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-5"
                  >
                    {requestError ? (
                      <div className="mb-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                        {requestError}
                      </div>
                    ) : null}

                    <div className="flex flex-col gap-5 xl:flex-row xl:justify-between">
                      <div className="space-y-3 xl:max-w-2xl">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {request.title}
                          </h3>
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${statusClasses[request.status]}`}
                          >
                            {request.status}
                          </span>
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${priorityClasses[request.priority]}`}
                          >
                            {request.priority}
                          </span>
                        </div>

                        <p className="text-sm text-gray-600">
                          {request.description}
                        </p>

                        <div className="grid gap-3 text-sm text-gray-600 sm:grid-cols-2 xl:grid-cols-4">
                          <div>
                            <p className="font-medium text-gray-800">
                              Property / Unit
                            </p>
                            <p>{request.propertyUnitIdentifier}</p>
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">
                              Created By
                            </p>
                            <p>{formatRequestUser(request.createdBy)}</p>
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">
                              Assigned To
                            </p>
                            <p>{formatRequestUser(request.assignedTo)}</p>
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">
                              Completed
                            </p>
                            <p>{formatDate(request.completedAt)}</p>
                          </div>
                        </div>
                      </div>

                      <div className="grid gap-4 xl:w-[340px]">
                        <div className="rounded-2xl border border-gray-200 bg-white p-4">
                          <label
                            className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-gray-500"
                            htmlFor={`status-${request._id}`}
                          >
                            Update status
                          </label>
                          <select
                            id={`status-${request._id}`}
                            value={request.status}
                            disabled={isRowUpdating}
                            onChange={event =>
                              void onStatusUpdate(
                                request._id,
                                event.target.value as MaintenanceRequestStatus
                              )
                            }
                            className="input"
                          >
                            {statusOptions.map(option => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="rounded-2xl border border-gray-200 bg-white p-4">
                          <label
                            className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-gray-500"
                            htmlFor={`priority-${request._id}`}
                          >
                            Update priority
                          </label>
                          <select
                            id={`priority-${request._id}`}
                            value={request.priority}
                            disabled={isRowUpdating}
                            onChange={event =>
                              void onPriorityUpdate(
                                request._id,
                                event.target.value as MaintenanceRequestPriority
                              )
                            }
                            className="input"
                          >
                            {priorityOptions.map(option => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                        </div>

                        {canAssign ? (
                          <div className="rounded-2xl border border-gray-200 bg-white p-4">
                            <label
                              className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-gray-500"
                              htmlFor={`assign-${request._id}`}
                            >
                              Assign request
                            </label>
                            <select
                              id={`assign-${request._id}`}
                              value={
                                assignmentDrafts[request._id] ??
                                (typeof request.assignedTo === 'string'
                                  ? request.assignedTo
                                  : request.assignedTo?._id) ??
                                ''
                              }
                              onChange={event =>
                                onAssignmentDraftChange(
                                  request._id,
                                  event.target.value
                                )
                              }
                              className="input"
                            >
                              <option value="">Select assignee</option>
                              {assignableUsers.map(user => (
                                <option key={user._id} value={user._id}>
                                  {user.firstName} {user.lastName} ({user.role})
                                </option>
                              ))}
                            </select>
                            <button
                              type="button"
                              disabled={isRowUpdating}
                              onClick={() => void onAssignmentUpdate(request._id)}
                              className="btn-secondary btn-md mt-3 w-full"
                            >
                              {isRowUpdating ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Assigning...
                                </>
                              ) : (
                                'Assign request'
                              )}
                            </button>
                          </div>
                        ) : null}

                        <button
                          type="button"
                          onClick={() => void onDeleteRequest(request._id)}
                          disabled={isRowUpdating}
                          className="inline-flex items-center justify-center rounded-2xl bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-300"
                        >
                          {isRowUpdating ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="mr-2 h-4 w-4" />
                          )}
                          Delete request
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>
      </div>

      {pendingDeleteRequest ? (
        <MaintenanceRequestDeleteModal
          request={pendingDeleteRequest}
          isDeleting={isDeletingPendingRequest}
          onCancel={onDeleteCancel}
          onConfirm={onDeleteConfirm}
        />
      ) : null}
    </>
  );
};

export default ManagementMaintenanceWorkspace;
