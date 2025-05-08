/* eslint-disable @typescript-eslint/no-explicit-any */
import { getPaymentUrl, getResultPayment } from "@/services/checkoutService";
import {
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { isLoggedInSelector } from "@/features/account";
import { replaceCart } from "@/features/cart";
import { getEnrollments } from "@/services/enrollmentService";
import { setEnrollments } from "@/features/account/accountSlice";

export default function Checkout() {
  const [bankCode, setBankCode] = useState("VNBANK");
  const [searchParams] = useSearchParams();

  const isLoggedIn = useAppSelector(isLoggedInSelector);

  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  useEffect(() => {
    const vnp_ResponseCode = searchParams.get("vnp_ResponseCode");
    if (vnp_ResponseCode === "00") {
      handleAfterPayment(window.location.href);
    }
  }, []);

  const handlePay = async () => {
    if (isLoggedIn) {
      const res: any = await getPaymentUrl({
        bankCode,
      });
      window.open(res.data.url, "_self");
    } else {
      navigate(`/login?redirectUrl=/cart`);
    }
  };

  const handleAfterPayment = async (href: string) => {
    const params = new URL(href).searchParams;
    const res: any = await getResultPayment(params);

    if (res.statusCode !== 200) {
      toast.error(res.message);
      return;
    }

    async function fetchEnrollmentsAndSyncCart() {
      try {
        const res = await getEnrollments();
        dispatch(setEnrollments(res.data ?? []));
      } catch (error) {
        console.error(error);
      }
    }
    await fetchEnrollmentsAndSyncCart();
    toast.success("Thanh toán thành công");
    dispatch(replaceCart([]));
    navigate("/");
  };

  const handleChangeBankCode = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBankCode((event.target as HTMLInputElement).value);
  };

  return (
    <FormControl>
      <FormLabel focused={false} id="controlled-payment-method">
        Chọn phương thức thanh toán:
      </FormLabel>

      <RadioGroup
        aria-labelledby="controlled-payment-method"
        name="bankCode"
        value={bankCode}
        onChange={handleChangeBankCode}
      >
        <FormControlLabel
          value="VNBANK"
          control={<Radio color="default" />}
          label={
            <Stack direction={"row"} gap={1} justifyContent={"space-between"}>
              <Typography>
                Thanh toán qua ATM-Tài khoản ngân hàng nội địa
              </Typography>
              <AccountBalanceIcon />
            </Stack>
          }
        />
        <FormControlLabel
          value="INTCARD"
          control={<Radio color="default" />}
          label={
            <Stack direction={"row"} gap={1} justifyContent={"space-between"}>
              <Typography>Thanh toán qua thẻ quốc tế</Typography>
              <CreditCardIcon />
            </Stack>
          }
        />
      </RadioGroup>
      <Button
        onClick={handlePay}
        variant="contained"
        color="primary"
        size="large"
        fullWidth
        sx={{
          mt: 2,
          py: 1.5,
          textTransform: "none",
          fontWeight: 600,
        }}
      >
        Thanh toán
      </Button>
    </FormControl>
  );
}
