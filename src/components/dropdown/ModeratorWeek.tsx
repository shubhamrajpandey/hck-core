"use client";
import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

export default function ModeratorWeek() {
  const [weeks, setWeeks] = useState<string[]>([]); 
  const [selectedWeek, setSelectedWeek] = useState<string | null>(null);
  const [open, setOpen] = useState(false); 

  const handleCreateWeek = (e?: React.MouseEvent) => {
    e?.stopPropagation();

    setWeeks((prev) => {
      if (prev.length >= 12) {
        alert("All 12 weeks have been created!");
        return prev;
      }
      return [...prev, `Week ${prev.length + 1}`];
    });

    setOpen(true);
  };

  const handleSelectWeek = (week: string) => {
    setSelectedWeek(week);
    setOpen(false); 
  };

  return (
    <div className="flex flex-col gap-4">
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger className="border-1 flex gap-2 items-center justify-center py-2 mt-3 w-[157px] h-[40px] text-[15px] text-gray-500 rounded-[5px] bg-white border-gray-400  hover:bg-[#E7E7E7]">
          {selectedWeek ?? "Select week"}
          <ChevronDown size={18} className="ml-2 text-gray-500" />
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-[157px] bg-white text-gray-500 border-gray-300">
          {weeks.length > 0 &&
            weeks.map((week) => (
              <DropdownMenuItem
                key={week}
                onClick={() => handleSelectWeek(week)}
                className="h-[36px] text-[15px] hover:bg-[#E7E7E7] cursor-pointer"
              >
                {week}
              </DropdownMenuItem>
            ))}

          <DropdownMenuItem
            onClick={handleCreateWeek}
            className="h-[40px] text-[15px] hover:bg-[#E7E7E7] cursor-pointer"
          >
            Create Week
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
