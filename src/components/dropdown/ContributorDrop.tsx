import React from "react";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function ContributorDrop() {
  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger className="border-1 flex gap-10 justify-center py-3.5 w-[225px] h-[55px] text-[17px] rounded-sm tracking-[0.5px] bg-white border-gray-400 shadow-[3px_3px_8px_#00000050] focus:outline-none focus:ring-2 focus:ring-gray-400 hover:bg-[#A4C93A] hover:text-white ">
          All Contributors{" "}
          <ChevronDown size={18} className="mt-1 text-gray-500" />
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-[225px] bg-white border-gray-300">
          <DropdownMenuItem className="h-[55px] text-[18px] hover:text-white  hover:bg-[#A4C93A]">
            Students
          </DropdownMenuItem>
          <DropdownMenuItem className="h-[55px] text-[18px] hover:text-white hover:bg-[#A4C93A]">
            Module Leaders
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default ContributorDrop;
