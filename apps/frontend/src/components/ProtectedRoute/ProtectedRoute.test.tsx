// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import * as matchers from '@testing-library/jest-dom/matchers';
import ProtectedRoute from './ProtectedRoute';

expect.extend(matchers);

const mockUseAuth = vi.fn();

vi.mock('../../contexts/AuthContext', () => ({
  useAuth: () => mockUseAuth(),
}));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe('ProtectedRoute', () => {
  it('redirects unauthenticated users to login', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      loading: false,
    });

    render(
      <MemoryRouter initialEntries={['/private']}>
        <Routes>
          <Route
            path="/private"
            element={
              <ProtectedRoute>
                <div>secret content</div>
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<div>login page</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('login page')).toBeInTheDocument();
  });

  it('renders children when the user is allowed', () => {
    mockUseAuth.mockReturnValue({
      user: { role: 'admin' },
      loading: false,
    });

    render(
      <MemoryRouter>
        <ProtectedRoute requiredRoles={['admin']}>
          <div>secret content</div>
        </ProtectedRoute>
      </MemoryRouter>
    );

    expect(screen.getByText('secret content')).toBeInTheDocument();
  });

  it('shows access denied for disallowed roles', () => {
    mockUseAuth.mockReturnValue({
      user: { role: 'tenant' },
      loading: false,
    });

    render(
      <MemoryRouter>
        <ProtectedRoute requiredRoles={['admin']}>
          <div>secret content</div>
        </ProtectedRoute>
      </MemoryRouter>
    );

    expect(screen.getByText('Access Denied')).toBeInTheDocument();
    expect(screen.queryByText('secret content')).not.toBeInTheDocument();
  });
});
