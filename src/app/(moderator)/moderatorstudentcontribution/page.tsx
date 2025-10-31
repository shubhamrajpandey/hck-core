"use client";

import React, { useEffect, useState } from "react";
import { FiLink } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { axiosInstance } from "@/services/axiosInstance";

interface File {
  Id: number;
  fileName: string;
  filePath: string;
}

interface Category {
  categoryId: number;
  categoryName: string;
}

interface User {
  id: number;
  username: string;
  email: string;
}

interface Resource {
  id: number;
  title: string;
  description: string;
  link: string;
  keywords: string[];
  status: string;
  createdAt: string;
  user?: User;
  category?: Category;
  files: File[];
}

export default function Page() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [isChecked, setIsChecked] = useState(false);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState<string>("all"); 

  const itemsPerPage = 5; 
  const router = useRouter();

  useEffect(() => {
    const storedToken =
      localStorage.getItem("token") || sessionStorage.getItem("token");

    const RoleSelected =
      localStorage.getItem("Role") || sessionStorage.getItem("Role");
    if (RoleSelected !== "Moderator" || !storedToken) {
      router.push("/");
    }

    setIsChecked(true);
  }, [router]);

  useEffect(() => {
    if (!isChecked) return;

    const fetchResources = async () => {
      try {
        const token =
          localStorage.getItem("token") || sessionStorage.getItem("token");
        const res = await axiosInstance.get<{ data: Resource[] }>(
          "/resource-requests",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setResources(res.data.data || []);
      } catch (err) {
        console.error("Error fetching resources:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, [isChecked]);

  const handleApprove = async (id: number) => {
    try {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      await axiosInstance.patch(
        `/resource-requests/${id}/approve`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setResources((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: "approved" } : r))
      );
    } catch (err) {
      console.error("Error approving resource:", err);
    }
  };

  const handleReject = async (id: number) => {
    try {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      await axiosInstance.patch(
        `/resource-requests/${id}/reject`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setResources((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: "rejected" } : r))
      );
    } catch (err) {
      console.error("Error rejecting resource:", err);
    }
  };

  const handleEdit = async (res: Resource) => {
    try {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      const payload = {
        title: res.title,
        description: res.description,
        categoryId: res.category?.categoryId,
        keywords: res.keywords,
        link: res.link,
      };
      const response = await axiosInstance.patch(
        `/resource-requests/${res.id}/edit`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setResources((prev) =>
        prev.map((r) => (r.id === res.id ? { ...r, ...response.data } : r))
      );
    } catch (err) {
      console.error("Error editing resource:", err);
    }
  };

  if (!isChecked) return null;

  if (loading)
    return (
      <div className="px-8 py-10">
        <h1 className="text-lg text-gray-600">
          Loading Student Contributions...
        </h1>
      </div>
    );

  const pendingCount = resources.filter((r) => r.status === "pending").length;
  const approvedCount = resources.filter((r) => r.status === "approved").length;
  const rejectedCount = resources.filter((r) => r.status === "rejected").length;
  const totalCount = resources.length;

  const filteredResources =
    filterStatus === "all"
      ? resources
      : resources.filter((r) => r.status === filterStatus);

  const totalPages = Math.ceil(filteredResources.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentResources = filteredResources.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div className="px-8 py-10">
      <div>
        <h1 className="text-2xl font-semibold">
          Review{" "}
          <span className="text-[#74BF44] font-bold">
            Student Contributions
          </span>
        </h1>
      </div>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-8xl">
        <SummaryCard
          count={pendingCount}
          label="Pending Review"
          color="red"
          active={filterStatus === "pending"}
          onClick={() => {
            setFilterStatus("pending");
            setCurrentPage(1);
          }}
        />
        <SummaryCard
          count={approvedCount}
          label="Approved This Week"
          color="green"
          active={filterStatus === "approved"}
          onClick={() => {
            setFilterStatus("approved");
            setCurrentPage(1);
          }}
        />
        <SummaryCard
          count={rejectedCount}
          label="Rejected This Week"
          color="red"
          active={filterStatus === "rejected"}
          onClick={() => {
            setFilterStatus("rejected");
            setCurrentPage(1);
          }}
        />
        <SummaryCard
          count={totalCount}
          label="Total Contributions"
          color="green"
          active={filterStatus === "all"}
          onClick={() => {
            setFilterStatus("all");
            setCurrentPage(1);
          }}
        />
      </div>

      <div className="mt-12 flex flex-col gap-8 max-w-8xl">
        {currentResources.map((res) => (
          <div
            key={res.id}
            className="bg-white rounded-xl border border-gray-300 shadow-md p-6 cursor-pointer hover:shadow-lg transition w-full"
            onClick={() => setExpanded(expanded === res.id ? null : res.id)}
          >
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-[22px] font-[400] tracking-[-0.3px] text-gray-800">
                  {res.title}
                </h2>
                <p className="text-[18px] text-[#00000099] font-[400] tracking-[-0.2px]">
                  Submitted by {res.user?.username || "Unknown"} on{" "}
                  {new Date(res.createdAt).toLocaleDateString()}
                </p>
              </div>
              <span
                className={`px-3 py-1 text-xs font-medium rounded-[7px] border ${
                  res.status === "approved"
                    ? "bg-green-100 border-green-400 text-green-700"
                    : res.status === "rejected"
                    ? "bg-red-100 border-red-400 text-red-700"
                    : "bg-yellow-100 border-yellow-400 text-yellow-700"
                }`}
              >
                {res.status}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-80 mt-5 text-[18px] px-24 py-6 border bg-[#F5F5F5B2] border-[#F5F5F5B2] rounded-[7px]">
              <div>
                <p className="text-[#74BF44] font-[400] tracking-[-0.2px]">
                  Program
                </p>
                <p className="text-[#00000099] mt-1">Computer Science</p>
              </div>
              <div>
                <p className="text-[#74BF44] font-[400] tracking-[-0.2px]">
                  Extras
                </p>
                <p className="text-[#00000099] mt-1">
                  {res.category?.categoryName || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-[#74BF44] font-[400] tracking-[-0.2px]">
                  Language/Tag
                </p>
                <p className="text-[#00000099] mt-1">
                  {res.keywords?.join(", ") || "N/A"}
                </p>
              </div>
            </div>

            {expanded === res.id && (
              <div className="mt-6 pt-5 space-y-6">
                <div>
                  <p className="font-[400] tracking-[-0.2px] text-black text-[20px]">
                    Description
                  </p>
                  <div className="border bg-[#F5F5F5B2] border-[#F5F5F5B2] rounded-[7px] py-5 px-10 mt-3">
                    <p className="mt-1 text-[#00000099] tracking-[-0.2px] font-[400] text-[17px] ">
                      {res.description}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="font-[400] tracking-[-0.2px] text-black text-[20px] ">
                    Files
                  </p>
                  {res.files?.length > 0 ? (
                    res.files.map((file) => (
                      <a
                        key={file.Id}
                        href={file.filePath}
                        target="_blank"
                        rel="noopener noreferrer"
                        download
                        className="block mt-2 px-4 py-3 border border-gray-300 rounded-[7px] text-[17px] text-[#00000080] font-[500] hover:bg-gray-100 transition"
                      >
                        {file.fileName}
                      </a>
                    ))
                  ) : (
                    <p className="text-gray-400 mt-1">No files uploaded</p>
                  )}
                </div>

                <div>
                  <p className="mt-3 font-[400] tracking-[-0.2px] text-black text-[20px] ">
                    Resource Links
                  </p>
                  <div className="flex items-center gap- p-3 mt-2 border border-gray-300 rounded-[7px]">
                    <FiLink className="w-4 h-4 text-gray-600" />
                    <a
                      href={res.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#00000073] text-[16px] hover:underline ml-3"
                    >
                      {res.link}
                    </a>
                  </div>
                </div>

                <div className="flex justify-between items-center border-gray-300 border-t py-10 mt-10">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(res);
                    }}
                    className="px-4 py-2 text-sm font-medium border border-gray-300 rounded-md hover:bg-gray-100 transition cursor-pointer"
                  >
                    Edit
                  </button>

                  <div className="flex gap-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleApprove(res.id);
                      }}
                      className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 transition cursor-pointer"
                    >
                      ✓ Approve
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleReject(res.id);
                      }}
                      className="px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-md hover:bg-red-600 transition cursor-pointer"
                    >
                      ✕ Reject
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 mt-10">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            Previous
          </button>

          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-4 py-2 border rounded ${
                currentPage === i + 1
                  ? "bg-green-600 text-white"
                  : "hover:bg-gray-100"
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

function SummaryCard({
  count,
  label,
  color,
  onClick,
  active,
}: {
  count: number;
  label: string;
  color: "red" | "green";
  onClick: () => void;
  active?: boolean;
}) {
  const colorClass = color === "red" ? "text-[#FF4848]" : "text-[#74BF44]";
  return (
    <div
      onClick={onClick}
      className={`flex flex-col items-start gap-2 px-6 py-8 rounded-[7px] border bg-white shadow-md w-full cursor-pointer transition ${
        active ? "border-green-500 bg-green-50" : "border-gray-200"
      }`}
    >
      <p className={`${colorClass} text-[30px] font-[400]`}>{count}</p>
      <p className="text-[#000000B2] text-[17px] font-[400]">{label}</p>
    </div>
  );
}
