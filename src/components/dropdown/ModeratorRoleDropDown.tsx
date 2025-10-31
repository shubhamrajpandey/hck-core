"use client";

import React, { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { axiosInstance } from "@/services/axiosInstance";
import toast from "react-hot-toast";

interface ModeratorRoleDropDownProps {
  userId: number;
  onAssignRole: (userId: number, role: string) => void;
}

interface ModuleRole {
  id: number;
  name: string;
  description: string;
}

const ModeratorRoleDropDown: React.FC<ModeratorRoleDropDownProps> = ({
  userId,
  onAssignRole,
}) => {
  const [roles, setRoles] = useState<ModuleRole[]>([]);
  const [selected, setSelected] = useState<string>("Select role");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        setLoading(true);
        const token =
          localStorage.getItem("token") || sessionStorage.getItem("token");
        if (!token) throw new Error("No token found");

        const res = await axiosInstance.get<{ data: ModuleRole[] }>(
          "/module/roles",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setRoles(res.data.data);
      } catch (err: unknown) {
        console.error("Error fetching roles:", err);
        toast.error("Failed to load roles");
      } finally {
        setLoading(false);
      }
    };

    fetchRoles();
  }, []);

  const handleSelect = async (role: ModuleRole) => {
    setSelected(role.name);

    try {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const toastId = toast.loading("Assigning role...");

      await axiosInstance.put(
        `/users/${userId}/role`,
        { roleId: role.id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Role assigned successfully", { id: toastId });
      onAssignRole(userId, role.name);
    } catch (err: unknown) {
      console.error("Error assigning role:", err);
      toast.error("Failed to assign role");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="border-1 flex gap-4 justify-center items-center py-1.5 w-[190px] h-[40px] text-[16px] text-gray-500 rounded-[5px] tracking-[0.5px] bg-white  border-gray-400 hover:bg-[#E7E7E7]">
        {selected} <ChevronDown size={18} className="mt-1 text-gray-500" />
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-[190px] bg-white text-gray-500 border border-gray-300 rounded-md shadow-md">
        {loading ? (
          <DropdownMenuItem className="h-[40px] text-[16px] text-gray-400">
            Loading...
          </DropdownMenuItem>
        ) : roles.length > 0 ? (
          roles.map((role) => (
            <DropdownMenuItem
              key={role.id}
              className="h-[40px] text-[16px] hover:bg-[#E7E7E7]"
              onClick={() => handleSelect(role)}
            >
              {role.name}
            </DropdownMenuItem>
          ))
        ) : (
          <DropdownMenuItem className="h-[40px] text-[16px] text-gray-400">
            No roles found
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ModeratorRoleDropDown;
