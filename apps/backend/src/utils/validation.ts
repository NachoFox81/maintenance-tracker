import { DEFAULT_USER_ROLE, USER_ROLES } from '@doorloop/shared';
import { z } from 'zod';
import { MAINTENANCE_REQUEST_PRIORITIES } from '../models/MaintenanceRequest';

// Auth validation schemas
export const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  firstName: z.string().min(1, 'First name is required').trim(),
  lastName: z.string().min(1, 'Last name is required').trim(),
  role: z.enum(USER_ROLES).default(DEFAULT_USER_ROLE),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

export const createMaintenanceRequestSchema = z.object({
  title: z.string().min(1, 'Title is required').trim(),
  description: z.string().min(1, 'Description is required').trim(),
  priority: z
    .enum(MAINTENANCE_REQUEST_PRIORITIES)
    .default('normal'),
  propertyUnitIdentifier: z
    .string()
    .min(1, 'Property/unit identifier is required')
    .trim(),
});

export const assignMaintenanceRequestSchema = z.object({
  assignedTo: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, 'Assigned user must be a valid id'),
});

export const maintenanceRequestParamsSchema = z.object({
  id: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, 'Maintenance request id must be a valid id'),
});

// Query validation schemas
export const paginationSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  sort: z.string().default('createdAt'),
  order: z.enum(['asc', 'desc']).default('desc'),
});

// Type exports
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CreateMaintenanceRequestInput = z.infer<
  typeof createMaintenanceRequestSchema
>;
export type AssignMaintenanceRequestInput = z.infer<
  typeof assignMaintenanceRequestSchema
>;
export type PaginationQuery = z.infer<typeof paginationSchema>;
