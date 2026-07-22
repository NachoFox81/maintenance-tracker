import {
  AssignableUser,
  MaintenanceRequest,
  MaintenanceRequestPriority,
  MaintenanceRequestStatus,
  UserRole,
} from '../../../types';

export interface ManagementMaintenanceWorkspaceProps {
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
