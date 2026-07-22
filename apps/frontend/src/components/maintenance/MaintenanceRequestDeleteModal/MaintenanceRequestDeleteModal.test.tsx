// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';
import MaintenanceRequestDeleteModal from './MaintenanceRequestDeleteModal';

expect.extend(matchers);

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

const request = {
  _id: 'request-1',
  title: 'Leaky faucet',
  description: 'Water is dripping under the sink.',
  priority: 'high' as const,
  status: 'open' as const,
  propertyUnitIdentifier: 'Unit 2B',
  createdBy: 'tenant-1',
  assignedTo: null,
  completedAt: null,
  createdAt: '2026-07-22T10:00:00.000Z',
  updatedAt: '2026-07-22T10:00:00.000Z',
};

describe('MaintenanceRequestDeleteModal', () => {
  it('renders request details and triggers actions', () => {
    const onCancel = vi.fn();
    const onConfirm = vi.fn().mockResolvedValue(undefined);

    render(
      <MaintenanceRequestDeleteModal
        request={request}
        isDeleting={false}
        onCancel={onCancel}
        onConfirm={onConfirm}
      />
    );

    expect(screen.getByText('Leaky faucet')).toBeInTheDocument();
    expect(screen.getByText('Unit 2B')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Keep request' }));
    fireEvent.click(
      screen.getByRole('button', { name: /Delete permanently/i })
    );

    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('disables actions while deleting', () => {
    render(
      <MaintenanceRequestDeleteModal
        request={request}
        isDeleting
        onCancel={vi.fn()}
        onConfirm={vi.fn().mockResolvedValue(undefined)}
      />
    );

    expect(screen.getByRole('button', { name: 'Keep request' })).toBeDisabled();
    expect(
      screen.getByRole('button', { name: /Delete permanently/i })
    ).toBeDisabled();
  });
});
