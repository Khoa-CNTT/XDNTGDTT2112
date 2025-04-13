// Express
import { Request, Response, NextFunction } from 'express';

// Services
import UserService from '../services/UserService.js';

// Server response
import serverResponse from '../utils/helpers/responses.js';

// Messages
import messages from '../configs/messagesConfig.js';

// Types
import { RequestWithUser } from '../types/types.js';

const UserController = {
  me: async (req: Request, res: Response, next: NextFunction) => {
    const user = (req as RequestWithUser).user;
    try {
      const data = await UserService.getUserByEmailWithoutPasswordHash(
        user.email
      );

      res.status(messages.OK.statusCode).json(
        serverResponse.createSuccess(
          {
            ...messages.OK,
            message: 'Get user successfully!',
          },
          data
        )
      );
    } catch (error) {
      next(error);
    }
  },
  updateProfile: async (req: Request, res: Response, next: NextFunction) => {
    const user = (req as RequestWithUser).user;
    const { name, bio, avatarUrl } = req.body;
    try {
      const data = await UserService.updateProfile(user.email, {
        name,
        bio,
        avatarUrl,
      });

      res.status(messages.OK.statusCode).json(
        serverResponse.createSuccess(
          {
            ...messages.OK,
            message: 'Update user successfully!',
          },
          data
        )
      );
    } catch (error) {
      next(error);
    }
  },
  getUserById: async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;

    try {
      const data = await UserService.getUserById(id);

      res.status(messages.OK.statusCode).json(
        serverResponse.createSuccess(
          {
            ...messages.OK,
            message: 'Get user successfully!',
          },
          data
        )
      );
    } catch (error) {
      next(error);
    }
  },
  getAllUsers: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await UserService.getAllUsers();

      res.status(messages.OK.statusCode).json(
        serverResponse.createSuccess(
          {
            ...messages.OK,
            message: 'Get all users successfully!',
          },
          data
        )
      );
    } catch (error) {
      next(error);
    }
  },
  createUser: async (req: Request, res: Response, next: NextFunction) => {
    const { email, name, bio, role, password, provider, avatarUrl } = req.body;

    try {
      const data = await UserService.createUser({
        email,
        name,
        password,
        bio: bio || '',
        role: role || 'user',
        provider: provider || 'local',
        avatarUrl: avatarUrl || '',
      });

      res.status(messages.CREATED.statusCode).json(
        serverResponse.createSuccess(
          {
            ...messages.CREATED,
            message: 'Create user successfully!',
          },
          data
        )
      );
    } catch (error) {
      next(error);
    }
  },
  deleteUserById: async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;

    try {
      await UserService.deleteUserById(id);

      res.status(messages.OK.statusCode).json(
        serverResponse.createSuccess(
          {
            ...messages.OK,
            message: 'Delete user successfully!',
          },
          null
        )
      );
    } catch (error) {
      next(error);
    }
  },
  updateUserById: async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const { email, name, bio, role, password, provider, avatarUrl } = req.body;

    try {
      const data = await UserService.updateUserById(id, {
        email,
        name,
        password,
        bio: bio || '',
        role: role || 'user',
        provider: provider || 'local',
        avatarUrl: avatarUrl || '',
      });

      res.status(messages.OK.statusCode).json(
        serverResponse.createSuccess(
          {
            ...messages.OK,
            message: 'Update user successfully!',
          },
          data
        )
      );
    } catch (error) {
      next(error);
    }
  },
};

export default UserController;
