"use client";

import { useEffect, useState } from "react";
import axios from "axios";

// Contributor type for frontend
interface Contributor {
  name: string;
  contributions: number;
}

// Backend response type
interface ApiContributor {
  user_id: number;
  username: string;
  email: string;
  total_count: number;
}

interface ApiResponse {
  message: string;
  data: ApiContributor[];
  timestamp: string;
}

export default function TopContributors() {
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [page, setPage] = useState(0);
  const itemsPerPage = 7;

  useEffect(() => {
    const fetchTopContributors = async () => {
      try {
        const token = localStorage.getItem("token") || "";

        const res = await axios.get<ApiResponse>(
          "https://herald-hub-backend.onrender.com/users/top-contributors",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Map backend data to frontend Contributor type
        const data: Contributor[] = res.data.data.map((item) => ({
          name: item.username,
          contributions: item.total_count,
        }));

        setContributors(data);
      } catch (err) {
        console.error("Failed to fetch top contributors", err);
      }
    };

    fetchTopContributors();
  }, []);

  const totalPages = Math.ceil(contributors.length / itemsPerPage);
  const startIndex = page * itemsPerPage;
  const currentContributors = contributors.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handlePrev = () => {
    if (page > 0) setPage(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages - 1) setPage(page + 1);
  };

  return (
    <div
      className="w-full sm:w-[280px] lg:w-[520px] border border-gray-300 h-full bg-white py-[30px] px-[23px] rounded-md shadow"
      style={{ boxShadow: "1px 2px 5px 1px rgba(0, 0, 0, 0.25)" }}
    >
      <div className="flex flex-col gap-[10px]">
        <span className="font-[600] text-gray-700 text-[20px]">
          Top Contributors
        </span>
        <span className="text-[16px] font-400 text-[#00000099] tracking-[-0.1px]">
          Latest updates to modules and week content
        </span>
      </div>

      <div className="flex flex-col p-[16px] gap-[30px] mt-3">
        {currentContributors.map((contributor, index) => (
          <div
            key={index}
            className="flex items-center justify-between border-b border-gray-200 pb-2 last:border-b-0"
          >
            <span className="text-[15px] font-500 text-[#000000CC] truncate">
              {contributor.name}
            </span>
            <span className="text-[16px] text-[#74BF44] font-800">
              {contributor.contributions}
            </span>
          </div>
        ))}

        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 pt-2">
            <button
              onClick={handlePrev}
              disabled={page === 0}
              className="px-2 py-1 text-[#74BF44] disabled:opacity-40"
            >
              {"<"}
            </button>
            <span className="text-sm text-gray-500">
              {page + 1} / {totalPages}
            </span>
            <button
              onClick={handleNext}
              disabled={page === totalPages - 1}
              className="px-2 py-1 text-[#74BF44] disabled:opacity-40"
            >
              {">"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
