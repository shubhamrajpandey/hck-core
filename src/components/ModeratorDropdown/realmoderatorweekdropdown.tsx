"use client";

import { useEffect, useState } from "react";
import { useSelected } from "@/context/selectedContext";
import FetchWeekbyModuleid from "@/services/fetchWeekbyModuleid";

export default function RealModeratorWeekDropdown({
  ParameterModuleId,
}: {
  ParameterModuleId: number | null;
}) {
  const { setselectedWeekContext } = useSelected();
  const [isOpen, setIsOpen] = useState(false);
  const [weeks, setWeeks] = useState<{ weekId: number; weekName: string }[]>(
    []
  );
  const [selectedWeek, setSelectedWeek] = useState<string>("Week 1");

  useEffect(() => {
    const fetchData = async () => {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      if (!token) return;

      try {
        const result = await FetchWeekbyModuleid(ParameterModuleId);
        const weekList = result?.data || [];
        setWeeks(weekList);
        if (weekList.length > 0) {
          setSelectedWeek(weekList[0].weekName);
          setselectedWeekContext(weekList[0].weekId);
        }
      } catch (error) {
        console.error("Failed to fetch weeks:", error);
      }
    };

    if (ParameterModuleId) fetchData();
  }, [ParameterModuleId, setselectedWeekContext]);

  return (
    <div className="relative w-full max-w-md sm:max-w-[200px]">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center justify-between px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm hover:shadow-md w-full text-[16px] sm:text-[18px]"
      >
        <span className="truncate">{selectedWeek}</span>
        <svg
          width="18"
          height="18"
          viewBox="0 0 14 8"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            className="fill-black group-hover:fill-green-500 transition duration-200"
            d="M7.71906 7.55714C7.53153 7.74461 7.27723 7.84992 7.01206 7.84992C6.7469 7.84992 6.49259 7.74461 6.30506 7.55714L0.648062 1.90014C0.552552 1.80789 0.476369 1.69754 0.42396 1.57554C0.371551 1.45354 0.343965 1.32232 0.342811 1.18954C0.341657 1.05676 0.366959 0.925078 0.41724 0.802182C0.467521 0.679285 0.541774 0.567633 0.635667 0.47374C0.72956 0.379847 0.841211 0.305594 0.964108 0.255313C1.087 0.205033 1.21868 0.179731 1.35146 0.180885C1.48424 0.182039 1.61546 0.209625 1.73747 0.262034C1.85947 0.314443 1.96982 0.390625 2.06206 0.486135L7.01206 5.43614L11.9621 0.486135C12.1507 0.303977 12.4033 0.203183 12.6655 0.205461C12.9277 0.20774 13.1785 0.312908 13.3639 0.498316C13.5493 0.683725 13.6545 0.934537 13.6567 1.19673C13.659 1.45893 13.5582 1.71153 13.3761 1.90014L7.71906 7.55714Z"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute mt-2 w-full sm:w-[200px] bg-white border border-gray-300 rounded-md shadow-lg z-20 max-h-64 overflow-y-auto">
          {weeks.map((week) => (
            <div
              key={week.weekId}
              onClick={() => {
                setSelectedWeek(week.weekName);
                setselectedWeekContext(week.weekId);
                setIsOpen(false);
              }}
              className={`px-4 py-2 cursor-pointer text-[16px] sm:text-[18px] truncate hover:bg-gray-100 ${
                selectedWeek === week.weekName ? "bg-green-100" : ""
              }`}
            >
              {week.weekName}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
