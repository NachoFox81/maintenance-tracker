import { beforeEach, describe, expect, it, vi } from 'vitest';

const verifyMock = vi.fn();
const loggerErrorMock = vi.fn();
const userFindByIdMock = vi.fn();

vi.mock('jsonwebtoken', () => ({
  default: {
    verify: verifyMock,
  },
}));

vi.mock('../models/User', () => ({
  UserModel: {
    findById: userFindByIdMock,
  },
}));

vi.mock('../utils/logger', () => ({
  logger: {
    error: loggerErrorMock,
  },
}));

const createResponse = () => {
  const json = vi.fn();
  const status = vi.fn().mockReturnValue({ json });

  return {
    status,
    json,
  };
};

describe('auth middleware', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.JWT_SECRET = 'test-secret';
  });

  it('authenticate returns 401 when no token is provided', async () => {
    const { authenticate } = await import('./auth');
    const res = createResponse();
    const req = {
      header: vi.fn().mockReturnValue(undefined),
    };
    const next = vi.fn();

    await authenticate(req as never, res as never, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('authenticate attaches req.user and calls next on success', async () => {
    const { authenticate } = await import('./auth');
    const selectMock = vi.fn().mockResolvedValue({
      _id: { toString: () => 'user-1' },
      email: 'admin@example.com',
      role: 'admin',
    });
    userFindByIdMock.mockReturnValue({
      select: selectMock,
    });
    verifyMock.mockReturnValue({ id: 'user-1' });

    const res = createResponse();
    const req: Record<string, unknown> = {
      header: vi.fn().mockReturnValue('Bearer valid-token'),
    };
    const next = vi.fn();

    await authenticate(req as never, res as never, next);

    expect(req.user).toEqual({
      id: 'user-1',
      email: 'admin@example.com',
      role: 'admin',
    });
    expect(next).toHaveBeenCalledTimes(1);
  });

  it('authorize returns 403 for disallowed roles', async () => {
    const { authorize } = await import('./auth');
    const res = createResponse();
    const req = {
      user: {
        id: 'user-1',
        email: 'tenant@example.com',
        role: 'tenant',
      },
    };
    const next = vi.fn();

    authorize('admin', 'manager')(req as never, res as never, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });

  it('authorize calls next for allowed roles', async () => {
    const { authorize } = await import('./auth');
    const res = createResponse();
    const req = {
      user: {
        id: 'user-1',
        email: 'admin@example.com',
        role: 'admin',
      },
    };
    const next = vi.fn();

    authorize('admin', 'manager')(req as never, res as never, next);

    expect(next).toHaveBeenCalledTimes(1);
  });
});
