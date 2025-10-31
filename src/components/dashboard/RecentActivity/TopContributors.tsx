"use client";
import { useState } from "react";

type Contributor = {
  name: string;
  contributions: number;
};

type TopContributorsProps = {
  contributors: Contributor[];
};

export default function TopContributors({
  contributors,
}: TopContributorsProps) {
  const [page, setPage] = useState(0);
  const itemsPerPage = 7;

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
