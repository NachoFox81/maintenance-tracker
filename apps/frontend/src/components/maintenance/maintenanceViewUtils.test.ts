import { describe, expect, it } from 'vitest';
import {
  formatDate,
  formatRequestUser,
  shortenId,
} from './maintenanceViewUtils';

describe('maintenanceViewUtils', () => {
  it('returns fallback values for empty inputs', () => {
    expect(formatDate(null)).toBe('Not completed');
    expect(shortenId(undefined)).toBe('Unassigned');
    expect(formatRequestUser(null)).toBe('Unassigned');
  });

  it('formats ids and user names', () => {
    expect(shortenId('1234567890ab')).toBe('123456...90ab');
    expect(formatRequestUser('1234567890ab')).toBe('123456...90ab');
    expect(
      formatRequestUser({
        _id: '1',
        firstName: 'Taylor',
        lastName: 'Brooks',
        email: 'taylor@example.com',
        role: 'manager',
      })
    ).toBe('Taylor Brooks');
  });
});
