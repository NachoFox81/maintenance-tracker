import type React from 'react';
import {
  CreateMaintenanceRequestFormData,
  MaintenanceRequest,
} from '../../../types';

export interface TenantMaintenanceWorkspaceProps {
  firstName?: string;
  requests: MaintenanceRequest[];
  formValues: CreateMaintenanceRequestFormData;
  isLoadingRequests: boolean;
  isSubmitting: boolean;
  loadError: string | null;
  submitError: string | null;
  onChange: (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => Promise<void>;
}
