// Models
import Category, { CategoryType } from '../models/Category.js';

// Slugify
import slugify from 'slugify';

// Server response
import serverResponse from '../utils/helpers/responses.js';

// Messages
import messages from '../configs/messagesConfig.js';

// Mongoose
import mongoose from 'mongoose';

type CategoryCreateInput = Pick<CategoryType, 'name' | 'description'> & {
  parentId?: string;
};

const CategoryService = {
  createCategory: async function (data: CategoryCreateInput) {
    if (data.parentId) {
      await this.getCategoryById(data.parentId);
    }

    const existedCategory = await Category.findOne({
      name: data.name,
    });

    if (existedCategory) {
      throw serverResponse.createError({
        ...messages.ALREADY_EXISTS,
        message: 'Category already exists',
      });
    }

    const slug = (slugify as any)(data.name, {
      lower: true,
      locale: 'vi',
    });

    const category = await Category.create({ ...data, slug });

    return category;
  },
  getCategoryById: async function (id: string) {
    try {
      const category = await Category.findById(id);
      if (!category) {
        throw serverResponse.createError({
          ...messages.NOT_FOUND,
          message: 'Category not found',
        });
      }
      return category;
    } catch (error) {
      // Handle error if id is not a valid ObjectId
      throw serverResponse.createError({
        ...messages.BAD_REQUEST,
        message: 'Invalid category ID',
      });
    }
  },
  getAllCategories: async function () {
    const categories = await Category.find({ parentId: null }).populate({
      path: 'children',
    });
    return categories;
  },
  deleteCategoryById: async function (id: string) {
    try {
      await Category.findByIdAndDelete(id);
      return true;
    } catch (error) {
      throw serverResponse.createError({
        ...messages.NOT_FOUND,
        message: 'Category not found',
      });
    }
  },
  updateCategoryById: async function (id: string, data: CategoryCreateInput) {
    if (data.parentId === id) {
      throw serverResponse.createError({
        ...messages.BAD_REQUEST,
        message: 'Category cannot be children of itself',
      });
    }

    if (data.parentId !== undefined && data.parentId !== null) {
      const parentCategory = await this.getCategoryById(data.parentId);

      if (parentCategory.parentId?.toString() === id) {
        throw serverResponse.createError({
          ...messages.BAD_REQUEST,
          message: 'Category parent cannot be children of its children.',
        });
      }
    }

    const category = await this.getCategoryById(id);

    // Kiểm tra category đã tồn tại hay chưa (trừ category hiện tại _id: $ne: id)
    const existedCategory = await Category.findOne({
      name: data.name,
      _id: { $ne: id },
    });

    if (existedCategory) {
      throw serverResponse.createError({
        ...messages.ALREADY_EXISTS,
        message: 'Category already exists',
      });
    }

    const slug = (slugify as any)(data.name, {
      lower: true,
      locale: 'vi',
    });

    category.name = data.name;
    category.description = data.description;
    category.slug = slug;

    if (data.parentId !== undefined)
      category.parentId =
        data.parentId !== null
          ? new mongoose.Types.ObjectId(data.parentId)
          : data.parentId;

    await category.save();

    return category;
  },
};

export default CategoryService;
