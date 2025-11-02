"use client";

import React, { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import axios from "axios";

type Module = {
  id: number;
  title: string;
};

interface AssignedModuleResponse {
  Module: {
    id: number;
    name: string;
  };
}

type AssignedModuleDropdownProps = {
  selectedModuleId: number | null;
  setSelectedModuleId: (id: number | null) => void;
};

export default function AssignedModuleDropdown({
  selectedModuleId,
  setSelectedModuleId,
}: AssignedModuleDropdownProps) {
  const [modules, setModules] = useState<Module[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchAssignedModules = async () => {
      try {
        const token =
          localStorage.getItem("token") || sessionStorage.getItem("token");
        const res = await axios.get(
          "https://herald-hub-backend.onrender.com/moderator/assigned-modules",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const normalized: Module[] = res.data.data.map(
          (m: AssignedModuleResponse) => ({
            id: m.Module.id,
            title: m.Module.name,
          })
        );

        setModules(normalized);
      } catch (err) {
        console.error("Error fetching assigned modules:", err);
        setModules([]);
      }
    };

    fetchAssignedModules();
  }, []);

  const selectedModule = modules.find((m) => m.id === selectedModuleId) || null;

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger className="border-1 flex gap-4 justify-center py-1.5 mt-3 w-[250px] h-[40px] text-[16px] text-gray-500 rounded-[5px] tracking-[0.5px] bg-white border-gray-300 hover:bg-[#E7E7E7]">
        <span className="truncate px-3">
          {selectedModule ? selectedModule.title : "Select Module"}
        </span>
        <ChevronDown size={18} className="text-gray-500 mt-1" />
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-[250px] bg-white text-gray-700 border border-gray-300 rounded-md shadow-md">
        {modules.length === 0 && (
          <DropdownMenuItem className="flex items-center h-[45px] px-4 text-gray-500">
            No modules assigned
          </DropdownMenuItem>
        )}

        {modules.map((module, index) => (
          <React.Fragment key={module.id}>
            <DropdownMenuItem
              className="flex items-center h-[45px] px-4 text-gray-500 hover:bg-gray-100 tracking-[0.2px]"
              onSelect={() => {
                setSelectedModuleId(module.id);
                setOpen(false);
              }}
            >
              {module.title}
            </DropdownMenuItem>
            {index < modules.length - 1 && <DropdownMenuSeparator />}
          </React.Fragment>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
