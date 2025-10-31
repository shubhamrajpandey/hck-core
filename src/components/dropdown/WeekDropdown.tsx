"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Plus, X } from "lucide-react";
import toast from "react-hot-toast";
import { useSelected } from "@/context/selectedContext";
import { axiosInstance } from "@/services/axiosInstance";

interface Week {
  weekId: number;
  weekName: string;
  moduleId: number;
}

type Props = {
  selectedModuleId: number | null;
};

export default function WeekManager({ selectedModuleId }: Props) {
  const [weeks, setWeeks] = useState<Week[]>([]);
  const [newWeekName, setNewWeekName] = useState("");
  const [selectedWeekId, setSelectedWeekId] = useState<number | null>(null);
  const { setselectedWeekContext } = useSelected();

  const fetchWeeks = useCallback(async () => {
    if (!selectedModuleId) return;
    try {
      const res = await axiosInstance.get(`/modules/${selectedModuleId}/weeks`);
      setWeeks(res.data.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch weeks");
    }
  }, [selectedModuleId]);

  useEffect(() => {
    fetchWeeks();
  }, [fetchWeeks]);

  const handleAddWeek = async () => {
    if (!selectedModuleId) return toast.error("Please select a module first");

    if (!newWeekName.trim()) return toast.error("Week name cannot be empty");

    const duplicate = weeks.find(
      (w) => w.weekName.toLowerCase() === newWeekName.trim().toLowerCase()
    );
    if (duplicate) {
      return toast.error(`"${newWeekName}" already exists`);
    }

    try {
      await axiosInstance.post("/weeks", {
        weekName: newWeekName.trim(),
        moduleId: selectedModuleId,
      });

      toast.success("Week created successfully");
      setNewWeekName("");
      fetchWeeks();
    } catch (err) {
      console.error(err);
      toast.error("Failed to create week");
    }
  };

  const handleDeleteWeek = async (weekId: number) => {
    try {
      await axiosInstance.delete(`/weeks/${weekId}`);
      toast.success("Week deleted successfully");
      fetchWeeks();
      if (selectedWeekId === weekId) {
        setSelectedWeekId(null);
        setselectedWeekContext(null);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete week");
    }
  };

  const handleSelectWeek = (weekId: number) => {
    setSelectedWeekId(weekId);
    setselectedWeekContext(weekId);
  };

  return (
    <div className="w-full max-w-full mx-auto mt-4 p-4 border border-gray-300 rounded-lg bg-white shadow">
      <h2 className="text-[17px] font-[400] text-gray-700 mb-3">Manage Weeks</h2>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={newWeekName}
          onChange={(e) => setNewWeekName(e.target.value)}
          placeholder="Enter week name"
          className="flex-1 border border-gray-300 px-3 py-2 rounded text-sm placeholder:text-gray-500 placeholder:tracking-[0.4px] placeholder:text-[16px]"
        />
        <button
          onClick={handleAddWeek}
          className="px-3 py-2 bg-[#74BF44] text-white rounded flex items-center gap-1 border-1 border-[#74BF44] hover:text-[#74BF44] hover:bg-white"
        >
          <Plus className="w-4 h-4" /> Add
        </button>
      </div>

      <div className="h-26 overflow-y-scroll border-t border-b border-gray-200 py-2 custom-scrollbar">
        <ul className="space-y-2">
          {!selectedModuleId && (
            <li className="text-gray-500 text-sm text-[16px] tracking-[0.2px]">
              Please Select Module to get a Week
            </li>
          )}
          {selectedModuleId && weeks.length === 0 && (
            <li className="text-gray-500 text-sm text-[16px] tracking-[0.2px]">
              No week found for this module
            </li>
          )}
          {weeks.map((week) => (
            <li
              key={week.weekId}
              onClick={() => handleSelectWeek(week.weekId)}
              className={`flex items-center justify-between px-3 py-2 border border-gray-300 rounded text-gray-700 cursor-pointer ${
                selectedWeekId === week.weekId
                  ? "bg-[#E6F4EA]"
                  : "hover:bg-gray-50"
              }`}
            >
              <span>{week.weekName}</span>
              <X
                className="w-4 h-4 text-red-500 hover:text-red-700 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteWeek(week.weekId);
                }}
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
