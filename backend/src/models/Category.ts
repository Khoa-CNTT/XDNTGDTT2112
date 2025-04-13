import mongoose, { InferSchemaType } from 'mongoose';

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      default: null,
    },
  },
  {
    id: false,
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

CategorySchema.virtual('children', {
  ref: 'Category',
  localField: '_id',
  foreignField: 'parentId',
});

export type CategoryType = InferSchemaType<typeof CategorySchema>;

const Category = mongoose.model('Category', CategorySchema);

export default Category;
