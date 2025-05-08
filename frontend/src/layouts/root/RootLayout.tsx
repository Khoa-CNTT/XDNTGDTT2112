/* eslint-disable @typescript-eslint/no-explicit-any */
// react-router
import { Outlet, ScrollRestoration } from "react-router-dom";

// components
import Header from "@/components/header/Header";

// Notification
import { ToastContainer, Bounce } from "react-toastify";

// Hooks
import { useTheme } from "@/hooks/useTheme";

// MUI
import { CssBaseline, ThemeProvider } from "@mui/material";

// Stores
import { getTheme } from "@/theme";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { isLoggedInSelector } from "@/features/account";
import { getEnrollments } from "@/services/enrollmentService";
import { setEnrollments } from "@/features/account/accountSlice";
import { getCart } from "@/services/cartService";
import { replaceCart } from "@/features/cart";
import ChatWidget from "@/components/chatbot/ChatWidget";

export default function RootLayout() {
  const { themeMode } = useTheme();
  const dispatch = useAppDispatch();
  const isLoggedIn = useAppSelector(isLoggedInSelector);

  useEffect(() => {
    if (!isLoggedIn) return;

    async function fetchEnrollmentsAndSyncCart() {
      try {
        const res = await getEnrollments();
        dispatch(setEnrollments(res.data ?? []));
      } catch (error) {
        console.error(error);
      }
    }

    fetchEnrollmentsAndSyncCart();
  }, [isLoggedIn, dispatch]);

  useEffect(() => {
    if (!isLoggedIn) return;

    async function fetchCart() {
      try {
        const newCart = (await getCart()).data
          ?.map((item: any) => item.course?.[0])
          .filter((item: any) => item !== undefined);
        dispatch(replaceCart(newCart ?? []));
      } catch (error) {
        console.error(error);
      }
    }
    fetchCart();
  }, [isLoggedIn, dispatch]);

  const isDarkMode = themeMode === "dark";
  const theme = getTheme(themeMode);

  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ScrollRestoration />
        <Header />
        <Outlet />
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme={isDarkMode ? "dark" : "light"}
          transition={Bounce}
        />
        <ChatWidget />
      </ThemeProvider>
    </>
  );
}
