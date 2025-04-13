// Types
import type { NextFunction, Request, Response } from 'express';

// Services
import CategoryService from '../services/CategoryService.js';

// Messages
import messages from '../configs/messagesConfig.js';

// Server response
import serverResponse from '../utils/helpers/responses.js';

const CategoryController = {
  createCategory: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, description, parentId } = req.body;

      const category = await CategoryService.createCategory({
        name,
        description,
        parentId,
      });

      res.status(messages.CREATED.statusCode).json(
        serverResponse.createSuccess(
          {
            ...messages.CREATED,
            message: 'Category created successfully',
          },
          category
        )
      );
    } catch (error) {
      next(error);
    }
  },
  getCategoryById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const category = await CategoryService.getCategoryById(id);

      res.status(messages.OK.statusCode).json(
        serverResponse.createSuccess(
          {
            ...messages.OK,
            message: 'Get category successfully',
          },
          category
        )
      );
    } catch (error) {
      next(error);
    }
  },
  getAllCategories: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const categories = await CategoryService.getAllCategories();

      res.status(messages.OK.statusCode).json(
        serverResponse.createSuccess(
          {
            ...messages.OK,
            message: 'Get all categories successfully',
          },
          categories
        )
      );
    } catch (error) {
      next(error);
    }
  },
  deleteCategoryById: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;

      await CategoryService.deleteCategoryById(id);

      res.status(messages.OK.statusCode).json(
        serverResponse.createSuccess(
          {
            ...messages.OK,
            message: 'Delete category successfully',
          },
          null
        )
      );
    } catch (error) {
      next(error);
    }
  },
  updateCategoryById: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const { name, description, parentId } = req.body;

      const category = await CategoryService.updateCategoryById(id, {
        name,
        description,
        parentId,
      });

      res.status(messages.OK.statusCode).json(
        serverResponse.createSuccess(
          {
            ...messages.OK,
            message: 'Update category successfully',
          },
          category
        )
      );
    } catch (error) {
      next(error);
    }
  },
};

export default CategoryController;
