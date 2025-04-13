// Express
import { Router } from 'express';

// Controllers
import CategoryController from '../controllers/CategoryController.js';

// Auth
import {
  authMiddleware,
  authorizationMiddleware,
} from '../middlewares/authMiddleware.js';

// Create router
const CategoryRoutes = Router();

// Routes
CategoryRoutes.get(
  '/categories',
  authMiddleware,
  authorizationMiddleware(['admin']),
  CategoryController.getAllCategories
);

CategoryRoutes.post(
  '/categories',
  authMiddleware,
  authorizationMiddleware(['admin']),
  CategoryController.createCategory
);

CategoryRoutes.get(
  '/categories/:id',
  authMiddleware,
  authorizationMiddleware(['admin']),
  CategoryController.getCategoryById
);

CategoryRoutes.delete(
  '/categories/:id',
  authMiddleware,
  authorizationMiddleware(['admin']),
  CategoryController.deleteCategoryById
);

CategoryRoutes.put(
  '/categories/:id',
  authMiddleware,
  authorizationMiddleware(['admin']),
  CategoryController.updateCategoryById
);

export default CategoryRoutes;
