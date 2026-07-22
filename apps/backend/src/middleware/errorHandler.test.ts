import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { z } from 'zod';

const loggerErrorMock = vi.fn();

vi.mock('../utils/logger', () => ({
  logger: {
    error: loggerErrorMock,
  },
}));

describe('errorHandler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    delete process.env.NODE_ENV;
  });

  it('formats zod validation errors as 400 responses', async () => {
    const { errorHandler } = await import('./errorHandler');
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
    const parsed = z.object({ email: z.string().email() }).safeParse({
      email: 'bad-email',
    });

    errorHandler(
      parsed.success ? new Error('expected failure') : parsed.error,
      { url: '/auth/register', method: 'POST' } as never,
      res as never,
      vi.fn()
    );

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: 'Validation Error',
        errors: [
          {
            field: 'email',
            message: 'Invalid email',
          },
        ],
      })
    );
  });

  it('uses custom app error status and message', async () => {
    const { createError, errorHandler } = await import('./errorHandler');
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    errorHandler(
      createError('Forbidden action', 403),
      { url: '/maintenance', method: 'PATCH' } as never,
      res as never,
      vi.fn()
    );

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: 'Forbidden action',
      })
    );
  });

  it('includes stack traces in development mode only', async () => {
    const { errorHandler } = await import('./errorHandler');
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
    const error = new Error('Boom');
    error.stack = 'stack-trace';
    process.env.NODE_ENV = 'development';

    errorHandler(
      error,
      { url: '/boom', method: 'GET' } as never,
      res as never,
      vi.fn()
    );

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: 'Internal Server Error',
        stack: 'stack-trace',
      })
    );
  });
});
