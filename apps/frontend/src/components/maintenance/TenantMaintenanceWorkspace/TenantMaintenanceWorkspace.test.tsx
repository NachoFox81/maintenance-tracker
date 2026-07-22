// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';
import TenantMaintenanceWorkspace from './TenantMaintenanceWorkspace';

expect.extend(matchers);

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

const baseProps = {
  firstName: 'Taylor',
  requests: [],
  formValues: {
    title: 'Leaky faucet',
    description: 'Sink keeps dripping.',
    priority: 'normal' as const,
    propertyUnitIdentifier: 'Unit 2B',
  },
  isLoadingRequests: false,
  isSubmitting: false,
  loadError: null,
  submitError: null,
  onChange: vi.fn(),
  onSubmit: vi.fn(),
};

describe('TenantMaintenanceWorkspace', () => {
  it('renders form values and submits the form', () => {
    const onSubmit = vi.fn(event => event.preventDefault());

    render(
      <TenantMaintenanceWorkspace
        {...baseProps}
        onSubmit={onSubmit}
      />
    );

    expect(screen.getByDisplayValue('Leaky faucet')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Unit 2B')).toBeInTheDocument();

    fireEvent.submit(
      screen.getByRole('button', { name: 'Submit maintenance request' })
    );

    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it('shows loading and error states', () => {
    const { rerender } = render(
      <TenantMaintenanceWorkspace {...baseProps} isLoadingRequests />
    );

    expect(
      screen.getByText('Loading your maintenance requests...')
    ).toBeInTheDocument();

    rerender(
      <TenantMaintenanceWorkspace
        {...baseProps}
        isLoadingRequests={false}
        loadError="Request load failed"
      />
    );

    expect(
      screen.getByText('We could not load your requests.')
    ).toBeInTheDocument();
    expect(screen.getByText('Request load failed')).toBeInTheDocument();
  });

  it('renders submitted requests and the submit error', () => {
    render(
      <TenantMaintenanceWorkspace
        {...baseProps}
        submitError="Unable to submit request"
        requests={[
          {
            _id: 'request-1',
            title: 'Broken heater',
            description: 'No heat in the bedroom.',
            priority: 'urgent',
            status: 'open',
            propertyUnitIdentifier: 'Unit 9A',
            createdBy: 'tenant-1',
            assignedTo: null,
            completedAt: null,
            createdAt: '2026-07-22T10:00:00.000Z',
            updatedAt: '2026-07-22T10:00:00.000Z',
          },
        ]}
      />
    );

    expect(screen.getByText('Unable to submit request')).toBeInTheDocument();
    expect(screen.getByText('Broken heater')).toBeInTheDocument();
    expect(screen.getByText('Unit 9A')).toBeInTheDocument();
    expect(screen.getByText('Not completed')).toBeInTheDocument();
  });
});
