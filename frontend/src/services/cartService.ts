import axios from "@/configs/axiosConfig";

export const getCart = async () => {
  try {
    const response = await axios.get("/cart");
    return response.data;
  } catch (error) {
    console.error("Error", error);
  }
};

export const addToCart = async (courseId: string) => {
  try {
    const response = await axios.post("/cart", { courseId });
    return response.data;
  } catch (error) {
    console.error("Error", error);
  }
};

export const removeFromCart = async (courseId: string) => {
  try {
    const response = await axios.delete(`/cart/${courseId}`);
    return response.data;
  } catch (error) {
    console.error("Error", error);
  }
};

export const addMultipleToCart = async (
  courseIds: string[],
  signal?: AbortSignal
) => {
  try {
    const response = await axios.post(
      "/cart/multiple",
      { courseIds },
      {
        signal: signal,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error adding multiple courses to cart:", error);
  }
};
