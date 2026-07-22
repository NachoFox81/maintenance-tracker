import { describe, expect, it } from 'vitest';
import { shouldRedirectToLogin } from './api';

describe('shouldRedirectToLogin', () => {
  it('does not redirect for failed login requests', () => {
    expect(
      shouldRedirectToLogin({
        response: { status: 401 },
        config: { url: '/auth/login' },
      })
    ).toBe(false);
  });

  it('does not redirect for failed registration requests', () => {
    expect(
      shouldRedirectToLogin({
        response: { status: 401 },
        config: { url: '/auth/register' },
      })
    ).toBe(false);
  });

  it('redirects for protected request failures', () => {
    expect(
      shouldRedirectToLogin({
        response: { status: 401 },
        config: { url: '/auth/profile' },
      })
    ).toBe(true);
  });
});
