"use client";

import { useState } from "react";
import { axiosInstance } from "@/services/axiosInstance";
import toast from "react-hot-toast";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function InviteModeratorForm() {
  const [isChecked, setisChecked] = useState(false);
  const router = useRouter();
  useEffect(() => {
    const StoredToken =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    const RoleSelected =
      localStorage.getItem("Role") || sessionStorage.getItem("Role");
    if (RoleSelected !== "Admin" || !StoredToken) {
      router.push("/");
    }
    setisChecked(true);
  }, [router]);
  const [email, setEmail] = useState("");
  const [expiryDays, setExpiryDays] = useState("");

  const handleInvite = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) return toast.error("Email is required");
    if (!expiryDays) return toast.error("Expiry days is required");

    const toastId = toast.loading("Sending invite...");

    try {
      await axiosInstance.post("/auth/invite/moderator", {
        email,
        expiryDays: Number(expiryDays),
      });

      toast.success("Invitation sent successfully!", { id: toastId });
      setEmail("");
      setExpiryDays("");
    } catch (err: unknown) {
      if (err && typeof err === "object" && "response" in err) {
        const axiosErr = err as { response?: { data?: { message?: string } } };
        toast.error(
          axiosErr.response?.data?.message || "Failed to send invite",
          { id: toastId }
        );
      } else {
        toast.error("Something went wrong", { id: toastId });
      }
    }
  };

  return (
    <>
      {isChecked && (
        <div className="flex items-center justify-center min-h-screen bg-[#F4F4F4]">
          <motion.form
            onSubmit={handleInvite}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="space-y-6 p-10 border border-gray-300 rounded-lg shadow-lg w-full max-w-[480px] bg-white"
          >
            <h1 className="text-[26px] font-[500]">
              Invite{" "}
              <span className="text-[#74BF44] font-[600]">Moderator</span>
            </h1>

            <div>
              <label className="text-[17px] font-[400] text-gray-700">
                Moderator Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter moderator's email"
                className="w-[400px] h-[50px] border border-gray-300 rounded-lg px-4 py-2 mt-3 focus:ring-2 focus:ring-green-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="text-[17px] font-[400] text-gray-700">
                Expiry Days <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={expiryDays}
                onChange={(e) => setExpiryDays(e.target.value)}
                placeholder="Enter number of days"
                className="w-[400px] h-[50px] border border-gray-300 rounded-lg px-4 py-2 mt-3 focus:ring-2 focus:ring-green-500 outline-none"
                required
                min={1}
              />
            </div>

            <button
              type="submit"
              className="w-[400px] h-[50px] bg-[#74BF44] text-white font-semibold py-2 mt-6 rounded-lg hover:bg-green-700 transition"
            >
              Send Invite
            </button>
          </motion.form>
        </div>
      )}
    </>
  );
}
