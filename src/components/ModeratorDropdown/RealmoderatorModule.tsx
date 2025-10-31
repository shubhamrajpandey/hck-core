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
import { FetchDropdownapi } from "@/services/dropdown.service";

type Module = {
  id: number;
  title: string;
};

type ModeratorModuleProps = {
  selectedModuleId: number | null;
  setSelectedModuleId: (id: number | null) => void;
};

export default function RealModeratorModule({
  selectedModuleId,
  setSelectedModuleId,
}: ModeratorModuleProps) {
  const [modules, setModules] = useState<Module[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const data = await FetchDropdownapi("moderator/assigned-modules");

        const normalizedModules: Module[] = Array.isArray(data.data)
          ? data.data.map((m: { id: number; name: string }) => ({
              id: m.id,
              title: m.name,
            }))
          : [];

        setModules(normalizedModules);
      } catch (err) {
        console.error("Error fetching modules:", err);
        setModules([]);
      }
    };

    fetchModules();
  }, []);

  const selectedModule = modules.find((m) => m.id === selectedModuleId) || null;

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger className="flex items-center justify-between px-4 py-2 mt-3 w-[250px] h-[45px] text-gray-700 text-[15px] bg-white border border-gray-300 rounded-md hover:bg-gray-50">
        <span className="truncate">
          {selectedModule ? selectedModule.title : "Select Module"}
        </span>
        <ChevronDown size={18} className="text-gray-500" />
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-[250px] bg-white text-gray-700 border border-gray-300 rounded-md shadow-md">
        {modules.length === 0 && (
          <DropdownMenuItem className="flex items-center h-[45px] px-4 text-gray-400">
            No modules available
          </DropdownMenuItem>
        )}

        {modules.map((module, index) => (
          <React.Fragment key={module.id}>
            <DropdownMenuItem
              className="flex items-center h-[45px] px-4 hover:bg-gray-100"
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
