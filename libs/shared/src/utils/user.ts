import type { User } from '../types/auth';
import { USER_ROLES } from '../constants/auth';

export const normalizeEmail = (email: string): string =>
  email.trim().toLowerCase();

export const getFullName = (
  user: Pick<User, 'firstName' | 'lastName'>
): string => `${user.firstName} ${user.lastName}`.trim();

export const isUserRole = (value: string): value is (typeof USER_ROLES)[number] =>
  USER_ROLES.includes(value as (typeof USER_ROLES)[number]);
