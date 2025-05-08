export type User = {
  _id: string;
  email: string;
  name: string;
  bio: string;
  avatarUrl: string;
  role: "user" | "instructor" | "admin";
  registerProvider: "local" | "google" | "facebook";
  createdAt: string;
  updatedAt: string;
  __v: number;
  accessToken: string;
  refreshToken: string;
};

export type Course = {
  _id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  discountPrice: number | null;
  thumbnail: string;
  instructorId: string;
  categoryId: string;
  level: "beginner" | "intermediate" | "expert" | "all";
  duration: number;
  requirements: string;
  whatYouWillLearn: string;
  isPublished: boolean;
  enrollmentCount?: number;
  averageRating?: number;
  reviewCount?: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
  instructor: User[];
  category: Category[];
};

export interface Review {
  _id: string;
  userId: string;
  courseId: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
  user: {
    _id: string;
    name: string;
    avatarUrl: string;
  }[];
}

export interface Category {
  _id: string;
  name: string;
  description: string;
  slug: string;
  parentId: string | null;
  createdAt: string;
  updatedAt: string;
  __v: number;
  children?: Category[];
}

export interface Payment {
  paymentDetails: {
    vnp_Amount: string;
    vnp_BankCode: string;
    vnp_BankTranNo: string;
    vnp_CardType: string;
    vnp_OrderInfo: string;
    vnp_PayDate: string;
    vnp_ResponseCode: string;
    vnp_TmnCode: string;
    vnp_TransactionNo: string;
    vnp_TransactionStatus: string;
    vnp_TxnRef: string;
  };
  _id: string;
  userId: string;
  amount: number;
  transactionId: string;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Enrollment {
  _id: string;
  userId: string;
  courseId: string;
  paymentId: string;
  completionPercentage: number;
  isCompleted: boolean;
  completedAt: null | string;
  enrolledAt: string;
  lastAccessedAt: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  user: User[];
  course: Course[];
  payment: Payment[];
}

export interface CartItem {
  _id: string;
  userId: string;
  courseId: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  user: User[];
  course: Course[];
}

export interface Comment {
  _id: string;
  userId: string;
  lessonId: string;
  content: string;
  parentId: string | null;
  createdAt: string;
  updatedAt: string;
  __v: number;
  user: User[];
  lesson: Lesson[];
  children: Comment[];
}

export interface LessonProgress {
  _id: string;
  userId: string;
  lessonId: string;
  isCompleted: boolean;
  progress: number;
  lastWatchPosition: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Lesson {
  _id: string;
  title: string;
  description: string;
  courseId: string;
  orderIndex: number;
  videoUrl: string;
  duration: number;
  isFree: false;
  createdAt: string;
  updatedAt: string;
  __v: number;
  course: Course[];
  comments: Comment[];
  progress: LessonProgress[];
}

export interface Note {
  _id: string;
  userId: string;
  lessonId: string;
  courseId: string;
  content: string;
  position: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
  user: User[];
  lesson: Lesson[];
  course: Course[];
}
