import mongoose, { Schema } from "mongoose";

const NotificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    referenceUrl: {
      type: String,
      required: true,
    },
    to: {
      enum: ["user", "admin", "instructor"],
      type: String,
      required: true,
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

NotificationSchema.virtual("user", {
  ref: "User",
  localField: "userId",
  foreignField: "_id",
});

export type NotificationType = mongoose.InferSchemaType<
  typeof NotificationSchema
>;

const Notification = mongoose.model("Notification", NotificationSchema);

export default Notification;
