import axios from "@/configs/axiosConfig";

// Types
import { User } from "@/types";

interface CommonResponse {
  statusCode: number;
  statusText: string;
  message: string;
}

interface LoginResponse extends CommonResponse {
  data?: User;
  errors?: Record<string, { field: string; message: string }>;
}

interface RegisterResponse extends CommonResponse {
  data?: User;
  errors?: Record<string, { field: string; message: string }>;
}

export const login = async (data: object) => {
  try {
    const result = await axios.post("/login", data);
    return result.data as LoginResponse;
  } catch (error) {
    console.error("Error during login:", error);
  }
};

export const register = async (data: object) => {
  try {
    const result = (await axios.post("/register", data)) as RegisterResponse;
    return result.data;
  } catch (error) {
    console.error("Error during registration:", error);
  }
};

export const verifyToken = async () => {
  try {
    const res = await axios.post("/verify-token");
    return res.data;
  } catch (error) {
    console.error("Error verifying token:", error);
  }
};

export const logout = async () => {
  try {
    const res = await axios.post("/logout");
    return res.data;
  } catch (error) {
    console.error("Error logging out:", error);
  }
};
