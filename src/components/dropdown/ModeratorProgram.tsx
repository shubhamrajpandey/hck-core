"use client";

import React, { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FetchDropdownapi } from "@/services/dropdown.service";

interface Program {
  id: number;
  name: string;
}

interface ModeratorProgramProps {
  selectedFacultyId: number | null;
  setSelectedFacultyId: (id: number | null) => void;
}

export default function ModeratorProgram({
  selectedFacultyId,
  setSelectedFacultyId,
}: ModeratorProgramProps) {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const data = await FetchDropdownapi("/faculties");

        const normalizedPrograms: Program[] = Array.isArray(data.data)
          ? data.data
          : [];

        setPrograms(normalizedPrograms);
      } catch (err) {
        console.error("Error fetching programs:", err);
        setPrograms([]);
      }
    };

    fetchPrograms();
  }, []);

  const selectedProgram =
    programs.find((p) => p.id === selectedFacultyId) || null;

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger className="border-1 flex gap-4 justify-center py-1.5 mt-3 w-[230px] h-[40px] text-[16px] text-gray-500 rounded-[5px] tracking-[0.5px] bg-white border-gray-300 hover:bg-[#E7E7E7]">
        {selectedProgram ? selectedProgram.name : "Select Program"}{" "}
        <ChevronDown size={18} className="mt-1 text-gray-500" />
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-[230px] bg-white text-gray-500 border-gray-300">
        {programs.length === 0 && (
          <DropdownMenuItem className="h-[40px] text-[16px] text-gray-400">
            No programs available
          </DropdownMenuItem>
        )}
        {programs.map((program) => (
          <DropdownMenuItem
            key={program.id}
            className="h-[40px] text-[16px] hover:bg-[#E7E7E7]"
            onSelect={() => setSelectedFacultyId(program.id)}
          >
            {program.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
