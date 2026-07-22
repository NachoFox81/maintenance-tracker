// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';
import ManagementMaintenanceWorkspace from './ManagementMaintenanceWorkspace';

expect.extend(matchers);

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

const request = {
  _id: 'request-1',
  title: 'Leaky faucet',
  description: 'Water is dripping.',
  priority: 'urgent' as const,
  status: 'open' as const,
  propertyUnitIdentifier: 'Unit 2B',
  createdBy: {
    _id: 'tenant-1',
    firstName: 'Taylor',
    lastName: 'Brooks',
    email: 'taylor@example.com',
    role: 'tenant' as const,
  },
  assignedTo: null,
  completedAt: null,
  createdAt: '2026-07-22T10:00:00.000Z',
  updatedAt: '2026-07-22T10:00:00.000Z',
};

const baseProps = {
  role: 'admin' as const,
  requests: [request],
  isLoadingRequests: false,
  isRefreshing: false,
  activeRequestId: null,
  pendingDeleteRequest: null,
  operationsError: null,
  operationsErrorRequestId: null,
  statusFilter: 'all',
  priorityFilter: 'all',
  canAssign: true,
  assignableUsers: [
    {
      _id: 'manager-1',
      firstName: 'Jordan',
      lastName: 'Lee',
      email: 'jordan@example.com',
      role: 'manager' as const,
    },
  ],
  assignmentDrafts: {},
  onStatusFilterChange: vi.fn(),
  onPriorityFilterChange: vi.fn(),
  onResetFilters: vi.fn(),
  onStatusUpdate: vi.fn().mockResolvedValue(undefined),
  onPriorityUpdate: vi.fn().mockResolvedValue(undefined),
  onAssignmentDraftChange: vi.fn(),
  onAssignmentUpdate: vi.fn().mockResolvedValue(undefined),
  onDeleteCancel: vi.fn(),
  onDeleteConfirm: vi.fn().mockResolvedValue(undefined),
  onDeleteRequest: vi.fn().mockResolvedValue(undefined),
};

describe('ManagementMaintenanceWorkspace', () => {
  it('renders queue stats and calls filter handlers', () => {
    render(<ManagementMaintenanceWorkspace {...baseProps} />);

    expect(screen.getByText('Total Requests')).toBeInTheDocument();
    expect(screen.getByText('1 request in the current view')).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText('Status'), {
      target: { value: 'completed' },
    });
    fireEvent.change(screen.getByLabelText('Priority'), {
      target: { value: 'high' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Reset filters/i }));

    expect(baseProps.onStatusFilterChange).toHaveBeenCalledWith('completed');
    expect(baseProps.onPriorityFilterChange).toHaveBeenCalledWith('high');
    expect(baseProps.onResetFilters).toHaveBeenCalledTimes(1);
  });

  it('renders row-level errors and hides assignment UI when disabled', () => {
    render(
      <ManagementMaintenanceWorkspace
        {...baseProps}
        canAssign={false}
        operationsError="Unable to update request"
        operationsErrorRequestId="request-1"
      />
    );

    expect(screen.getByText('Unable to update request')).toBeInTheDocument();
    expect(screen.queryByText('Assign request')).not.toBeInTheDocument();
  });

  it('shows the delete modal and triggers delete action', () => {
    render(
      <ManagementMaintenanceWorkspace
        {...baseProps}
        pendingDeleteRequest={request}
      />
    );

    expect(
      screen.getByText('Delete this maintenance request?')
    ).toBeInTheDocument();

    fireEvent.click(screen.getAllByRole('button', { name: /Delete request/i })[0]);

    expect(baseProps.onDeleteRequest).toHaveBeenCalledWith('request-1');
  });
});
