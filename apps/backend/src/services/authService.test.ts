import { beforeEach, describe, expect, it, vi } from 'vitest';

const signMock = vi.fn();
const verifyMock = vi.fn();
const loggerInfoMock = vi.fn();

class MockJsonWebTokenError extends Error {}
class MockTokenExpiredError extends Error {}

const findOneMock = vi.fn();
const findByIdMock = vi.fn();
const saveMock = vi.fn();
const toJSONMock = vi.fn();

const UserModelMock = vi.fn().mockImplementation((data: Record<string, unknown>) => ({
  ...data,
  _id: {
    toString: () => 'user-1',
  },
  save: saveMock,
  toJSON: toJSONMock,
}));

UserModelMock.findOne = findOneMock;
UserModelMock.findById = findByIdMock;

vi.mock('jsonwebtoken', () => ({
  default: {
    sign: signMock,
    verify: verifyMock,
    JsonWebTokenError: MockJsonWebTokenError,
    TokenExpiredError: MockTokenExpiredError,
  },
  JsonWebTokenError: MockJsonWebTokenError,
  TokenExpiredError: MockTokenExpiredError,
}));

vi.mock('../models/User', () => ({
  UserModel: UserModelMock,
}));

vi.mock('../utils/logger', () => ({
  logger: {
    info: loggerInfoMock,
  },
}));

describe('AuthService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.JWT_SECRET = 'test-secret';
    process.env.JWT_EXPIRES_IN = '7d';
    toJSONMock.mockReturnValue({
      _id: 'user-1',
      email: 'user@example.com',
      role: 'tenant',
    });
  });

  it('rejects duplicate registrations', async () => {
    const { AuthService } = await import('./authService');
    const service = new AuthService();

    findOneMock.mockResolvedValue({ _id: 'existing-user' });

    await expect(
      service.register({
        email: 'USER@example.com',
        password: 'secret123',
        firstName: 'Taylor',
        lastName: 'Brooks',
        role: 'tenant',
      })
    ).rejects.toMatchObject({
      message: 'User already exists with this email',
      statusCode: 400,
    });

    expect(findOneMock).toHaveBeenCalledWith({ email: 'user@example.com' });
  });

  it('registers with normalized email and returns a token', async () => {
    const { AuthService } = await import('./authService');
    const service = new AuthService();

    findOneMock.mockResolvedValue(null);
    signMock.mockReturnValue('signed-token');

    const result = await service.register({
      email: 'USER@example.com',
      password: 'secret123',
      firstName: 'Taylor',
      lastName: 'Brooks',
      role: 'tenant',
    });

    expect(UserModelMock).toHaveBeenCalledWith({
      email: 'user@example.com',
      password: 'secret123',
      firstName: 'Taylor',
      lastName: 'Brooks',
      role: 'tenant',
    });
    expect(saveMock).toHaveBeenCalledTimes(1);
    expect(signMock).toHaveBeenCalledTimes(1);
    expect(result).toEqual({
      user: {
        _id: 'user-1',
        email: 'user@example.com',
        role: 'tenant',
      },
      token: 'signed-token',
    });
  });

  it('rejects login for invalid passwords', async () => {
    const { AuthService } = await import('./authService');
    const service = new AuthService();

    const selectMock = vi.fn().mockResolvedValue({
      comparePassword: vi.fn().mockResolvedValue(false),
    });
    findOneMock.mockReturnValue({
      select: selectMock,
    });

    await expect(
      service.login({
        email: 'USER@example.com',
        password: 'wrong-password',
      })
    ).rejects.toMatchObject({
      message: 'Incorrect password',
      statusCode: 401,
    });

    expect(findOneMock).toHaveBeenCalledWith({ email: 'user@example.com' });
  });

  it('returns a specific error when the email does not exist', async () => {
    const { AuthService } = await import('./authService');
    const service = new AuthService();

    findOneMock.mockReturnValue({
      select: vi.fn().mockResolvedValue(null),
    });

    await expect(
      service.login({
        email: 'missing@example.com',
        password: 'secret123',
      })
    ).rejects.toMatchObject({
      message: 'No account found for that email address',
      statusCode: 404,
    });
  });

  it('returns the user for a valid verified token', async () => {
    const { AuthService } = await import('./authService');
    const service = new AuthService();

    verifyMock.mockReturnValue({ id: 'user-1' });
    findByIdMock.mockResolvedValue({
      toJSON: vi.fn().mockReturnValue({ _id: 'user-1', email: 'user@example.com' }),
    });

    await expect(service.verifyToken('valid-token')).resolves.toEqual({
      _id: 'user-1',
      email: 'user@example.com',
    });
  });

  it('maps invalid jwt errors to unauthorized', async () => {
    const { AuthService } = await import('./authService');
    const service = new AuthService();

    verifyMock.mockImplementation(() => {
      throw new MockJsonWebTokenError('bad token');
    });

    await expect(service.verifyToken('bad-token')).rejects.toMatchObject({
      message: 'Invalid token',
      statusCode: 401,
    });
  });
});
