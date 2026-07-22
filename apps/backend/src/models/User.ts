import {
  prop,
  getModelForClass,
  pre,
  DocumentType,
} from '@typegoose/typegoose';
import { DEFAULT_USER_ROLE, UserRole, USER_ROLES } from '@doorloop/shared';
import bcrypt from 'bcryptjs';

interface UserJsonShape {
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isEmailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  fullName?: string;
  password?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
}

@pre<User>('save', async function (next) {
  // Only hash if password is new or modified and not already hashed
  if (!this.isModified('password') || this.password.startsWith('$2'))
    {return next();}

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
})
export class User {
  @prop({
    type: () => String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  })
  public email!: string;

  @prop({ type: () => String, required: true, minlength: 6 })
  public password!: string;

  @prop({ type: () => String, required: true, trim: true })
  public firstName!: string;

  @prop({ type: () => String, required: true, trim: true })
  public lastName!: string;

  @prop({
    type: () => String,
    required: true,
    enum: USER_ROLES,
    default: DEFAULT_USER_ROLE,
  })
  public role!: UserRole;

  @prop({ type: () => Boolean, default: false })
  public isEmailVerified!: boolean;

  @prop({ type: () => String })
  public resetPasswordToken?: string;

  @prop({ type: () => Date })
  public resetPasswordExpires?: Date;

  @prop({ type: () => Date, default: Date.now })
  public createdAt!: Date;

  @prop({ type: () => Date, default: Date.now })
  public updatedAt!: Date;

  // Instance method to compare password
  public async comparePassword(
    this: DocumentType<User>,
    candidatePassword: string
  ): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
  }

  // Virtual for full name
  public get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  // Remove password from JSON output
  public toJSON(this: DocumentType<User>) {
    const obj = this.toObject() as UserJsonShape;
    delete obj.password;
    delete obj.resetPasswordToken;
    delete obj.resetPasswordExpires;
    return obj;
  }
}

export type UserDocument = DocumentType<User>;
export const UserModel = getModelForClass(User);
