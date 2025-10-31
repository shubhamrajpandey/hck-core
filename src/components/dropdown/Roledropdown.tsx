"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Props {
  selected: number;
  onChange: (roleId: number) => void;
}

const roles = [
  { id: 1, name: "Admin" },
  { id: 2, name: "Moderator" },
  { id: 3, name: "Student" },
];

export default function RoleDropdown({ selected, onChange }: Props) {
  const [open, setOpen] = useState(false);

  const selectedRole = roles.find((r) => r.id === selected);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>

      <DropdownMenuTrigger className="border-1 flex gap-4 justify-center py-1.5 mt-1 w-[200px] h-[40px] text-[16px] text-gray-600 rounded-[6px] tracking-[0.5px] bg-white border-gray-400 hover:bg-[#E7E7E7]">
        {selectedRole ? selectedRole.name : "Select role"}
        <ChevronDown size={18} className="mt-1 text-gray-500" />
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-[200px] bg-white text-gray-600 border-gray-300 rounded-[6px] shadow-md">
        {roles.map((role) => (
          <DropdownMenuItem
            key={role.id}
            className="h-[40px] text-[15px] hover:bg-[#E7E7E7]"
            onSelect={() => {
              onChange(role.id);
              setOpen(false);
            }}
          >
            {role.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
