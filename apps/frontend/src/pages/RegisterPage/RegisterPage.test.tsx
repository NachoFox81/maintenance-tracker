// @vitest-environment jsdom
import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';
import { MemoryRouter } from 'react-router-dom';
import RegisterPage from './RegisterPage';

expect.extend(matchers);

const mockUseAuth = vi.fn();
const mockNavigate = vi.fn();

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
  };
});

beforeEach(() => {
  vi.spyOn(window, 'requestAnimationFrame').mockImplementation(callback => {
    callback(0);
    return 1;
  });
  vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {});
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.clearAllMocks();
});

describe('RegisterPage', () => {
  it('shows validation errors for empty submit', async () => {
    mockUseAuth.mockReturnValue({
      register: vi.fn(),
      loading: false,
    });

    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Create account' }));

    expect(await screen.findByText('First name is required')).toBeInTheDocument();
    expect(await screen.findByText('Last name is required')).toBeInTheDocument();
    expect(await screen.findByText('Invalid email address')).toBeInTheDocument();
    expect(
      await screen.findByText('Password must be at least 6 characters')
    ).toBeInTheDocument();
  });

  it('submits the form with the selected role', async () => {
    const register = vi.fn().mockResolvedValue(undefined);
    mockUseAuth.mockReturnValue({
      register,
      loading: false,
    });

    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText('First name'), {
      target: { value: 'Taylor' },
    });
    fireEvent.change(screen.getByPlaceholderText('Last name'), {
      target: { value: 'Brooks' },
    });
    fireEvent.change(screen.getByPlaceholderText('Email address'), {
      target: { value: 'taylor@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'secret123' },
    });
    fireEvent.change(screen.getByRole('combobox'), {
      target: { value: 'manager' },
    });

    fireEvent.click(screen.getByRole('button', { name: 'Create account' }));

    await waitFor(() =>
      expect(register).toHaveBeenCalledWith({
        firstName: 'Taylor',
        lastName: 'Brooks',
        email: 'taylor@example.com',
        password: 'secret123',
        role: 'manager',
      })
    );
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
});
