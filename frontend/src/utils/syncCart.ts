/* eslint-disable @typescript-eslint/no-explicit-any */
import { addMultipleToCart, getCart } from "@/services/cartService";
import { getEnrollments } from "@/services/enrollmentService";
import { getCartFromLocalStorage } from "./localStorage";

export const syncCart = async () => {
  const [enrollments, cart] = await Promise.all([getEnrollments(), getCart()]);

  const enrolledCourseIds = enrollments.data.map((item: any) => item.courseId);
  const cartCourseIds = cart.data.map((item: any) => item.courseId);

  const localCart = getCartFromLocalStorage();

  const filteredCart = localCart.filter(
    (item) =>
      !enrolledCourseIds.includes(item._id) && !cartCourseIds.includes(item._id)
  );

  const filteredCartIds = filteredCart.map((item) => item._id);

  await addMultipleToCart(filteredCartIds);
};
