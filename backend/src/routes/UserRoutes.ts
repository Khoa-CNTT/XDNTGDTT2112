// Express
import { Router } from 'express';

// Controllers
import UserController from '../controllers/UserController.js';

// Auth
import {
  authMiddleware,
  authorizationMiddleware,
} from '../middlewares/authMiddleware.js';

// Validation
import { validateRegister } from '../middlewares/validationMiddleware.js';

// Create router
const UserRoutes = Router();

// Profile
UserRoutes.get('/users/me', authMiddleware, UserController.me);
UserRoutes.put('/users/me', authMiddleware, UserController.updateProfile);

// Users management
UserRoutes.get(
  '/users',
  authMiddleware,
  authorizationMiddleware(['admin']),
  UserController.getAllUsers
);

UserRoutes.post(
  '/users',
  authMiddleware,
  authorizationMiddleware(['admin']),
  validateRegister,
  UserController.createUser
);

UserRoutes.get(
  '/users/:id',
  authMiddleware,
  authorizationMiddleware(['admin']),
  UserController.getUserById
);

UserRoutes.put(
  '/users/:id',
  authMiddleware,
  authorizationMiddleware(['admin']),
  validateRegister,
  UserController.updateUserById
);

UserRoutes.delete(
  '/users/:id',
  authMiddleware,
  authorizationMiddleware(['admin']),
  UserController.deleteUserById
);

export default UserRoutes;
