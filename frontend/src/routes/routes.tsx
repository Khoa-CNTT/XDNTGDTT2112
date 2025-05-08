// React router
import { createBrowserRouter } from "react-router-dom";

// Layouts
import RootLayout, { loader as rootLoader } from "@/layouts/root/index";

// Pages
import Home from "@/pages/home";
import DashboardLayout from "@/pages/dashboard/Layout";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    loader: rootLoader,
    children: [
      {
        index: true,
        element: <Home />,
        // loader: homeLoader,
      },
      {
        path: "/login",
        lazy: async () => {
          const { default: Component } = await import("@pages/Login");
          return { Component };
        },
      },
      {
        path: "/sign-up",
        lazy: async () => {
          const { default: Component } = await import("@pages/SignUp");
          return { Component };
        },
      },
      {
        path: "/cart",
        lazy: async () => {
          const { default: Component } = await import("@pages/Cart");
          return { Component };
        },
      },
      {
        path: "/courses/:courseId",
        lazy: async () => {
          const { default: Component, loader } = await import(
            "@/pages/course-details"
          );
          return { Component, loader };
        },
      },
      {
        path: "/learning/:courseSlug",
        lazy: async () => {
          const { default: Component } = await import("@/pages/Learning");
          return { Component };
        },
      },
      {
        path: "/forgot-password",
        lazy: async () => {
          const { default: ForgotPasswordPage } = await import(
            "@pages/ForgotPassword"
          );
          return { Component: ForgotPasswordPage };
        },
      },
      {
        path: "/profile",
        lazy: async () => {
          const { default: Component } = await import("@pages/Profile");
          return { Component };
        },
      },
      {
        path: "/change-password",
        lazy: async () => {
          const { default: Component } = await import(
            "@pages/profile/ChangePassword"
          );
          return { Component };
        },
      },
      {
        path: "/my-learning",
        lazy: async () => {
          const { default: Component } = await import(
            "@/pages/my-learning/MyLearning"
          );
          return { Component };
        },
      },
      {
        path: "/instructor",
        lazy: async () => {
          const { default: Component } = await import(
            "@/pages/instructor/Instructor"
          );
          return { Component };
        },
      },
      {
        path: "/search",
        lazy: async () => {
          const { default: Component } = await import(
            "@/pages/SearchResultPage"
          );
          return { Component };
        },
      },
      {
        path: "/categories",
        children: [
          {
            path: ":categorySlug1",
            lazy: async () => {
              const { default: Component } = await import("@/pages/Category");
              return { Component };
            },
            children: [
              {
                path: ":categorySlug2",
                lazy: async () => {
                  const { default: Component } = await import(
                    "@/pages/Category"
                  );
                  return { Component };
                },
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: "/dashboard",
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: <>Dash board helo</>,
      },
      {
        path: "user-management",
        lazy: async () => {
          const { default: Component } = await import(
            "@pages/dashboard/user/User"
          );
          return { Component };
        },
      },
      {
        path: "course-management",
        lazy: async () => {
          const { default: Component } = await import(
            "@pages/dashboard/course/Course"
          );
          return { Component };
        },
      },
      {
        path: "payment-management",
        lazy: async () => {
          const { default: Component } = await import(
            "@pages/dashboard/payment/Payment"
          );
          return { Component };
        },
      },
    ],
  },
]);

export default router;
