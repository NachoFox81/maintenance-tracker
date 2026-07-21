import {
  getModelForClass,
  modelOptions,
  prop,
  Ref,
} from '@typegoose/typegoose';
import { User } from './User';

export const MAINTENANCE_REQUEST_STATUSES = [
  'open',
  'in-progress',
  'completed',
  'cancelled',
] as const;

export const MAINTENANCE_REQUEST_PRIORITIES = [
  'low',
  'normal',
  'high',
  'urgent',
] as const;

export type MaintenanceRequestStatus =
  (typeof MAINTENANCE_REQUEST_STATUSES)[number];
export type MaintenanceRequestPriority =
  (typeof MAINTENANCE_REQUEST_PRIORITIES)[number];

@modelOptions({
  schemaOptions: {
    timestamps: true,
    collection: 'maintenance_requests',
  },
})
export class MaintenanceRequest {
  @prop({ type: () => String, required: true, trim: true, minlength: 1 })
  public title!: string;

  @prop({ type: () => String, required: true, trim: true, minlength: 1 })
  public description!: string;

  @prop({
    type: () => String,
    required: true,
    enum: MAINTENANCE_REQUEST_PRIORITIES,
    default: 'normal',
  })
  public priority!: MaintenanceRequestPriority;

  @prop({ type: () => String, required: true, trim: true, minlength: 1 })
  public propertyUnitIdentifier!: string;

  @prop({
    type: () => String,
    required: true,
    enum: MAINTENANCE_REQUEST_STATUSES,
    default: 'open',
  })
  public status!: MaintenanceRequestStatus;

  @prop({ ref: () => User, required: true })
  public createdBy!: Ref<User>;

  @prop({ type: () => Date, default: null })
  public completedAt?: Date | null;
}

export const MaintenanceRequestModel =
  getModelForClass(MaintenanceRequest);
