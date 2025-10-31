import toast from "react-hot-toast";
import { axiosInstance } from "@/services/axiosInstance";

type FormData = {
  email: string;
  password: string;
  rememberMe: boolean;
};

export async function FetchLoginapi(isChecked: boolean, Loginvalue: FormData) {
  const toastId = toast.loading("Logging you in...");

  try {
    const res = await axiosInstance.post(`/auth/login`, Loginvalue, {
      withCredentials: isChecked,
      headers: { "content-type": "application/json" },
    });

    if (res.status === 200 && res.data?.data?.token) {
      const token = res.data.data.token;
      const role = res.data.data.info.role;

      // store token
      if (isChecked) {
        localStorage.setItem("token", token);
        localStorage.setItem("Role",role);

      } else {
        sessionStorage.setItem("token", token);
        sessionStorage.setItem("Role",role);
      }

      // decode JWT payload
      const payload = JSON.parse(atob(token.split(".")[1]));

      // trigger event (optional, for global auth listeners)
      window.dispatchEvent(new Event("userLoggedIn"));

      toast.success("Logged in Successfully", { id: toastId });

      // return both role + token + full info
      return {
        role: payload.role,
        token,
        info: res.data.data.info,
      };
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
