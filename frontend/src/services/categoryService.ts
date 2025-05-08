import axios from "@/configs/axiosConfig";

export async function getCategories() {
  try {
    const response = await axios.get("/categories");
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export async function getCategoryBySlug(slug1: string, slug2?: string) {
  const slug = slug2 ? `/${slug1}/${slug2}` : `/${slug1}`;
  try {
    const response = await axios.get(`/categories/slug?query=${slug}`);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}
