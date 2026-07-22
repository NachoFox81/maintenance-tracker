export type {
  ApiResponse,
  AuthResponse,
  LoginFormData,
  RegisterFormData,
  User,
  UserRole,
} from '@doorloop/shared';

export type MaintenanceRequestStatus =
  | 'open'
  | 'in-progress'
  | 'completed'
  | 'cancelled';

export type MaintenanceRequestPriority =
  | 'low'
  | 'normal'
  | 'high'
  | 'urgent';

export interface MaintenanceRequestUserSummary {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
}

export interface AssignableUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
}

export interface MaintenanceRequest {
  _id: string;
  title: string;
  description: string;
  priority: MaintenanceRequestPriority;
  status: MaintenanceRequestStatus;
  propertyUnitIdentifier: string;
  createdBy: string | MaintenanceRequestUserSummary;
  assignedTo?: string | MaintenanceRequestUserSummary | null;
  completedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMaintenanceRequestFormData {
  title: string;
  description: string;
  priority: MaintenanceRequestPriority;
  propertyUnitIdentifier: string;
}

export interface MaintenanceRequestFilters {
  status?: MaintenanceRequestStatus;
  priority?: MaintenanceRequestPriority;
}
