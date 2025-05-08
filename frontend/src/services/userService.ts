import axios from "@/configs/axiosConfig";

export const becomeInstructor = async () => {
  try {
    const response = await axios.get("/become-instructor");
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const uploadProfile = async (data: object) => {
  try {
    const response = await axios.put("/users/me", data);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};
