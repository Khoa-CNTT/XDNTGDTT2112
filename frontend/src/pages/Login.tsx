// React
import React, { useState } from "react";

// React router
import { Link, useNavigate, useSearchParams } from "react-router-dom";

// Icons
import GoogleIcon from "@mui/icons-material/Google";
import FacebookIcon from "@mui/icons-material/Facebook";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

// MUI
import {
  Box,
  Button,
  Divider,
  IconButton,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";

// React Toastify
import { toast } from "react-toastify";

// Components
import Section from "@/components/common/Section";

// Login facebook and google
import FacebookLogin from "react-facebook-login";
import { useGoogleLogin } from "@react-oauth/google";

// Services
import { login } from "@/services/authService";

// Redux
import { setAccountLoggedIn } from "@/features/account";
import { useAppDispatch } from "@/hooks/useStore";
import { syncCart } from "@/utils/syncCart";

// Types
type UserInfoFacebook = {
  status?: "unknown";
  accessToken: string;
  data_access_expiration_time: number;
  expiresIn: number;
  graphDomain: string;
  name: string;
  signedRequest: string;
  userID: string;
  id?: string;
  error?: {
    code: number;
    fbtrace_id: string;
    message: string;
    type: string;
  };
};

const Login: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [showPassword, setShowPassword] = useState(false);

  const isDark = theme.palette.mode === "dark";

  const [searchParams] = useSearchParams();

  const redirectUrl = searchParams.get("redirectUrl");

  const handleShowPassword = () => setShowPassword((prev) => !prev);

  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const dataRes = (await login({
          googleAccessToken: tokenResponse.access_token,
          provider: "google",
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        })) as any;

        // Error is thrown by axios
        if (dataRes.statusCode === "ERR_NETWORK") {
          toast.error("Đã xảy ra lỗi!");
          return;
        }

        if (dataRes.statusCode === 200) {
          await syncCart();
          dispatch(setAccountLoggedIn(dataRes.data));
          navigate(redirectUrl ?? "/");
          toast.success("Đăng nhập thành công!");
          return;
        } else {
          toast.error(dataRes.message);
        }
      } catch (error) {
        console.error("Error :", error);
        toast.error("Đã xảy ra lỗi");
      }
    },
    onError: (error) => {
      console.error("Login Failed:", error);
      toast.error("Đã xảy ra lỗi");
    },
  });

  const handleLoginWithLocalLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const PATTERNS = {
      EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{6,24}$/,
    };
    if (!email || email.trim() === "") {
      toast.error("Vui lòng nhập email!");
      return;
    } else if (!PATTERNS.EMAIL.test(email)) {
      toast.error("Email không hợp lệ!");
      return;
    }

    if (!password || password.trim() === "") {
      toast.error("Vui lòng nhập mật khẩu!");
      return;
    }
    // } else if (!PATTERNS.PASSWORD.test(password)) {
    //   toast.error(
    //     'Mật khẩu phải từ 6-24 ký tự và bao gồm ít nhất 1 chữ thường, 1 chữ hoa và 1 ký tự đặc biệt!'
    //   );
    //   return;
    // }

    try {
      const dataRes = (await login({
        email,
        password,
        provider: "local",
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      })) as any;

      // Error is thrown by axios
      if (dataRes.statusCode === "ERR_NETWORK") {
        toast.error("Đã xảy ra lỗi!");
        return;
      }
      if (dataRes.statusCode !== 200) {
        if (dataRes?.errors?.email) toast.error(dataRes.errors.email.message);
        else if (dataRes?.errors?.password)
          toast.error(dataRes.errors.password.message);
        else toast.error(dataRes.message);
        return;
      }
      await syncCart();
      dispatch(setAccountLoggedIn(dataRes.data));
      navigate(redirectUrl ?? "/");
      toast.success("Đăng nhập thành công!");
    } catch (error) {
      console.error("Error :", error);
      toast.error("Đã xảy ra lỗi");
    }
  };

  const loginWithFacebookCallback = async (userInfo: UserInfoFacebook) => {
    if (userInfo?.status === "unknown" || userInfo?.error) {
      return;
    }
    try {
      const dataRes = (await login({
        facebookAccessToken: userInfo.accessToken,
        provider: "facebook",
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      })) as any;

      // Error is thrown by axios
      if (dataRes.statusCode === "ERR_NETWORK") {
        toast.error("Đã xảy ra lỗi!");
        return;
      }

      if (dataRes.statusCode === 200) {
        await syncCart();
        dispatch(setAccountLoggedIn(dataRes.data));
        navigate(redirectUrl ?? "/");
        toast.success("Đăng nhập thành công!");
      } else {
        toast.error(dataRes.message);
      }
    } catch (error) {
      console.error("Error :", error);
      toast.error("Đã xảy ra lỗi");
    }
  };

  return (
    <Section
      sx={{
        mt: "96px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          bgcolor: isDark
            ? "rgba(33, 33, 33, 0.9)"
            : "rgba(255, 255, 255, 0.9)",
          p: { xs: 3, sm: 4 },
          borderRadius: 2,
          boxShadow: 5,
          width: "100%",
          maxWidth: 400,
          textAlign: "center",
          backdropFilter: "blur(6px)",
        }}
      >
        <Typography variant="h5" fontWeight="bold" mb={2}>
          Đăng nhập
        </Typography>

        <Box
          component="form"
          onSubmit={handleLoginWithLocalLogin}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <TextField
            name="email"
            label="Email"
            type="email"
            fullWidth
            variant="outlined"
            InputProps={{
              style: {
                backgroundColor: isDark ? "#424242" : "white",
                color: isDark ? "white" : "black",
              },
            }}
            InputLabelProps={{ style: { color: isDark ? "#e0e0e0" : "#666" } }}
          />
          <Box sx={{ position: "relative" }}>
            <TextField
              name="password"
              label="Mật khẩu"
              type={showPassword ? "text" : "password"}
              fullWidth
              variant="outlined"
              InputProps={{
                style: {
                  backgroundColor: isDark ? "#424242" : "white",
                  color: isDark ? "white" : "black",
                },
              }}
              InputLabelProps={{
                style: { color: isDark ? "#e0e0e0" : "#666" },
              }}
            />
            <IconButton
              onClick={handleShowPassword}
              sx={{
                position: "absolute",
                right: 8,
                top: "50%",
                transform: "translateY(-50%)",
                color: isDark ? "grey.300" : "grey.500",
              }}
            >
              {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
            </IconButton>
          </Box>

          <Link to="/forgot-password">
            <Typography
              variant="body2"
              sx={{
                textAlign: "right",
                color: isDark ? "#BB86FC" : "#6200EA",
                textDecoration: "none",
                cursor: "pointer",
                "&:hover": { textDecoration: "underline" },
              }}
            >
              Quên mật khẩu?
            </Typography>
          </Link>

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              bgcolor: "#d32f2f",
              "&:hover": { bgcolor: "#b71c1c" },
              py: 1.5,
              color: "white",
              fontWeight: "bold",
              textTransform: "none",
            }}
          >
            Đăng nhập
          </Button>
        </Box>

        <Box sx={{ my: 3, position: "relative" }}>
          <Divider sx={{ bgcolor: isDark ? "grey.600" : "grey.300" }} />
          <Typography
            variant="body2"
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              bgcolor: isDark ? "rgba(33, 33, 33, 0.9)" : "white",
              px: 2,
              color: isDark ? "grey.300" : "grey.500",
            }}
          >
            Hoặc đăng nhập với
          </Typography>
        </Box>

        <Stack spacing={2}>
          <Box
            sx={{
              "&  .fb-button": {
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                paddingBlock: "12px",
                borderRadius: "4px",
                gap: "8px",
                cursor: "pointer",
                fontWeight: 600,
                border: "none",
                color: "white",
                background: isDark ? "#424242" : "#023e8a",
              },
            }}
          >
            <FacebookLogin
              appId={import.meta.env.VITE_FACEBOOK_APP_ID}
              autoLoad={false}
              callback={loginWithFacebookCallback}
              icon={<FacebookIcon fontSize="medium" />}
              textButton="Tiếp tục với Facebook"
              cssClass="fb-button"
            />
          </Box>
          <Button
            onClick={() => loginWithGoogle()}
            fullWidth
            variant="outlined"
            startIcon={<GoogleIcon fontSize="large" />}
            sx={{
              // bgcolor: isDark ? '#424242' : 'white',
              color: isDark ? "white" : "black",
              borderColor: isDark ? "grey.600" : "grey.300",
              "&:hover": {
                bgcolor: isDark ? "grey.600" : "grey.100",
              },
              textTransform: "none",
              py: 1.5,
            }}
          >
            Tiếp tục với Google
          </Button>
        </Stack>

        <Typography
          variant="body2"
          sx={{ mt: 2, color: isDark ? "grey.300" : "grey.600" }}
        >
          Chưa có tài khoản?{" "}
          <Link
            to={`/sign-up${redirectUrl ? `?redirectUrl=${redirectUrl}` : ""}`}
            style={{
              color: isDark ? "#BB86FC" : "#6200EA",
              textDecoration: "none",
            }}
          >
            Đăng ký
          </Link>
        </Typography>
      </Box>
    </Section>
  );
};

export default Login;
