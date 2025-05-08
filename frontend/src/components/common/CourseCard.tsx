/* eslint-disable @typescript-eslint/no-explicit-any */
// Components
import Image from "./Image";
import { OneLineTypography, TwoLineTypography } from "../typography";

// Icons
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import MonitorIcon from "@mui/icons-material/Monitor";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
// MUI
import { Box, Button, Rating, Stack, Tooltip, Typography } from "@mui/material";

// Types
import { Course } from "@/types";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { addCourseToCart, cartSelector } from "@/features/cart";
import {
  enrollmentsSelector,
  isLoggedInSelector,
  userSelector,
} from "@/features/account";
import { Link } from "react-router-dom";
import { addToCart } from "@/services/cartService";
import { toast } from "react-toastify";
type Props = {
  course: Course;
};

export default function Card({ course }: Props) {
  const enrollments = useAppSelector(enrollmentsSelector);

  const isLoggedIn = useAppSelector(isLoggedInSelector);
  const user = useAppSelector(userSelector);

  const { courses } = useAppSelector(cartSelector);

  const dispatch = useAppDispatch();

  const handleAddToCart = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    e.stopPropagation();
    if (isLoggedIn) {
      const data = await addToCart(course._id);
      if ((data as any).statusCode === 201) {
        dispatch(addCourseToCart(course));
        toast.success("Đã thêm vào giỏ hàng");
      } else {
        toast.error((data as any).message);
        return;
      }
    } else {
      dispatch(addCourseToCart(course));
      toast.success("Đã thêm vào giỏ hàng");
    }
  };

  const isEnrolled = enrollments?.some(
    (enrollment) => enrollment?.courseId?.toString() === course?._id
  );

  const isInCart = courses?.some(
    (courseInCart) => courseInCart._id === course._id
  );

  return (
    <Tooltip
      title="Xem chi tiết"
      sx={{ cursor: "pointer", pb: 1 }}
      followCursor
      PopperProps={{
        modifiers: [
          {
            name: "offset",
            options: {
              offset: [35, 10],
            },
          },
        ],
      }}
    >
      <Stack direction={"column"} width={"100%"} gap={"4px"}>
        <Box
          sx={{
            width: "100%",
            position: "relative",
            aspectRatio: "5/3",
            borderRadius: 3,
            overflow: "hidden",
          }}
        >
          <Image
            src={course.thumbnail || "/images/image-placeholder.png"}
            fill
          />
        </Box>
        <TwoLineTypography
          sx={{ maxWidth: "100%", height: "40px", fontSize: "1rem" }}
          fontWeight={600}
        >
          {course.title}
        </TwoLineTypography>
        <OneLineTypography
          sx={{ opacity: 0.8, fontSize: "0.8rem" }}
          variant="body1"
          fontWeight={400}
        >
          {course.instructor?.[0]?.name}
        </OneLineTypography>
        <Stack direction={"row"} alignItems={"center"} gap={"4px"}>
          <Typography sx={{ color: "#ff7b00", fontWeight: 600 }}>
            {course?.averageRating}
          </Typography>
          <Rating
            name="rating"
            value={course?.averageRating}
            precision={0.5}
            size="small"
            readOnly
          />
        </Stack>
        <Stack
          direction={"row"}
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          <Box>
            <Typography sx={{ fontSize: "1rem" }} fontWeight={600}>
              ₫{course.price}
            </Typography>
            {course.discountPrice && (
              <Typography
                sx={{
                  fontSize: "0.75rem",
                  textDecoration: "line-through",
                  opacity: 0.5,
                }}
              >
                ₫{course.discountPrice}
              </Typography>
            )}
          </Box>
          {user?.role !== "admin" && !isEnrolled && !isInCart && (
            <Button onClick={handleAddToCart} variant="text" sx={{ gap: 1 }}>
              <AddShoppingCartIcon />
              <Typography>Giỏ hàng</Typography>
            </Button>
          )}
          {isEnrolled && user?.role !== "admin" && (
            <Link
              to={`/learning${course.slug}`}
              style={{ textDecoration: "none" }}
            >
              <Button variant="text" sx={{ gap: 1 }}>
                <MonitorIcon />
                <Typography>Xem khoá học</Typography>
              </Button>
            </Link>
          )}
          {isInCart && user?.role !== "admin" && (
            <Link to={`/cart`} style={{ textDecoration: "none" }}>
              <Button variant="text" sx={{ gap: 1 }}>
                <ShoppingCartCheckoutIcon />
                <Typography>Đến giỏ hàng</Typography>
              </Button>
            </Link>
          )}
        </Stack>
      </Stack>
    </Tooltip>
  );
}
