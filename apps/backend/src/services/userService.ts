import { UserModel } from '../models/User';

export class UserService {
  async getAssignableUsers() {
    return UserModel.find({
      role: { $in: ['manager', 'admin'] },
    })
      .select('firstName lastName email role')
      .sort({
        role: 1,
        firstName: 1,
        lastName: 1,
      });
  }
}

export const userService = new UserService();
