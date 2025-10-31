"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios, { AxiosError } from "axios";
import { FiEye, FiEyeOff } from "react-icons/fi";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "react-hot-toast";

interface ModeratorFormInput {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  moderatorKey: string;
  terms: boolean;
}

export default function ModeratorRegisterForm() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<ModeratorFormInput>();

  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);


  const password = watch("password");
  const confirmPassword = watch("confirmPassword");
  const isMatching = password === confirmPassword;

  const onSubmit = async (data: ModeratorFormInput) => {
    if (!isMatching) {
      toast.error("Passwords do not match");
      return;
    }

    const toastId = toast.loading("Registering moderator...");
    setLoading(true);

    try {
      const response = await axios.post(
        "https://herald-hub-backend.onrender.com/auth/register/moderator",
        {
          username: data.username,
          email: data.email,
          password: data.password,
          moderatorKey: data.moderatorKey,
        }
      );

      if (response.status === 201 || response.status === 200) {
        toast.success("Moderator registered successfully!", { id: toastId });
        reset();
        router.push("/login");
      } else {
        toast.error("Registration failed. Try again.", { id: toastId });
      }
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ error: string }>;
      const errMsg =
        axiosError?.response?.data?.error || "Something went wrong";
      toast.error(errMsg, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center flex-grow bg-[#F4F4F4] px-20 py-30">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-around">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-1/3 max-w-md bg-[#F4F4F4] rounded-md font-poppins mt-20"
        >
          <h1 className="text-[38px] tracking-[0.7px] font-medium mb-6 text-center md:text-left">
            Account Registration
          </h1>

          {/* Username */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 text-[16px]">
              Username
            </label>
            <input
              type="text"
              placeholder="Username"
              {...register("username", {
                required: "Please enter your username",
              })}
              className="w-[90%] mt-1 px-4 py-3 rounded-[12px] border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none"
            />
            {errors.username && (
              <span className="text-red-500 text-xs mt-1 block">
                {errors.username.message}
              </span>
            )}
          </div>

    

       

          {/* Password */}
          <div className="mb-4 relative w-[90%]">
            <label className="block text-sm font-medium mb-1 text-[16px]">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Choose a password"
              {...register("password", { required: true })}
              className="w-full mt-1 px-4 py-3 rounded-[12px] border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none pr-10"
            />
            <div
              className="absolute right-3 top-[48px] cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </div>
            {errors.password && (
              <span className="text-red-500 text-xs mt-1 block">
                Password is required
              </span>
            )}
          </div>

          {/* Confirm Password */}
          <div className="mb-4 relative w-[90%]">
            <label className="block text-sm font-medium mb-1 text-[16px]">
              Confirm Password
            </label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm your password"
              {...register("confirmPassword", { required: true })}
              className="w-full mt-1 px-4 py-3 rounded-[12px] border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none pr-10"
            />
            <div
              className="absolute right-3 top-[48px] cursor-pointer"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
            </div>
            {errors.confirmPassword && (
              <span className="text-red-500 text-xs mt-1 block">
                Confirm Password is required
              </span>
            )}
          </div>

          {/* Password Match Check */}
          {!isMatching && (
            <span className="text-red-600 text-xs block mb-4">
              Passwords do not match
            </span>
          )}

          {/* Checkbox */}
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="terms"
              {...register("terms", {
                required: "You must accept the terms and policy",
              })}
              className="w-4 h-4 cursor-pointer accent-green-500"
            />
            <label htmlFor="terms" className="text-sm ml-2.5">
              I accept terms and policy
            </label>
          </div>
          {errors.terms && (
            <span className="text-red-500 text-xs mb-2 block">
              {errors.terms.message}
            </span>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-[90%] bg-[#74BF44] text-white py-3 rounded-[12px] text-sm font-semibold cursor-pointer hover:bg-green-600"
            disabled={loading}
          >
            {loading ? "Registering..." : "Sign Up"}
          </button>

          {/* Login Link */}
          <p className="text-sm py-6 text-center">
            Already have an account?{" "}
            <Link href="/moderatorsignin" className="text-green-600 hover:underline">
              Log in
            </Link>
          </p>
        </form>

        {/* Right Side Image */}
        <div className="hidden md:block">
          <Image
            src="/imgs/sign-up.svg"
            alt="Moderator Illustration"
            width={700}
            height={600}
            className="w-full h-auto max-w-2xl"
          />
        </div>
      </div>
    </div>
  );
}
