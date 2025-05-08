import axios from "@/configs/axiosConfig";

export const getEnrollments = async () => {
  try {
    const response = await axios.get("/enrollments");
    return response.data;
  } catch (error) {
    console.error(error);
  }
};
