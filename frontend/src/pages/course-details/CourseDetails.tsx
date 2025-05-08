/* eslint-disable @typescript-eslint/no-explicit-any */
// Components
import Image from "@/components/common/Image";
import Section from "@/components/common/Section";

// MUI
import {
  Box,
  Stack,
  Typography,
  Rating,
  Divider,
  Avatar,
  Paper,
  Chip,
  Button,
  TextField,
} from "@mui/material";

// Icons
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import SchoolIcon from "@mui/icons-material/School";
import PersonIcon from "@mui/icons-material/Person";
import CategoryIcon from "@mui/icons-material/Category";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import MonitorIcon from "@mui/icons-material/Monitor";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";

// React Router
import { useLoaderData, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { addCourseToCart, cartSelector } from "@/features/cart";
import {
  enrollmentsSelector,
  isLoggedInSelector,
  userSelector,
} from "@/features/account";
import { addToCart } from "@/services/cartService";
import { toast } from "react-toastify";
import { useState } from "react";
import { createReview } from "@/services/reviewService";

export default function CourseDetails() {
  const { course, reviews, lessons } = useLoaderData();
  const user = useAppSelector(userSelector);
  // Add this inside your component before the return statement
  const [rating, setRating] = useState<number>(0);
  const [content, setContent] = useState<string>("");

  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();

  const enrollments = useAppSelector(enrollmentsSelector);
  const { courses } = useAppSelector(cartSelector);

  const isLoggedIn = useAppSelector(isLoggedInSelector);

  const dispatch = useAppDispatch();

  const handleAddToCart = async () => {
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

  const handleViewCourse = () => {
    navigate(`/learning${course.slug}`);
  };

  const handleGoToCart = () => {
    navigate("/cart");
  };

  // Add this function to handle review submission
  const handleSubmitReview = async () => {
    if (rating === 0 || !content.trim()) return;

    try {
      setSubmitting(true);

      const response = (await createReview({
        courseId: course._id,
        rating: rating,
        comment: content,
      })) as any;

      if (response.statusCode === 201) {
        toast.success("Đánh giá của bạn đã được gửi thành công!");
        setRating(0);
        setContent("");
        navigate(`/courses/${course._id}`, {
          replace: true,
          preventScrollReset: true,
        });
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Có lỗi xảy ra khi gửi đánh giá.");
    } finally {
      setSubmitting(false);
    }
  };

  const {
    title,
    description,
    price,
    discountPrice,
    thumbnail,
    instructor,
    category,
    level,
    duration,
    requirements,
    whatYouWillLearn,
  } = course;

  const isEnrolled = enrollments?.some(
    (enrollment) => enrollment?.courseId?.toString() === course?._id
  );

  const isInCart = courses?.some(
    (courseInCart) => courseInCart._id === course._id
  );

  const sortedReviews = reviews.sort((a: any, b: any) => {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);
    return dateB.getTime() - dateA.getTime(); // Sort in descending order
  });

  const isAuthor = user?._id === course?.instructorId;

  return (
    <>
      <Section sx={{ mt: "128px", mb: "128px" }}>
        <Stack spacing={4}>
          {/* Course Header */}
          <Stack direction={{ xs: "column", md: "row" }} spacing={4}>
            <Box
              sx={{
                width: { xs: "100%", md: "50%" },
                position: "relative",
                aspectRatio: "16/9",
                borderRadius: 3,
                overflow: "hidden",
              }}
            >
              <Image src={thumbnail || "/images/image-placeholder.png"} fill />
            </Box>

            <Stack spacing={3} sx={{ width: { xs: "100%", md: "50%" } }}>
              <Stack spacing={1}>
                <Typography variant="h4" fontWeight={600}>
                  {title}
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Rating
                    value={course.averageRating}
                    precision={0.5}
                    readOnly
                  />
                  <Typography variant="body2" color="text.secondary">
                    ({course.reviewCount} đánh giá)
                  </Typography>
                </Stack>
              </Stack>

              <Stack spacing={1}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <PersonIcon fontSize="small" />
                  <Typography variant="body1">
                    Giảng viên: {instructor[0]?.name}
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                  <CategoryIcon fontSize="small" />
                  <Typography variant="body1">
                    Danh mục: {category[0]?.name}
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                  <SchoolIcon fontSize="small" />
                  <Typography variant="body1">
                    Cấp độ:{" "}
                    {level === "beginner"
                      ? "Người mới bắt đầu"
                      : level === "intermediate"
                      ? "Trung cấp"
                      : "Nâng cao"}
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                  <AccessTimeIcon fontSize="small" />
                  <Typography variant="body1">
                    Thời lượng: {(duration / 60 / 60).toFixed(1)} giờ
                  </Typography>
                </Stack>
              </Stack>

              <Stack direction="row" spacing={2} alignItems="center">
                {!isEnrolled && discountPrice > 0 ? (
                  <>
                    <Typography variant="h5" color="error">
                      {discountPrice.toLocaleString("vi-VN")}đ
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        textDecoration: "line-through",
                        color: "text.secondary",
                      }}
                    >
                      {price.toLocaleString("vi-VN")}đ
                    </Typography>
                  </>
                ) : (
                  !isEnrolled && (
                    <Typography variant="h5">
                      {price.toLocaleString("vi-VN")}đ
                    </Typography>
                  )
                )}
              </Stack>
              {user?.role !== "admin" && !isEnrolled && !isInCart && (
                <Button
                  onClick={handleAddToCart}
                  variant="contained"
                  startIcon={<ShoppingCartIcon />}
                  sx={{
                    width: { xs: "100%", sm: "auto" },
                    minWidth: { xs: "100%", sm: 200 },
                    mt: { xs: 2, sm: 0 },
                  }}
                >
                  Thêm vào giỏ hàng
                </Button>
              )}
              {user?.role !== "admin" && isEnrolled && (
                <Button
                  onClick={handleViewCourse}
                  variant="contained"
                  startIcon={<MonitorIcon />}
                  sx={{
                    width: { xs: "100%", sm: "auto" },
                    minWidth: { xs: "100%", sm: 200 },
                    mt: { xs: 2, sm: 0 },
                  }}
                >
                  Xem khoá học
                </Button>
              )}
              {user?.role !== "admin" && isInCart && (
                <Button
                  onClick={handleGoToCart}
                  variant="contained"
                  startIcon={<ShoppingCartCheckoutIcon />}
                  sx={{
                    width: { xs: "100%", sm: "auto" },
                    minWidth: { xs: "100%", sm: 200 },
                    mt: { xs: 2, sm: 0 },
                  }}
                >
                  Đến giỏ hàng
                </Button>
              )}
            </Stack>
          </Stack>

          <Divider />

          {/* Course Description */}
          <Stack spacing={2}>
            <Typography variant="h5" fontWeight={600}>
              Mô tả khóa học
            </Typography>
            <Typography variant="body1" whiteSpace="pre-line">
              {description}
            </Typography>
          </Stack>

          <Divider />

          {/* Requirements */}
          <Stack spacing={2}>
            <Typography variant="h5" fontWeight={600}>
              Yêu cầu
            </Typography>
            <Typography variant="body1" whiteSpace="pre-line">
              {requirements}
            </Typography>
          </Stack>

          <Divider />

          {/* What You Will Learn */}
          <Stack spacing={2}>
            <Typography variant="h5" fontWeight={600}>
              Bạn sẽ học được gì?
            </Typography>
            <Typography variant="body1" whiteSpace="pre-line">
              {whatYouWillLearn}
            </Typography>
          </Stack>

          <Divider />

          {/* Lessons */}
          <Stack spacing={2}>
            <Typography variant="h5" fontWeight={600}>
              Nội dung khóa học ({lessons.length} bài học)
            </Typography>
            <Stack spacing={2}>
              {lessons.map((lesson: any) => (
                <Paper key={lesson._id} sx={{ p: 2 }}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        bgcolor: "primary.main",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Typography fontSize={"2rem"}>
                        {lesson.orderIndex}
                      </Typography>
                    </Box>
                    <Stack spacing={1} sx={{ flex: 1 }}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Typography variant="subtitle1" fontWeight={600}>
                          {lesson.title}
                        </Typography>
                        {lesson.isFree && (
                          <Chip
                            label="Miễn phí"
                            size="small"
                            color="success"
                            sx={{ height: 20 }}
                          />
                        )}
                      </Stack>
                      <Typography variant="body2" color="text.secondary">
                        {lesson.description}
                      </Typography>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Stack direction="row" spacing={1} alignItems="center">
                          <AccessTimeIcon fontSize="small" />
                          <Typography variant="body2">
                            {lesson.duration} phút
                          </Typography>
                        </Stack>
                        <Typography variant="body2" color="text.secondary">
                          {new Date(lesson.createdAt).toLocaleDateString(
                            "vi-VN"
                          )}
                        </Typography>
                      </Stack>
                    </Stack>
                  </Stack>
                </Paper>
              ))}
            </Stack>
          </Stack>

          <Divider />

          {/* Reviews */}
          <Stack spacing={2}>
            <Typography variant="h5" fontWeight={600}>
              Đánh giá ({reviews.length})
            </Typography>

            {/* Write Review Section */}
            {isEnrolled && !isAuthor && (
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  mb: 3,
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 2,
                }}
              >
                <Stack spacing={2}>
                  <Typography variant="h6" fontWeight={600}>
                    Viết đánh giá của bạn
                  </Typography>

                  <Box>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      Xếp hạng
                    </Typography>
                    <Rating
                      name="review-rating"
                      value={rating}
                      precision={1}
                      onChange={(_, newValue) => setRating(newValue || 0)}
                      size="large"
                    />
                  </Box>

                  <Box>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      Nhận xét của bạn
                    </Typography>
                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Chia sẻ trải nghiệm học tập của bạn với khóa học này..."
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                        },
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: "var(--toastify-color-info) !important",
                        },
                      }}
                      disabled={submitting}
                    />
                  </Box>

                  <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                    <Button
                      variant="contained"
                      disabled={rating === 0 || !content.trim()}
                      onClick={handleSubmitReview}
                      sx={{ minWidth: 120 }}
                    >
                      Gửi đánh giá
                    </Button>
                  </Box>
                </Stack>
              </Paper>
            )}
            <Stack spacing={3}>
              {sortedReviews.map((review: any) => (
                <Paper key={review._id} sx={{ p: 2 }}>
                  <Stack spacing={2}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar src={review.user[0]?.avatarUrl}>
                        {review.user[0]?.name.charAt(0)}
                      </Avatar>
                      <Stack>
                        <Typography variant="subtitle1" fontWeight={600}>
                          {review.user[0]?.name}
                        </Typography>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Rating value={review.rating} size="small" readOnly />
                          <Typography variant="caption" color="text.secondary">
                            {new Date(review.createdAt).toLocaleDateString(
                              "vi-VN"
                            )}
                          </Typography>
                        </Stack>
                      </Stack>
                    </Stack>
                    <Typography variant="body1">{review.comment}</Typography>
                  </Stack>
                </Paper>
              ))}
            </Stack>
          </Stack>
        </Stack>
      </Section>
    </>
  );
}
