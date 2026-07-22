import {
  MaintenanceRequestPriority,
  MaintenanceRequestStatus,
  MaintenanceRequestUserSummary,
} from '../../types';

export const statusClasses: Record<MaintenanceRequestStatus, string> = {
  open: 'bg-amber-100 text-amber-800',
  'in-progress': 'bg-sky-100 text-sky-800',
  completed: 'bg-emerald-100 text-emerald-800',
  cancelled: 'bg-gray-200 text-gray-700',
};

export const priorityClasses: Record<MaintenanceRequestPriority, string> = {
  low: 'bg-slate-100 text-slate-700',
  normal: 'bg-indigo-100 text-indigo-700',
  high: 'bg-orange-100 text-orange-700',
  urgent: 'bg-rose-100 text-rose-700',
};

export const statusOptions: MaintenanceRequestStatus[] = [
  'open',
  'in-progress',
  'completed',
  'cancelled',
];

export const priorityOptions: MaintenanceRequestPriority[] = [
  'low',
  'normal',
  'high',
  'urgent',
];

export const formatDate = (value: string | null | undefined) => {
  if (!value) {
    return 'Not completed';
  }

  return new Date(value).toLocaleString();
};

export const shortenId = (value: string | null | undefined) => {
  if (!value) {
    return 'Unassigned';
  }

  return `${value.slice(0, 6)}...${value.slice(-4)}`;
};

export const formatRequestUser = (
  value: string | MaintenanceRequestUserSummary | null | undefined
) => {
  if (!value) {
    return 'Unassigned';
  }

  if (typeof value === 'string') {
    return shortenId(value);
  }

  return `${value.firstName} ${value.lastName}`;
};
