// MUI
import Box from "@mui/material/Box";
import { Button, Stack } from "@mui/material";

// React router
import { Link } from "react-router-dom";

// Components
import Dropdown from "./Dropdown";
import Image from "@components/common/Image";
import SearchBar from "@components/common/SearchBar";
import ToggleThemeMode from "@/components/common/ToggleThemeMode";
import Cart from "./Cart";
import Notification from "./Notification";
import Profile from "./Profile";

// Hooks
import { useAppSelector } from "@/hooks/useStore";
import { useQuery } from "@tanstack/react-query";

// Selectors
import { isLoggedInSelector, userSelector } from "@/features/account";

// Services
import { getCategories } from "@/services/categoryService";

// Types
import { Category } from "@/types";

export default function DesktopHeader() {
  const isLoggedIn = useAppSelector(isLoggedInSelector);
  const user = useAppSelector(userSelector);

  const { data: res } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const categories = res?.data || [];

  console.log(categories);

  return (
    <Stack direction={"row"} alignItems="center" gap={8} sx={{ width: "100%" }}>
      <Stack direction={"row"} spacing={3} alignItems="center">
        <>
          {/* Logo */}
          <Link to={"/"}>
            <Box
              sx={{
                position: "relative",
                width: "120px",
                aspectRatio: "2/1",
                mt: "-5px !important",
              }}
            >
              <Image
                style={{ objectFit: "contain" }}
                src="/icons/dark-logo.svg"
                alt="Logo"
                fill={true}
              />
            </Box>
          </Link>

          {/* Categories */}
          {categories && (
            <Dropdown categories={(categories as Category[]) || []} />
          )}
        </>
      </Stack>

      {/* Search */}
      <SearchBar sx={{ flexGrow: 1 }} />

      <Stack direction={"row"} gap={1} alignItems={"center"}>
        {/* Them mode */}
        <ToggleThemeMode />

        {/* Cart */}
        {user?.role !== "admin" && <Cart />}

        {/* Notifications */}
        {isLoggedIn && <Notification />}

        {/* Profile */}
        {isLoggedIn && <Profile />}

        {/*  */}
        {!isLoggedIn && (
          <>
            <Link
              style={{ textDecoration: "none", color: "inherit" }}
              to={"/sign-up"}
            >
              <Button variant="outlined">Đăng ký</Button>
            </Link>
            <Link
              style={{ textDecoration: "none", color: "inherit" }}
              to={"/login"}
            >
              <Button variant="contained">Đăng nhập</Button>
            </Link>
          </>
        )}
      </Stack>
    </Stack>
  );
}
