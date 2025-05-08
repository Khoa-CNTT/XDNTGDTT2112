import axios from "@/configs/axiosConfig";

export const getPaymentUrl = async (data: object) => {
  try {
    const result = await axios.post("/order/create_payment_url", data);
    return result.data;
  } catch (error) {
    console.error(error);
  }
};

export const getResultPayment = async (params: URLSearchParams) => {
  try {
    const result = await axios.get(`/order/vnpay_return?${params.toString()}`);
    return result.data;
  } catch (error) {
    console.error(error);
  }
};
