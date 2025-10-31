"use client";

import { useEffect, useState } from "react";
import { useSelected } from "@/context/selectedContext";
import { FetchDropdownapi } from "@/services/dropdown.service";

export default function ModuleDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [Module, setModule] = useState<{ id: number; name: string }[]>([]);
  const [selectedModule, setselectedModule] = useState<string>();
  const { setselectedModuleContext } = useSelected();
  useEffect(() => {
    const fetchdata = async () => {
      const SubjectResponse = await FetchDropdownapi("faculties");
      setModule(SubjectResponse);
      if (SubjectResponse.length! >= 0) {
        setselectedModule(SubjectResponse[0].name);
      }
    };
    fetchdata();
  }, []);

  return (
    <div className="relative inline-block w-fit h-fit rounded-md">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center justify-between gap-3 px-7 py-3 bg-white border border-gray-300 rounded shadow-[3px_3px_8px_#00000050] w-67 h-16 hover:text-white hover:bg-[#74BF44] hover:brightness-90 transition duration-200 hover:cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <span className="text-[20px] font-[400]">{selectedModule}</span>
        </div>
        <svg
          width="14"
          height="8"
          viewBox="0 0 14 8"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M7.71906 7.55714C7.53153 7.74461 7.27723 7.84992 7.01206 7.84992C6.7469 7.84992 6.49259 7.74461 6.30506 7.55714L0.648062 1.90014C0.552552 1.80789 0.476369 1.69754 0.42396 1.57554C0.371551 1.45354 0.343965 1.32232 0.342811 1.18954C0.341657 1.05676 0.366959 0.925078 0.41724 0.802182C0.467521 0.679285 0.541774 0.567633 0.635667 0.47374C0.72956 0.379847 0.841211 0.305594 0.964108 0.255313C1.087 0.205033 1.21868 0.179731 1.35146 0.180885C1.48424 0.182039 1.61546 0.209625 1.73747 0.262034C1.85947 0.314443 1.96982 0.390625 2.06206 0.486135L7.01206 5.43614L11.9621 0.486135C12.1507 0.303977 12.4033 0.203183 12.6655 0.205461C12.9277 0.20774 13.1785 0.312908 13.3639 0.498316C13.5493 0.683725 13.6545 0.934537 13.6567 1.19673C13.659 1.45893 13.5582 1.71153 13.3761 1.90014L7.71906 7.55714Z"
            fill="black"
            fill-opacity="0.4"
          />
        </svg>
      </button>
      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute mt-2 bg-white border border-gray-300 rounded shadow-md z-10 w-full font-[400]">
          {Module.map((option) => (
            <div
              key={option.id}
              onClick={() => {
                //passed the subject selected to the context form but by converting to the string of data api had to check if they both equal. was better than chaning the whole design
                setselectedModule(option.name);
                setselectedModuleContext(option.id);
                setIsOpen(false);
              }}
              className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 cursor-pointer text-[20px] font-[400]"
            >
              <span>{option.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
