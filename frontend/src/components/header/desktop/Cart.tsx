// Icons
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

// React
import { useState } from "react";

// Components
import Image from "@/components/common/Image";

// MUI
import Box from "@mui/material/Box";
import Badge from "@mui/material/Badge";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { Stack, Tooltip, Typography } from "@mui/material";
import { OneLineTypography, TwoLineTypography } from "@/components/typography";
import { Link } from "react-router-dom";
import { useAppSelector } from "@/hooks/useStore";
import { coursesInCartSelector } from "@/features/cart";
import { Course } from "@/types";

export default function Cart() {
  const courses = useAppSelector(coursesInCartSelector);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <>
      <Box>
        <Tooltip title="Giỏ hàng">
          <IconButton onClick={handleClick} size="large" color="inherit">
            <Badge badgeContent={courses.length} color="error">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>
        </Tooltip>
        <Menu
          MenuListProps={{
            sx: { padding: 0 },
          }}
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
        >
          <Stack
            direction={"row"}
            alignItems={"center"}
            gap={1}
            padding={2}
            justifyContent={"space-between"}
          >
            <Typography variant="body1" fontWeight={600}>
              Giỏ hàng của bạn
            </Typography>
            <Link to="/cart" onClick={handleClose}>
              <Typography fontSize={"0.85rem"}>Xem tất cả</Typography>
            </Link>
          </Stack>

          {courses.map((course) => (
            <Link
              to={`/courses/${course._id}`}
              key={course._id}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <MenuItem onClick={handleClose}>
                <CartItem course={course} />
              </MenuItem>
            </Link>
          ))}
          {courses.length === 0 && (
            <Typography
              width={"300px"}
              p={3}
              textAlign={"center"}
              sx={{ opacity: 0.8, fontSize: "0.9rem" }}
            >
              Giỏ hàng trống
            </Typography>
          )}
        </Menu>
      </Box>
    </>
  );
}

function CartItem({ course }: { course: Course }) {
  return (
    <>
      <Stack direction={"row"} gap={1} alignItems={"flex-start"}>
        <Box
          sx={{
            width: "70px",
            position: "relative",
            aspectRatio: "1/1",
            borderRadius: 1,
            overflow: "hidden",
          }}
        >
          <Image
            src={course.thumbnail || "/images/image-placeholder.png"}
            fill
          />
        </Box>
        <Stack direction={"column"} gap={"6px"}>
          <TwoLineTypography sx={{ fontSize: "0.9rem" }} variant="body1">
            {course.title}
          </TwoLineTypography>

          <Stack>
            <OneLineTypography variant="body1">
              {course.instructor?.[0]?.name}
            </OneLineTypography>
            <Stack direction={"row"} gap={1} alignItems={"center"}>
              <Typography
                sx={{ fontSize: "0.9rem" }}
                variant="body1"
                fontWeight={600}
              >
                {course.price?.toLocaleString("vi-VN")}₫
              </Typography>
              {course.discountPrice && (
                <Typography
                  sx={{ textDecoration: "line-through" }}
                  variant="body1"
                  fontSize={"0.75rem"}
                >
                  {course.discountPrice?.toLocaleString("vi-VN")}₫
                </Typography>
              )}
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </>
  );
}
