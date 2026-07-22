import { describe, expect, it } from 'vitest';
import {
  assignMaintenanceRequestSchema,
  createMaintenanceRequestSchema,
  maintenanceRequestFilterQuerySchema,
  registerSchema,
} from './validation';

describe('validation schemas', () => {
  it('applies defaults and trims maintenance request input', () => {
    const result = createMaintenanceRequestSchema.parse({
      title: ' Leaky faucet ',
      description: ' Water under sink ',
      propertyUnitIdentifier: ' Unit 2B ',
    });

    expect(result).toEqual({
      title: 'Leaky faucet',
      description: 'Water under sink',
      priority: 'normal',
      propertyUnitIdentifier: 'Unit 2B',
    });
  });

  it('validates register input and defaults role', () => {
    const result = registerSchema.parse({
      email: 'user@example.com',
      password: 'secret123',
      firstName: ' Taylor ',
      lastName: ' Brooks ',
    });

    expect(result.role).toBe('tenant');
    expect(result.firstName).toBe('Taylor');
    expect(result.lastName).toBe('Brooks');
  });

  it('rejects invalid maintenance assignment ids', () => {
    const parsed = assignMaintenanceRequestSchema.safeParse({
      assignedTo: 'not-an-object-id',
    });

    expect(parsed.success).toBe(false);
  });

  it('accepts valid filter queries only', () => {
    expect(
      maintenanceRequestFilterQuerySchema.safeParse({
        status: 'open',
        priority: 'urgent',
      }).success
    ).toBe(true);

    expect(
      maintenanceRequestFilterQuerySchema.safeParse({
        status: 'not-real',
      }).success
    ).toBe(false);
  });
});
