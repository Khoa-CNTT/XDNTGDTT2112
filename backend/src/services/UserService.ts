// Models
import User, { UserType } from '../models/User.js';

// Messages
import messages from '../configs/messagesConfig.js';

// Server response
import serverResponse from '../utils/helpers/responses.js';

// Bcrypt
import bcrypt from 'bcryptjs';

export type UserCreateInput = Pick<UserType, 'email' | 'name'> & {
  password: string;
  provider: 'local' | 'google' | 'facebook';
  role?: 'user' | 'instructor' | 'admin';
  bio?: string;
  avatarUrl?: string;
};

const UserService = {
  createUser: async function (data: UserCreateInput) {
    const existedUser = await this.getUserByEmailWithPasswordHash(data.email);

    if (existedUser) {
      const providerMessages = {
        google:
          'Your account is connected to Google. Please log in with Google.',
        facebook:
          'Your account is connected to Facebook. Please log in with Facebook',
        default: 'Account already exists.',
      };

      const provider =
        existedUser.registerProvider as keyof typeof providerMessages;

      const message = providerMessages[provider] || providerMessages.default;

      throw serverResponse.createError({
        ...messages.ALREADY_EXISTS,
        message,
      });
    }

    let passwordHash = '';
    if (data.provider === 'local') {
      passwordHash = bcrypt.hashSync(data.password, 10);
    }

    const newUser = await User.create({
      email: data.email,
      name: data.name,
      passwordHash,
      registerProvider: data.provider,
      bio: data.bio || '',
      role: data.role || 'user',
      avatarUrl: data?.avatarUrl || '',
    });

    return newUser;
  },
  getUserById: async function (_id: string) {
    try {
      const user = await User.findOne({ _id }).select('-passwordHash');

      if (!user) {
        throw serverResponse.createError({
          ...messages.NOT_FOUND,
          message: 'User not found!',
        });
      }

      return user;
    } catch (error) {
      throw serverResponse.createError({
        ...messages.NOT_FOUND,
        message: 'User not found!',
      });
    }
  },
  getUserByEmailWithoutPasswordHash: async function (email: string) {
    const user = await User.findOne({ email }).select('-passwordHash');
    return user;
  },
  getUserByEmailWithPasswordHash: async function (email: string) {
    const user = await User.findOne({ email });
    return user;
  },
  getAllUsers: async function () {
    const users = await User.find()
      .select('-passwordHash')
      .sort({ createdAt: -1 });
    return users;
  },
  deleteUserById: async function (_id: string) {
    try {
      await User.findByIdAndDelete(_id);
      return true;
    } catch (error) {
      throw serverResponse.createError({
        ...messages.NOT_FOUND,
        message: 'User not found!',
      });
    }
  },
  updateUserById: async function (_id: string, data: UserCreateInput) {
    const updatedData = Object.entries(data).reduce(
      (acc: any, [key, value]) => {
        if (value !== undefined) {
          if (key === 'password') acc.passwordHash = bcrypt.hashSync(value, 10);
          else acc[key] = value;
        }
        return acc;
      },
      {}
    );

    const user = await User.findByIdAndUpdate(_id, updatedData, {
      new: true,
    });
    return user;
  },
  updateProfile: async function (
    email: string,
    data: Pick<UserType, 'name' | 'bio' | 'avatarUrl'>
  ) {
    const user = await User.findOneAndUpdate({ email }, data, {
      new: true,
    }).select('-passwordHash');
    return user;
  },
};

export default UserService;
