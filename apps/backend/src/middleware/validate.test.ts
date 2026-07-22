import { describe, expect, it, vi } from 'vitest';
import { z } from 'zod';
import { validateBody, validateParams, validateQuery } from './validate';

describe('validate middleware', () => {
  it('parses and replaces req.body on success', () => {
    const middleware = validateBody(
      z.object({
        title: z.string().trim(),
      })
    );
    const req = {
      body: {
        title: ' Leaky faucet ',
      },
    };
    const next = vi.fn();

    middleware(req as never, {} as never, next);

    expect(req.body).toEqual({ title: 'Leaky faucet' });
    expect(next).toHaveBeenCalledWith();
  });

  it('passes zod errors to next for invalid body input', () => {
    const middleware = validateBody(
      z.object({
        title: z.string().min(1),
      })
    );
    const next = vi.fn();

    middleware(
      {
        body: {
          title: '',
        },
      } as never,
      {} as never,
      next
    );

    expect(next).toHaveBeenCalledTimes(1);
    expect(next.mock.calls[0][0]).toBeInstanceOf(Error);
  });

  it('parses query and params payloads', () => {
    const queryMiddleware = validateQuery(
      z.object({
        page: z.coerce.number(),
      })
    );
    const paramsMiddleware = validateParams(
      z.object({
        id: z.string().length(3),
      })
    );

    const req = {
      query: { page: '2' },
      params: { id: 'abc' },
    };
    const next = vi.fn();

    queryMiddleware(req as never, {} as never, next);
    paramsMiddleware(req as never, {} as never, next);

    expect(req.query).toEqual({ page: 2 });
    expect(req.params).toEqual({ id: 'abc' });
  });
});
