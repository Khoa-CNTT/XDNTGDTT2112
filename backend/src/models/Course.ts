import mongoose from 'mongoose';

const CourseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    discountPrice: {
      type: Number,
      default: null,
    },
    thumbnail: {
      type: String,
      required: true,
    },
    instructorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'expert', 'all'],
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    requirements: {
      type: String,
      required: true,
    },
    whatYouWillLearn: {
      type: String,
      required: true,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
  },
  {
    id: false,
    timestamps: true,
  }
);
