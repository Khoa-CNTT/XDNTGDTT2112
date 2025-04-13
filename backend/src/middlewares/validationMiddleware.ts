// Express
import { Request, Response, NextFunction } from 'express';

// Types
import {
  ErrorResponseType,
  MessageType,
  UserCreateInput,
  UserLoginInput,
} from '../types/types.js';

// Message config
import messages from '../configs/messagesConfig.js';

// Validation constants
const PATTERNS = {
  EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{6,24}$/,
};

enum UserRole {
  USER = 'user',
  INSTRUCTOR = 'instructor',
  ADMIN = 'admin',
}

enum UserProvider {
  LOCAL = 'local',
  GOOGLE = 'google',
  FACEBOOK = 'facebook',
}

/**
 * Validates user registration data
 */
export const validateRegister = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const data = req.body as UserCreateInput;

  // Initialize error response
  const errorResponse: MessageType & { errors: ErrorResponseType } = {
    ...messages.VALIDATION_ERROR,
    errors: {},
  };

  // Validate required fields
  const addErrorIfMissing = (field: string, value?: string) => {
    if (!value || value.trim() === '') {
      errorResponse.errors[field] = {
        field,
        message: `The ${field} field is required.`,
      };
      return true;
    }
    return false;
  };

  // Check required fields
  ['email', 'name', 'password'].forEach((field) =>
    addErrorIfMissing(field, data[field as keyof typeof data] as string)
  );

  // Validate email format
  if (
    data.email &&
    !errorResponse.errors['email'] &&
    !PATTERNS.EMAIL.test(data.email)
  ) {
    errorResponse.errors['email'] = {
      field: 'email',
      message: 'Invalid email address.',
    };
  }

  // Password validation for local registration
  if (
    data.password &&
    !errorResponse.errors['password'] &&
    !PATTERNS.PASSWORD.test(data.password!)
  ) {
    errorResponse.errors['password'] = {
      field: 'password',
      message:
        'Password must be 6-24 characters and include at least 1 lowercase, 1 uppercase, and 1 special character.',
    };
  }

  if (
    data.role !== undefined &&
    !errorResponse.errors['role'] &&
    UserRole[data.role.toUpperCase() as keyof typeof UserRole] === undefined
  ) {
    errorResponse.errors['role'] = {
      field: 'role',
      message:
        'Invalid role. Role must be one of the following: user, instructor, admin.',
    };
  }

  if (
    data.provider !== undefined &&
    !errorResponse.errors['provider'] &&
    UserProvider[data.provider.toUpperCase() as keyof typeof UserProvider] ===
      undefined
  ) {
    errorResponse.errors['provider'] = {
      field: 'provider',
      message:
        'Invalid provider. Provider must be one of the following: local, google, facebook.',
    };
  }

  // Return error response if validation failed
  if (Object.keys(errorResponse.errors).length > 0) {
    res.status(errorResponse.statusCode).json(errorResponse);
    return;
  }

  next();
};

/**
 * Validates user login data
 */
export const validateLogin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const data = req.body as UserLoginInput;
  const { email, password, facebookAccessToken, googleAccessToken, provider } =
    data;

  // Initialize error response
  const errorResponse: MessageType & { errors: ErrorResponseType } = {
    ...messages.VALIDATION_ERROR,
    errors: {},
  };

  // Helper to add validation errors
  const addError = (field: string, message: string) => {
    errorResponse.errors[field] = { field, message };
  };

  // Validate provider
  if (!provider || provider.trim() === '') {
    addError('provider', 'The provider field is required.');
  } else if (!['local', 'google', 'facebook'].includes(provider)) {
    addError('provider', 'Login provider is not supported.');
  } else {
    // Provider-specific validations
    switch (provider) {
      case 'local': {
        if (!email || email.trim() === '') {
          addError('email', 'The email field is required.');
        } else if (!PATTERNS.EMAIL.test(email)) {
          addError('email', 'Invalid email address.');
        }

        if (!password || password.trim() === '') {
          addError('password', 'The password field is required.');
        }
        break;
      }

      case 'facebook': {
        if (!facebookAccessToken || facebookAccessToken.trim() === '') {
          addError(
            'facebookAccessToken',
            'The facebookAccessToken field is required.'
          );
        }
        break;
      }

      case 'google': {
        if (!googleAccessToken || googleAccessToken.trim() === '') {
          addError(
            'googleAccessToken',
            'The googleAccessToken field is required.'
          );
        }
        break;
      }
    }
  }

  // Return error response if validation failed
  if (Object.keys(errorResponse.errors).length > 0) {
    res.status(errorResponse.statusCode).json(errorResponse);
    return;
  }

  next();
};

/**
 * Validates user data for password reset
 */
export const validateResetPassword = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const data = req.body as { password?: string; resetToken?: string };

  // Initialize error response
  const errorResponse: MessageType & { errors: ErrorResponseType } = {
    ...messages.VALIDATION_ERROR,
    errors: {},
  };

  if (!data.password || data.password.trim() === '') {
    errorResponse.errors['password'] = {
      field: 'password',
      message: 'The password field is required.',
    };
  }

  if (!data.resetToken || data.resetToken.trim() === '') {
    errorResponse.errors['resetToken'] = {
      field: 'resetToken',
      message: 'The resetToken field is required.',
    };
  }

  // Password validation for local registration
  if (
    data.password &&
    !errorResponse.errors['password'] &&
    !PATTERNS.PASSWORD.test(data.password!)
  ) {
    errorResponse.errors['password'] = {
      field: 'password',
      message:
        'Password must be 6-24 characters and include at least 1 lowercase, 1 uppercase, and 1 special character.',
    };
  }

  // Return error response if validation failed
  if (Object.keys(errorResponse.errors).length > 0) {
    res.status(errorResponse.statusCode).json(errorResponse);
    return;
  }

  next();
};

/**
 * Validates user data for changing password
 */
export const validateChangePassword = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const data = req.body as { oldPassword?: string; newPassword?: string };

  // Initialize error response
  const errorResponse: MessageType & { errors: ErrorResponseType } = {
    ...messages.VALIDATION_ERROR,
    errors: {},
  };

  if (!data.oldPassword || data.oldPassword.trim() === '') {
    errorResponse.errors['oldPassword'] = {
      field: 'oldPassword',
      message: 'The oldPassword field is required.',
    };
  }

  if (!data.newPassword || data.newPassword.trim() === '') {
    errorResponse.errors['newPassword'] = {
      field: 'newPassword',
      message: 'The newPassword field is required.',
    };
  }

  // Password validation for local registration
  if (
    data.newPassword &&
    !errorResponse.errors['newPassword'] &&
    !PATTERNS.PASSWORD.test(data.newPassword!)
  ) {
    errorResponse.errors['newPassword'] = {
      field: 'newPassword',
      message:
        'Password must be 6-24 characters and include at least 1 lowercase, 1 uppercase, and 1 special character.',
    };
  }

  // Return error response if validation failed
  if (Object.keys(errorResponse.errors).length > 0) {
    res.status(errorResponse.statusCode).json(errorResponse);
    return;
  }

  next();
};
