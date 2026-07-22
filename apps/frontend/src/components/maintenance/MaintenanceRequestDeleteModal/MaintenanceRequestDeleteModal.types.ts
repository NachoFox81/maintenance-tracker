import { MaintenanceRequest } from '../../../types';

export interface MaintenanceRequestDeleteModalProps {
  request: MaintenanceRequest;
  isDeleting: boolean;
  onCancel: () => void;
  onConfirm: () => Promise<void>;
}
