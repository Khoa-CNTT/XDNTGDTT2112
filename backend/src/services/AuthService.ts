// Bcrypt
import bcrypt from 'bcryptjs';

// Server response
import serverResponse from '../utils/helpers/responses.js';

// Messages
import messages from '../configs/messagesConfig.js';

// Tokens
import { generateToken, verifyToken } from '../utils/helpers/tokens.js';

// Types
import { Response } from 'express';
import { UserType } from '../models/User.js';

// Services
import GoogleService, { GoogleUserInfo } from './GoogleService.js';
import FacebookService, { FacebookUserInfo } from './FacebookService.js';
import EmailService from './EmailService.js';
import UserService, { UserCreateInput } from './UserService.js';

// Crypto
import crypto from 'crypto';

// UUID
import { v4 as uuidv4 } from 'uuid';

// Redis
import {
  deleteAccessAndRefreshTokensFromRedis,
  deleteAllTokensFromRedis,
  deleteResetCodeFromRedis,
  getResetCodeInRedis,
  saveAccessAndRefreshTokensToRedis,
  saveResetCodeToRedis,
} from '../utils/redis/redisUtils.js';

export type UserLoginInput = {
  email?: string;
  password?: string;
  googleAccessToken?: string;
  facebookAccessToken?: string;
  provider: 'local' | 'google' | 'facebook';
};

const AuthService = {
  register: async function (data: UserCreateInput) {
    const newUser = await UserService.createUser(data);
    return newUser;
  },
  login: async function (res: Response, data: UserLoginInput) {
    // Provider messages for authentication errors
    const providerMessages = {
      google: 'Your account is connected to Google. Please log in with Google.',
      facebook:
        'Your account is connected to Facebook. Please log in with Facebook',
    };

    // Helper function to generate and set tokens
    const setAuthTokens = async (
      user: UserType & {
        accessToken?: string;
        refreshToken?: string;
      }
    ) => {
      const tokenPayload = {
        email: user.email,
        role: user.role,
        jit: uuidv4(),
        registerProvider: user.registerProvider,
      };

      const accessToken = generateToken(tokenPayload, 'ACCESS', '15m');
      const refreshToken = generateToken(tokenPayload, 'REFRESH', '7d');

      //
      await saveAccessAndRefreshTokensToRedis(
        user.email,
        accessToken,
        refreshToken,
        tokenPayload.jit
      );

      user.accessToken = accessToken;
      user.refreshToken = refreshToken;

      res.cookie('acc_t', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'none',
      });

      res.cookie('ref_t', refreshToken, {
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'none',
      });
    };

    let user;

    switch (data.provider) {
      case 'local': {
        const existedUser = await UserService.getUserByEmailWithPasswordHash(
          data.email as string
        );

        if (!existedUser) {
          throw serverResponse.createError({
            ...messages.NOT_FOUND,
            message: 'Account not found!',
          });
        }

        if (existedUser.registerProvider !== 'local') {
          throw serverResponse.createError({
            ...messages.BAD_REQUEST,
            message:
              providerMessages[
                existedUser.registerProvider as keyof typeof providerMessages
              ] || 'Please log in with your original registration method.',
          });
        }

        const isPasswordMatch = bcrypt.compareSync(
          data.password as string,
          existedUser.passwordHash
        );

        if (!isPasswordMatch) {
          throw serverResponse.createError({
            ...messages.BAD_REQUEST,
            message: 'Password is incorrect!',
          });
        }

        user = existedUser.toObject() as Omit<UserType, 'passwordHash'> & {
          passwordHash?: string;
        };

        delete user.passwordHash;

        break;
      }

      case 'google':
      case 'facebook': {
        const provider = data.provider;

        const service =
          provider === 'facebook' ? FacebookService : GoogleService;

        const tokenField =
          provider === 'facebook' ? 'facebookAccessToken' : 'googleAccessToken';

        const accessToken = data[tokenField] as string;

        const userInfo = await service.getUserInfo(accessToken);

        // Extract common profile properties
        const email = userInfo.email;
        const name = userInfo.name;

        const avatarUrl =
          provider === 'facebook'
            ? (userInfo.picture as FacebookUserInfo['picture']).data.url
            : (userInfo.picture as GoogleUserInfo['picture']);

        // Find or create user
        let existedUser = await UserService.getUserByEmailWithoutPasswordHash(
          email
        );

        if (!existedUser) {
          existedUser = await this.register({
            email,
            name,
            bio: '',
            avatarUrl,
            password: '',
            provider: data.provider,
          });
        }

        break;
      }

      default: {
        throw serverResponse.createError({
          ...messages.BAD_REQUEST,
          message: 'Invalid provider specified.',
        });
      }
    }

    if (!user) {
      throw serverResponse.createError({
        ...messages.SERVER_ERROR,
        message: 'Failed to authenticate user.',
      });
    }

    // Generate and set authentication tokens
    await setAuthTokens(user as UserType);

    return user;
  },
  sendResetCode: async function (email: string) {
    if (!email || email.trim() === '') {
      throw serverResponse.createError({
        ...messages.BAD_REQUEST,
        message: 'Email is required',
      });
    }

    const user = await UserService.getUserByEmailWithoutPasswordHash(email);

    if (!user) {
      throw serverResponse.createError({
        ...messages.NOT_FOUND,
        message: 'Account not found!',
      });
    }

    const resetCode = crypto.randomInt(100000, 999999);

    // Send reset code to email
    await EmailService.sendResetCode(user.name, email, resetCode);

    // Save reset code to redis
    await saveResetCodeToRedis(email, resetCode, 60 * 15); // 15 minutes

    return resetCode;
  },
  verifyResetCode: async function (email: string, resetCode: number) {
    if (!email || email.trim() === '') {
      throw serverResponse.createError({
        ...messages.BAD_REQUEST,
        message: 'Email is required',
      });
    }

    if (!resetCode) {
      throw serverResponse.createError({
        ...messages.BAD_REQUEST,
        message: 'Reset code is required',
      });
    }

    // Get reset code from redis
    const storedResetCode = await getResetCodeInRedis(email);

    if (!storedResetCode || +storedResetCode !== resetCode) {
      throw serverResponse.createError({
        ...messages.BAD_REQUEST,
        message: 'Invalid reset code or expired',
      });
    }

    // Delete reset code from redis
    await deleteResetCodeFromRedis(email);

    const resetToken = generateToken({ email }, 'ACCESS', '15m');

    return resetToken;
  },
  resetPassword: async function (token: string, password: string) {
    try {
      const { email } = verifyToken(token, 'ACCESS') as { email: string };

      const user = await UserService.getUserByEmailWithPasswordHash(email);

      if (!user) {
        throw serverResponse.createError({
          ...messages.BAD_REQUEST,
          message: 'Invalid reset token',
        });
      }

      const passwordHash = bcrypt.hashSync(password, 10);
      user.passwordHash = passwordHash;
      await user?.save();

      // Delete all tokens from Redis
      await deleteAllTokensFromRedis(user.email);
    } catch (error) {
      throw serverResponse.createError({
        ...messages.BAD_REQUEST,
        message: 'Invalid reset token',
      });
    }
  },
  changePassword: async function (
    email: string,
    oldPassword: string,
    newPassword: string
  ) {
    const user = await UserService.getUserByEmailWithPasswordHash(email);

    if (!user) {
      throw serverResponse.createError({
        ...messages.NOT_FOUND,
        message: 'Account not found!',
      });
    }

    const isPasswordMatch = bcrypt.compareSync(oldPassword, user.passwordHash);

    if (!isPasswordMatch) {
      throw serverResponse.createError({
        ...messages.BAD_REQUEST,
        message: 'Old password is incorrect!',
      });
    }

    const passwordHash = bcrypt.hashSync(newPassword, 10);
    user.passwordHash = passwordHash;
    await user.save();

    // Delete all tokens from Redis
    await deleteAllTokensFromRedis(user.email);

    return user;
  },
  logout: async function (
    data: {
      email: string;
      accessToken: string;
      refreshToken: string;
      jit: string;
    },
    res: Response
  ) {
    await deleteAccessAndRefreshTokensFromRedis(
      data.email,
      data.accessToken,
      data.refreshToken,
      data.jit
    );

    res.clearCookie('acc_t');
    res.clearCookie('ref_t');
  },
};

export default AuthService;
