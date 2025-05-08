import axios from "@/configs/axiosConfig";

export interface ReviewSubmission {
  courseId: string;
  rating: number;
  comment: string;
}

export async function createReview(review: ReviewSubmission) {
  try {
    const response = await axios.post(`/reviews`, review);
    return response.data;
  } catch (error) {
    console.error("Error creating review:", error);
  }
}
