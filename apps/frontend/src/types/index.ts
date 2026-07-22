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

export interface MaintenanceRequest {
  _id: string;
  title: string;
  description: string;
  priority: MaintenanceRequestPriority;
  status: MaintenanceRequestStatus;
  propertyUnitIdentifier: string;
  createdBy: string;
  assignedTo?: string | null;
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
