"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ResourceTypeDropdownProps {
  resourceType: "normal" | "extra";
  setResourceType: (value: "normal" | "extra") => void;
}

const ResourceTypeDropdown: React.FC<ResourceTypeDropdownProps> = ({
  resourceType,
  setResourceType,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger className="flex gap-4 justify-between items-center py-3 mt-3 px-4 w-full max-w-full h-[45px] text-[16px] text-gray-500 rounded-[7px] tracking-[0.5px] bg-white border border-gray-300 hover:bg-[#E7E7E7] cursor-pointer">
        <span className="truncate">
          {resourceType === "normal"
            ? "Create Program Resource"
            : "Create Extra-Resource"}
        </span>
        <ChevronDown size={18} className="text-gray-500" />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        sideOffset={4}
        className="min-w-[var(--radix-dropdown-menu-trigger-width)] w-full bg-white border border-gray-300"
      >
        <DropdownMenuItem
          className="h-[45px] text-[16px] hover:bg-[#E7E7E7] text-gray-600"
          onSelect={() => {
            setResourceType("normal");
            setOpen(false);
          }}
        >
          Create Program Resource
        </DropdownMenuItem>

        <DropdownMenuItem
          className="h-[45px] text-[16px] hover:bg-[#E7E7E7] text-gray-600"
          onSelect={() => {
            setResourceType("extra");
            setOpen(false);
          }}
        >
          Create Extra-Resource
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ResourceTypeDropdown;
