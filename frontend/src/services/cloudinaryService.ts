import axios from "@/configs/axiosConfig";

export const uploadFileToCloudinary = async (data: FormData) => {
  try {
    const response = await axios.post("/upload-file", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
};
