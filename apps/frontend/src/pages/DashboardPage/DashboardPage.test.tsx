// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';
import DashboardPage from './DashboardPage';

expect.extend(matchers);

const mockUseAuth = vi.fn();
const mockUseDashboardMaintenance = vi.fn();

vi.mock('../../contexts/AuthContext', () => ({
  useAuth: () => mockUseAuth(),
}));

vi.mock('./hooks/useDashboardMaintenance', () => ({
  default: (user: unknown) => mockUseDashboardMaintenance(user),
}));

vi.mock('../../components/maintenance/TenantMaintenanceWorkspace', () => ({
  default: (props: { firstName?: string }) => (
    <div>tenant workspace {props.firstName}</div>
  ),
}));

vi.mock('../../components/maintenance/ManagementMaintenanceWorkspace', () => ({
  default: (props: { role?: string }) => (
    <div>management workspace {props.role}</div>
  ),
}));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe('DashboardPage', () => {
  it('renders the tenant workspace for tenant users', () => {
    mockUseAuth.mockReturnValue({
      user: { firstName: 'Taylor', role: 'tenant' },
    });
    mockUseDashboardMaintenance.mockReturnValue({
      requests: [],
      formValues: {
        title: '',
        description: '',
        priority: 'normal',
        propertyUnitIdentifier: '',
      },
      isLoadingRequests: false,
      isSubmitting: false,
      isRefreshing: false,
      activeRequestId: null,
      loadError: null,
      submitError: null,
      operationsError: null,
      operationsErrorRequestId: null,
      statusFilter: 'all',
      priorityFilter: 'all',
      canAssign: false,
      assignableUsers: [],
      assignmentDrafts: {},
      isTenant: true,
      pendingDeleteRequest: null,
      handleChange: vi.fn(),
      handleSubmit: vi.fn(),
      handleStatusUpdate: vi.fn(),
      handlePriorityUpdate: vi.fn(),
      handleAssignmentDraftChange: vi.fn(),
      handleAssignmentUpdate: vi.fn(),
      handleDeleteRequest: vi.fn(),
      handleDeleteCancel: vi.fn(),
      handleDeleteConfirm: vi.fn(),
      handleResetFilters: vi.fn(),
      setStatusFilter: vi.fn(),
      setPriorityFilter: vi.fn(),
    });

    render(<DashboardPage />);

    expect(screen.getByText('tenant workspace Taylor')).toBeInTheDocument();
  });

  it('renders the management workspace for admin users', () => {
    mockUseAuth.mockReturnValue({
      user: { role: 'admin' },
    });
    mockUseDashboardMaintenance.mockReturnValue({
      requests: [],
      formValues: {
        title: '',
        description: '',
        priority: 'normal',
        propertyUnitIdentifier: '',
      },
      isLoadingRequests: false,
      isSubmitting: false,
      isRefreshing: false,
      activeRequestId: null,
      loadError: null,
      submitError: null,
      operationsError: null,
      operationsErrorRequestId: null,
      statusFilter: 'all',
      priorityFilter: 'all',
      canAssign: true,
      assignableUsers: [],
      assignmentDrafts: {},
      isTenant: false,
      pendingDeleteRequest: null,
      handleChange: vi.fn(),
      handleSubmit: vi.fn(),
      handleStatusUpdate: vi.fn(),
      handlePriorityUpdate: vi.fn(),
      handleAssignmentDraftChange: vi.fn(),
      handleAssignmentUpdate: vi.fn(),
      handleDeleteRequest: vi.fn(),
      handleDeleteCancel: vi.fn(),
      handleDeleteConfirm: vi.fn(),
      handleResetFilters: vi.fn(),
      setStatusFilter: vi.fn(),
      setPriorityFilter: vi.fn(),
    });

    render(<DashboardPage />);

    expect(screen.getByText('management workspace admin')).toBeInTheDocument();
  });
});
