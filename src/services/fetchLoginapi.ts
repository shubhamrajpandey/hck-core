import toast from "react-hot-toast";
import { axiosInstance } from "@/services/axiosInstance";
import Cookies from "js-cookie";

type FormData = {
  email: string;
  password: string;
  rememberMe: boolean;
};

export async function FetchLoginapi(
  isChecked: boolean,
  Loginvalue: FormData
) {
  const toastId = toast.loading("Logging you in...");
  

  try {
    const res = await axiosInstance.post(`/auth/login`, Loginvalue, {
      withCredentials: isChecked,
      headers: { "content-type": "application/json" },
    });

    if (res.status === 200 && res.data?.data?.token) {

      const token = res.data.data.token;
      if (isChecked) {
        Cookies.set("token", token);
      } else {
        sessionStorage.setItem("token", token);
      }
      return true;
    }
  } catch (e: unknown) {
    const error = e as {
      response?: { status?: number; data?: { message?: string } };
    };

    if (error.response?.status === 401) {
      toast.error("Please check your credentials.", { id: toastId });
    } else {
      toast.error(error.response?.data?.message || "Cannot fetch the data", {
        id: toastId,
      });
    }
  }
}
