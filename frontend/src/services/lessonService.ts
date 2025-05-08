import axios from "@/configs/axiosConfig";

interface UpdatedProgress {
  progress: number;
  lastWatchPosition: number;
}

export const updateProgressLesson = async (
  id: string,
  data: UpdatedProgress
) => {
  try {
    const response = await axios.put(`/lesson-progresses/${id}`, data);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
