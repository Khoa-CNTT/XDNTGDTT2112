// Express
import { Request, Response, NextFunction } from 'express';

// Server response
import serverResponse from '../utils/helpers/responses.js';

// Message config
import messages from '../configs/messagesConfig.js';

// Verify token
import { verifyToken, generateToken } from '../utils/helpers/tokens.js';

// JWT
import jwt from 'jsonwebtoken';

// UUID
import { v4 as uuidv4 } from 'uuid';

// Redis utils
import {
  checkTokenInRedis,
  deleteAccessAndRefreshTokensFromRedis,
  saveAccessAndRefreshTokensToRedis,
} from '../utils/redis/redisUtils.js';

export type JwtPayLoadType = {
  email: string;
  role: 'user' | 'instructor' | 'admin';
  registerProvider: 'local' | 'google' | 'facebook';
  jit: string;
  iat: number;
  exp: number;
};

export type RequestWithUser = Request & {
  user: Pick<JwtPayLoadType, 'email' | 'role' | 'registerProvider' | 'jit'>;
};

// Authentication middleware
export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { acc_t: accessToken, ref_t: refreshToken } = req.cookies;

  try {
    if (!accessToken) {
      throw serverResponse.createError({
        ...messages.UNAUTHORIZED,
        message: 'Access token is required',
      });
    }

    const user = verifyToken(accessToken, 'ACCESS') as JwtPayLoadType;

    const isAccessTokenExists = await checkTokenInRedis(
      user.email,
      accessToken,
      user.jit
    );

    // Check if the access token does not exist in the TOKEN_LIST (revoked)
    if (!isAccessTokenExists) {
      throw serverResponse.createError({
        ...messages.UNAUTHORIZED,
        message: 'Access token is revoked',
      });
    }

    (req as RequestWithUser).user = {
      email: user.email,
      role: user.role,
      registerProvider: user.registerProvider,
      jit: user.jit,
    };

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      await handleRefreshToken(
        accessToken,
        refreshToken,
        req as RequestWithUser,
        res,
        next
      );
    } else {
      next(error);
    }
  }
};

type RoleType = 'user' | 'instructor' | 'admin';

// Authorization middleware
export const authorizationMiddleware = (roles: RoleType[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as RequestWithUser).user;

    if (!user) {
      throw serverResponse.createError({
        ...messages.UNAUTHORIZED,
        message: 'Authentication is needed before authorization',
      });
    }

    if (!roles.includes(user.role)) {
      throw serverResponse.createError({
        ...messages.FORBIDDEN,
        message: 'You do not have permission to access this resource.',
      });
    }

    next();
  };
};

const handleRefreshToken = async (
  accessToken: string,
  refreshToken: string,
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) => {
  try {
    const decoded = verifyToken(refreshToken, 'REFRESH') as JwtPayLoadType;

    const isRefreshTokenExists = await checkTokenInRedis(
      decoded.email,
      refreshToken,
      decoded.jit
    );

    // Check if the refresh token does not exist in the TOKEN_LIST (revoked)
    if (!isRefreshTokenExists) {
      throw serverResponse.createError({
        ...messages.UNAUTHORIZED,
        message: 'Refresh token is revoked',
      });
    }

    const payload = {
      email: decoded.email,
      role: decoded.role,
      jit: uuidv4(),
      registerProvider: decoded.registerProvider,
    };

    const newAccessToken = generateToken(payload, 'ACCESS', '15m');
    const newRefreshToken = generateToken(payload, 'REFRESH', '7d');

    // Delete old tokens from Redis
    await deleteAccessAndRefreshTokensFromRedis(
      decoded.email,
      accessToken,
      refreshToken,
      decoded.jit
    );

    // Save new tokens to Redis
    await saveAccessAndRefreshTokensToRedis(
      payload.email,
      newAccessToken,
      newRefreshToken,
      payload.jit
    );

    (req as RequestWithUser).user = {
      email: payload.email,
      role: payload.role,
      registerProvider: payload.registerProvider,
      jit: payload.jit,
    };

    res.cookie('acc_t', newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none',
    });

    res.cookie('ref_t', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none',
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    });

    next();
  } catch (error) {
    next(error);
  }
};
