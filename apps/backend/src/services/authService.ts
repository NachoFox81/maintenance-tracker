import { JWTPayload, normalizeEmail } from '@doorloop/shared';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/User';
import { RegisterInput, LoginInput } from '../utils/validation';
import { createError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';

export class AuthService {
  private generateToken(payload: JWTPayload): string {
    const jwtSecret = process.env.JWT_SECRET;
    const jwtExpiresIn = process.env.JWT_EXPIRES_IN || '7d';

    if (!jwtSecret) {
      throw createError('JWT_SECRET is not configured', 500);
    }

    return jwt.sign(payload, jwtSecret, {
      expiresIn: jwtExpiresIn,
    } as jwt.SignOptions);
  }

  async register(userData: RegisterInput) {
    const normalizedEmail = normalizeEmail(userData.email);

    // Check if user already exists
    const existingUser = await UserModel.findOne({ email: normalizedEmail });
    if (existingUser) {
      throw createError('User already exists with this email', 400);
    }

    // Create new user
    const user = new UserModel({
      ...userData,
      email: normalizedEmail,
    });
    await user.save();

    // Generate token
    const token = this.generateToken({
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    logger.info(`New user registered: ${user.email}`);

    return {
      user: user.toJSON(),
      token,
    };
  }

  async login(credentials: LoginInput) {
    const { password } = credentials;
    const email = normalizeEmail(credentials.email);

    // Find user and include password for comparison
    const user = await UserModel.findOne({ email }).select('+password');
    if (!user) {
      throw createError('Invalid email or password', 401);
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw createError('Invalid email or password', 401);
    }

    // Generate token
    const token = this.generateToken({
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    logger.info(`User logged in: ${user.email}`);

    return {
      user: user.toJSON(),
      token,
    };
  }

  async verifyToken(token: string) {
    try {
      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret) {
        throw createError('JWT_SECRET is not configured', 500);
      }

      const decoded = jwt.verify(token, jwtSecret) as JWTPayload;
      const user = await UserModel.findById(decoded.id);

      if (!user) {
        throw createError('User not found', 404);
      }

      return user.toJSON();
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        throw createError('Invalid token', 401);
      }
      if (error instanceof jwt.TokenExpiredError) {
        throw createError('Token expired', 401);
      }
      throw error;
    }
  }
}

export const authService = new AuthService();
