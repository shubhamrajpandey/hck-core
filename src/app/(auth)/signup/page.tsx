"use client";

import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import Image from "next/image";
import Link from "next/link";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { axiosInstance } from "@/services/axiosInstance";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Toaster, toast } from "react-hot-toast";
import { motion } from "framer-motion";
import SubjectDropdown from "@/components/dropdown/SubjectDropdown";

interface FormInput {
	UserName: string;
	email: string;
	password: string;
	confirmPassword: string;
	terms: boolean;
	facultyId: number;
}

const Signin: React.FC = () => {
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	const router = useRouter();

	const {
		register,
		handleSubmit,
		watch,
		control,
		formState: { errors },
	} = useForm<FormInput>();

	const password = watch("password");
	const confirmPassword = watch("confirmPassword");
	const isMatching = password === confirmPassword;

	const onSubmit = async (data: FormInput) => {
		if (!isMatching) {
			toast.error("Passwords do not match");
			return;
		}

		const payload = {
			username: data.UserName,
			email: data.email,
			password: data.password,
			facultyId: data.facultyId,
		};

		const toastId = toast.loading("Registering your account...");

		try {
			const response = await axiosInstance.post(
				"/auth/register/student",
				payload
			);
			console.log("Registered:", response.data);
			toast.success("Successfully registered!", { id: toastId });
			router.push("/login");
		} catch (error: unknown) {
			if (axios.isAxiosError(error)) {
				console.error("Axios Error:", error.response?.data);
				toast.error(error.response?.data?.message || "Registration Failed", {
					id: toastId,
				});
			} else {
				console.error("Unknown Error:", error);
				toast.error("An unexpected error occurred", { id: toastId });
			}
		}
	};

	return (
		<div className="flex flex-1 items-center justify-center bg-white pt-20">
			<Toaster
				position="top-center"
				reverseOrder={false}
			/>
			<div className="container flex justify-center lg:justify-between mx-auto">
				{/* Form */}
				<div className="md:w-fit w-full p-5 md:p-10 flex flex-col justify-center">
					<h1 className="text-3xl md:text-4xl font-medium mb-3 md:mb-8">
						Create your Account
					</h1>

					<form
						onSubmit={handleSubmit(onSubmit)}
						className="flex flex-col gap-4">
						{/* Username */}
						<div className="flex flex-col">
							<label className="font-medium">
								Username <span className="text-red-600">*</span>
							</label>
							<input
								type="text"
								{...register("UserName", {
									required: "Please enter your full name",
								})}
								className="md:w-[415px] md:h-[60px] w-full h-auto mt-1 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none"
							/>
							{errors.UserName && (
								<span className="text-red-500 text-xs mt-1">
									{errors.UserName.message}
								</span>
							)}
						</div>

						{/* Email */}
						<div className="flex flex-col">
							<label className="font-medium">
								Email <span className="text-red-600">*</span>
							</label>
							<motion.input
								layoutId="email"
								type="email"
								{...register("email", {
									required: "Email is required",
									pattern: {
										value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
										message: "Invalid email format",
									},
								})}
								className="md:w-[415px] md:h-[60px] w-full h-auto mt-1 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none"
							/>
							{errors.email && (
								<span className="text-red-500 text-xs mt-1">
									{errors.email.message}
								</span>
							)}
						</div>

						{/* Faculty Dropdown */}
						<div className="flex flex-col">
							<label className="font-medium">
								Choose Faculty <span className="text-red-600">*</span>
							</label>
							<Controller
								name="facultyId"
								control={control}
								rules={{ required: "Faculty is required" }}
								render={({ field }) => (
									<SubjectDropdown
										value={field.value}
										onChange={field.onChange}
									/>
								)}
							/>
							{errors.facultyId && (
								<span className="text-red-500 text-xs mt-1">
									{errors.facultyId.message}
								</span>
							)}
						</div>

						{/* Password */}
						<div className="flex flex-col relative">
							<label className="font-medium">
								Password <span className="text-red-600">*</span>
							</label>
							<motion.input
								layoutId="password"
								type={showPassword ? "text" : "password"}
								{...register("password", { required: true })}
								className="md:w-[415px] md:h-[60px] w-full h-auto mt-1 px-4 py-3 pr-10 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none"
							/>
							<button
								type="button"
								onClick={() => setShowPassword(!showPassword)}
								className="absolute right-3 top-11 md:top-12 text-gray-500 hover:text-gray-700">
								{showPassword ? <FiEyeOff /> : <FiEye />}
							</button>
							{errors.password && (
								<span className="text-red-500 text-xs mt-1">
									Password is required
								</span>
							)}
						</div>

						{/* Confirm Password */}
						<div className="flex flex-col relative">
							<label className="font-medium">
								Confirm Password <span className="text-red-600">*</span>
							</label>
							<input
								type={showConfirmPassword ? "text" : "password"}
								{...register("confirmPassword", { required: true })}
								className="md:w-[415px] md:h-[60px] w-full h-auto mt-1 px-4 py-3 pr-10 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none"
							/>
							<button
								type="button"
								onClick={() => setShowConfirmPassword(!showConfirmPassword)}
								className="absolute right-3 top-11 md:top-12 text-gray-500 hover:text-gray-700">
								{showConfirmPassword ? <FiEyeOff /> : <FiEye />}
							</button>
							{errors.confirmPassword && (
								<span className="text-red-500 text-xs mt-1">
									Confirm Password is required
								</span>
							)}
						</div>

						{/* Password mismatch warning */}
						{!isMatching && (
							<span className="text-red-600 text-xs">
								Passwords do not match
							</span>
						)}

						{/* Terms */}
						<div className="flex items-center gap-2">
							<input
								type="checkbox"
								id="terms"
								{...register("terms", {
									required: "You must accept the terms and policy",
								})}
								className="w-4 h-4 cursor-pointer accent-green-500"
							/>
							<label
								htmlFor="terms"
								className="text-sm">
								I accept terms and policy
							</label>
						</div>
						{errors.terms && (
							<span className="text-red-500 text-xs">
								{errors.terms.message}
							</span>
						)}

						{/* Signup button */}
						<button
							type="submit"
							className="bg-primary text-white py-3 rounded-lg font-medium hover:bg-green-600 transition md:w-[415px] md:h-[60px] w-full h-auto cursor-pointer">
							Sign Up
						</button>

						{/* Divider */}
						<div className="flex items-center gap-3">
							<div className="flex-1 border-t border-gray-300"></div>
							<span className="text-sm text-gray-500">Or Continue with</span>
							<div className="flex-1 border-t border-gray-300"></div>
						</div>

						{/* Link to login */}
						<p className="text-sm text-center mt-2">
							Already have an account?{" "}
							<Link
								href="/login"
								className="text-primary hover:underline">
								Log in
							</Link>
						</p>
					</form>
				</div>

				{/* Side illustration */}
				<div className="hidden relative w-1/2 lg:flex items-center justify-center p-5 md:w-[500px] min-w-[300px] h-[300px] md:h-[500px]">
					<Image
						src="/imgs/ui/sign-up.svg"
						alt="Signup Illustration"
						fill
						className="object-contain mt-15 mr-20"
						priority
					/>
				</div>
			</div>
		</div>
	);
};

export default Signin;
