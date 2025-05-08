import axios from "@/configs/axiosConfig";

interface CreateCommentData {
  lessonId: string;
  content: string;
  parentId?: null | string;
}

export const createComment = async (data: CreateCommentData) => {
  try {
    const response = await axios.post("/comments", data);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};
