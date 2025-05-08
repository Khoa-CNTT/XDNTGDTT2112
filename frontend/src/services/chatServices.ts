import axios from "@/configs/axiosConfig";

export const chatWithAI = async (message: string) => {
  const response = await axios.post("/chat-with-ai", { message });
  return response.data;
};
