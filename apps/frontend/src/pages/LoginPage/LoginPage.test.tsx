// @vitest-environment jsdom
import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';
import { MemoryRouter } from 'react-router-dom';
import LoginPage from './LoginPage';

expect.extend(matchers);

const mockUseAuth = vi.fn();
const mockNavigate = vi.fn();
const mockUseLocation = vi.fn();

vi.mock('../../contexts/AuthContext', () => ({
  useAuth: () => mockUseAuth(),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>(
    'react-router-dom'
  );

  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => mockUseLocation(),
  };
});

beforeEach(() => {
  vi.spyOn(window, 'requestAnimationFrame').mockImplementation(callback => {
    callback(0);
    return 1;
  });
  vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {});
  mockUseLocation.mockReturnValue({ state: null });
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.clearAllMocks();
});

describe('LoginPage', () => {
  it('shows validation errors for empty submit', async () => {
    mockUseAuth.mockReturnValue({
      user: null,
      login: vi.fn(),
      loading: false,
    });

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Sign in' }));

    expect(await screen.findByText('Invalid email address')).toBeInTheDocument();
    expect(await screen.findByText('Password is required')).toBeInTheDocument();
  });

  it('submits credentials and toggles password visibility', async () => {
    const login = vi.fn().mockResolvedValue(undefined);
    mockUseAuth.mockReturnValue({
      user: null,
      login,
      loading: false,
    });

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    const emailInput = screen.getByPlaceholderText('Email address');
    const passwordInput = screen.getByPlaceholderText('Password');

    fireEvent.change(emailInput, { target: { value: 'admin@doorloop.com' } });
    fireEvent.change(passwordInput, { target: { value: 'secret123' } });

    expect(passwordInput).toHaveAttribute('type', 'password');
    fireEvent.click(screen.getByRole('button', { name: '' }));
    expect(passwordInput).toHaveAttribute('type', 'text');

    fireEvent.click(screen.getByRole('button', { name: 'Sign in' }));

    await waitFor(() =>
      expect(login).toHaveBeenCalledWith({
        email: 'admin@doorloop.com',
        password: 'secret123',
      })
    );
  });

  it('redirects when the user is already signed in', async () => {
    mockUseLocation.mockReturnValue({
      state: { from: { pathname: '/analytics' } },
    });
    mockUseAuth.mockReturnValue({
      user: { role: 'admin' },
      login: vi.fn(),
      loading: false,
    });

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    await waitFor(() =>
      expect(mockNavigate).toHaveBeenCalledWith('/analytics', {
        replace: true,
      })
    );
  });
});
