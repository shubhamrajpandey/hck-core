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

interface Level {
  id: number;
  name: string;
  facultyId: number;
}

interface ModeratorLevelProps {
  selectedFacultyId: number | null;
  selectedLevelId: number | null;
  setSelectedLevelId: (id: number | null) => void;
}

export default function ModeratorLevel({
  selectedFacultyId,
  selectedLevelId,
  setSelectedLevelId,
}: ModeratorLevelProps) {
  const [levels, setLevels] = useState<Level[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!selectedFacultyId) {
      setLevels([]);
      setSelectedLevelId(null);
      return;
    }

    const fetchLevels = async () => {
      try {
        const data = await FetchDropdownapi(`/faculties/${selectedFacultyId}/levels`);

        const facultyLevels: Level[] = Array.isArray(data.data) ? data.data : [];
        setLevels(facultyLevels);
      } catch (err) {
        console.error("Error fetching levels:", err);
        setLevels([]);
      }
    };

    fetchLevels();
  }, [selectedFacultyId, setSelectedLevelId]);

  const selectedLevel = levels.find((l) => l.id === selectedLevelId);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger
        className={`border-1 flex gap-4 justify-center py-2 mt-3 w-[146px] h-[40px] text-[15px] ${
          !selectedFacultyId
            ? "text-gray-300 cursor-not-allowed"
            : "text-gray-500"
        } rounded-[5px] tracking-[0.5px] bg-white border-gray-300 hover:bg-[#E7E7E7]`}
        onClick={() => {
          if (!selectedFacultyId) return;
          setOpen(!open);
        }}
      >
        {selectedLevel ? selectedLevel.name : "Select level"}{" "}
        <ChevronDown size={18} className="mt-1 text-gray-500" />
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-[146px] bg-white text-gray-500 border-gray-300">
        {levels.length === 0 && (
          <DropdownMenuItem className="h-[40px] text-[15px] text-gray-400 cursor-not-allowed">
            No levels available
          </DropdownMenuItem>
        )}
        {levels.map((level) => (
          <DropdownMenuItem
            key={level.id}
            className="h-[40px] text-[15px] hover:bg-[#E7E7E7]"
            onSelect={() => {
              setSelectedLevelId(level.id);
              setOpen(false);
            }}
          >
            {level.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
