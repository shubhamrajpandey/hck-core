"use client";

import React, { useEffect, useState, useCallback } from "react";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { axiosInstance } from "@/services/axiosInstance"; 

interface Faculty {
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
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [open, setOpen] = useState(false);

  const fetchFaculties = useCallback(async () => {
    try {
      const res = await axiosInstance.get("/faculties");

      const data = res.data;

      setFaculties(Array.isArray(data) ? data : data?.data || []);
    } catch (err: unknown) {
      console.error(
        "Error fetching faculties:",
        err instanceof Error ? err.message : err
      );
      setFaculties([]);
    }
  }, []);

  useEffect(() => {
    fetchFaculties();
  }, [fetchFaculties]);

  const selectedFaculty = faculties.find((f) => f.id === selectedFacultyId);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger className="border-1 flex gap-4 justify-center py-1.5 mt-3  w-[230px] h-[40px] text-[16px] text-gray-500 rounded-[5px] tracking-[0.5px] bg-white border-gray-400 hover:bg-[#E7E7E7]">
        {selectedFaculty ? selectedFaculty.name : "Select program"}{" "}
        <ChevronDown size={18} className="mt-1 text-gray-500" />
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-[230px] bg-white text-gray-500 border-gray-300">
        {faculties.map((faculty) => (
          <DropdownMenuItem
            key={faculty.id}
            className="h-[40px] text-[16px] hover:bg-[#E7E7E7]"
            onSelect={() => {
              setSelectedFacultyId(faculty.id);
              setOpen(false);
            }}
          >
            {faculty.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
