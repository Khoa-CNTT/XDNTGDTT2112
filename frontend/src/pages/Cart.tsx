/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { useTheme } from "@/hooks/useTheme";

// MUI Components
import {
  Typography,
  IconButton,
  Stack,
  Card,
  CardContent,
  CardMedia,
  Rating,
  Container,
  Divider,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import Checkout from "@/components/checkout/Checkout";
import Section from "@/components/common/Section";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { coursesInCartSelector, removeCourseFromCart } from "@/features/cart";
import { isLoggedInSelector } from "@/features/account";
import { toast } from "react-toastify";
import { removeFromCart } from "@/services/cartService";

const Cart: React.FC = () => {
  const { themeMode } = useTheme();

  const dispatch = useAppDispatch();
  const courses = useAppSelector(coursesInCartSelector);

  const isLoggedIn = useAppSelector(isLoggedInSelector);

  const totalPrice = courses.reduce((total, item) => total + item.price, 0);

  const handleRemoveCourseFromCart = async (courseId: string) => {
    try {
      if (isLoggedIn) {
        const data = (await removeFromCart(courseId)) as any;
        if (data.statusCode !== 200) {
          toast.error(data.message);
        } else {
          dispatch(removeCourseFromCart(courseId));
          toast.success("Xoá khoá học khỏi giỏ hàng thành công!");
        }
      } else {
        dispatch(removeCourseFromCart(courseId));
        toast.success("Xoá khoá học khỏi giỏ hàng thành công!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Có lỗi xảy ra khi xoá khoá học khỏi giỏ hàng.");
    }
  };

  const formatPrice = (price: number) => {
    return price?.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  };

  return (
    <Section sx={{ mt: "128px", mb: "128px" }}>
      <Container>
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            color: themeMode === "dark" ? "white" : "text.primary",
            mb: 2,
          }}
        >
          Giỏ hàng
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: themeMode === "dark" ? "grey.300" : "text.secondary",
            mb: 3,
          }}
        >
          {courses.length} khóa học trong giỏ hàng
        </Typography>

        <Stack
          width={1}
          direction={{
            xs: "column-reverse",
            lg: "row",
          }}
          justifyContent={"space-between"}
          gap={8}
        >
          <Stack spacing={2}>
            {courses.length === 0 ? (
              <Typography
                variant="body1"
                sx={{
                  color: themeMode === "dark" ? "grey.400" : "text.secondary",
                }}
              >
                Giỏ hàng của bạn đang trống.
              </Typography>
            ) : (
              courses.map((item) => (
                <Card
                  key={item._id}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    p: 2,
                    bgcolor:
                      themeMode === "dark" ? "grey.800" : "background.paper",
                    border: 1,
                    borderColor: themeMode === "dark" ? "grey.600" : "grey.200",
                  }}
                >
                  <CardMedia
                    component="img"
                    sx={{
                      width: "100px",
                      height: "100px",
                      objectFit: "contain",
                      borderRadius: 1,
                      mr: 2,
                    }}
                    image={item.thumbnail || "/images/image-placeholder.png"}
                    alt={item.title}
                  />

                  <CardContent sx={{ flex: 1, p: 0 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: "medium",
                        color: themeMode === "dark" ? "white" : "text.primary",
                      }}
                    >
                      {item.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color:
                          themeMode === "dark" ? "grey.400" : "text.secondary",
                        mb: 1,
                      }}
                    >
                      {item.instructor?.[0].name}
                    </Typography>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Rating
                        value={item.averageRating}
                        precision={0.5}
                        readOnly
                        sx={{ color: "warning.main" }}
                      />
                      <Typography
                        variant="body2"
                        sx={{
                          color:
                            themeMode === "dark"
                              ? "grey.400"
                              : "text.secondary",
                        }}
                      >
                        ({item.reviewCount} xếp hạng)
                      </Typography>
                    </Stack>
                  </CardContent>

                  <Stack alignItems="flex-end" spacing={1}>
                    <IconButton
                      onClick={handleRemoveCourseFromCart.bind(null, item._id)}
                      sx={{
                        color: themeMode === "dark" ? "grey.400" : "grey.500",
                        "&:hover": { color: "error.main" },
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: "medium",
                        color: themeMode === "dark" ? "white" : "text.primary",
                      }}
                    >
                      {formatPrice(item.price)}
                    </Typography>
                  </Stack>
                </Card>
              ))
            )}
          </Stack>

          {courses.length > 0 && (
            <>
              <Stack direction="column" spacing={2}>
                <Stack direction="column" alignItems="flex-start" spacing={1}>
                  <Typography
                    variant="body1"
                    sx={{
                      color:
                        themeMode === "dark" ? "grey.300" : "text.secondary",
                    }}
                  >
                    Tổng:
                  </Typography>
                  <Typography variant="h5" fontWeight={600}>
                    {formatPrice(totalPrice)}
                  </Typography>
                </Stack>
                <Divider />
                <Checkout />
              </Stack>
            </>
          )}
        </Stack>
      </Container>
    </Section>
  );
};

export default Cart;
