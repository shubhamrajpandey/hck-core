"use client";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FetchLoginapi } from "@/services/auth.service";
import { Eye, EyeOff } from "lucide-react";

type FormData = {
  email: string;
  password: string;
  rememberMe: boolean;
};

export default function Login() {
  const [submitClicked, setSubmitClicked] = useState(false);
  const [remembermeChecked, setremembermeChecked] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    const result = await FetchLoginapi(remembermeChecked, data);

    if (result?.info) {
      const { email, facultyId, id, role } = result.info;
      const token = result.token;

      // Clear old data first
      localStorage.clear();

      // Set new data
      localStorage.setItem("email", email || "");
      localStorage.setItem("facultyId", facultyId || "");
      localStorage.setItem("id", id || "");
      localStorage.setItem("token", token || "");
      localStorage.setItem("role", role || "");

      // Refresh and navigate
      router.refresh();

      if (role === "Admin") {
        router.push("/dashboard");
      } else if (role === "Moderator") {
        router.push("/moderatordashboard");
      } else if (role === "Student") {
        router.push("/programs");
      }
    }
  };

  useEffect(() => {
    if (!submitClicked) return;
    if (Object.keys(errors).length > 0) {
      if (errors.email && errors.password) {
        alert("Fill all the Fields");
      } else if (errors.email) {
        alert(errors.email.message);
      } else if (errors.password) {
        alert(errors.password.message);
      }
    }
  }, [errors, submitClicked]);

  return (
    <div className="flex flex-1 items-center justify-center bg-white pt-20">
      <div className="container flex justify-center lg:justify-between mx-auto">
        <div className="md:w-fit w-full p-5 md:p-10 flex flex-col justify-center">
          <h1 className="text-3xl md:text-4xl font-medium md:font-medium mb-3 md:mb-8">
            Welcome back!
          </h1>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSubmitClicked(true);
              handleSubmit(onSubmit)(e);
            }}
            className="flex flex-col gap-4"
          >
            {/* Email */}
            <div className="flex flex-col">
              <label className="font-normal md:font-medium">
                Email <span className="text-red-600">*</span>
              </label>
              <motion.input
                layoutId="email"
                type="email"
                placeholder="Enter your email address"
                {...register("email", { required: "Email is required" })}
                className="md:w-[415px] md:h-[60px] w-full h-auto mt-1 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none"
              />
            </div>

            {/* Password with show/hide toggle */}
            <div className="flex flex-col relative">
              <label className="font-medium">
                Password <span className="text-red-600">*</span>
              </label>
              <motion.input
                layoutId="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                {...register("password", { required: "Password is required" })}
                className="md:w-[415px] md:h-[60px] w-full h-auto mt-1 px-4 py-3 pr-10 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-11 md:top-12 text-gray-500 hover:text-gray-700 "
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Remember me + forgot password */}
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  {...register("rememberMe")}
                  id="rememberMe"
                  onChange={(e) => setremembermeChecked(e.target.checked)}
                  className="mr-2 rounded-full"
                />
                <label htmlFor="rememberMe">Remember me</label>
              </div>
              <Link href="#" className="text-primary hover:underline">
                Forgot your password?
              </Link>
            </div>

            {/* Login button */}
            <button
              type="submit"
              className="bg-primary text-white py-3 rounded-lg font-medium hover:bg-green-600 transition md:w-[415px] md:h-[60px] w-full h-auto cursor-pointer"
            >
              Login
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 border-t border-gray-300"></div>
              <span className="text-sm text-gray-500">Or Continue with</span>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>

            {/* Microsoft Outlook button */}
            <button
              type="button"
              className="flex items-center justify-center gap-3 border border-gray-400 py-3 rounded-lg md:w-[415px] md:h-[60px] w-full h-auto cursor-pointer"
            >
              <Image
                src="/imgs/msoutlook.jpeg"
                alt="Microsoft Outlook"
                width={38}
                height={38}
              />
              <span className="font-medium">
                Sign in with Microsoft Outlook
              </span>
            </button>

            {/* Signup link */}
            <p className="text-sm text-center mt-2">
              Don’t have an account?{" "}
              <Link href="/signup" className="text-primary hover:underline">
                Sign Up
              </Link>
            </p>
          </form>
        </div>

        {/* Side illustration */}
        <div className="hidden relative w-1/2 lg:flex items-center justify-center p-5 md:w-[500px] min-w-[300px] h-[300px] md:h-[500px]">
          <Image
            src="/imgs/image.png"
            alt="Illustration"
            fill
            className="object-contain mt-15 mr-20"
            priority
          />
        </div>
      </div>
    </div>
  );
}
