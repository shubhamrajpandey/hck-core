"use client";

import React, { useEffect, useState } from "react";
import RoleDropdown from "@/components/dropdown/Roledropdown";
import { axiosInstance } from "@/services/axiosInstance";
import { FiUser, FiTrash2 } from "react-icons/fi";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";


interface Role {
  id: number;
  name: string;
}

interface User {
  id: number;
  username: string;
  email: string;
  role: Role;
  createdAt: string;
}

interface Faculty {
  id: number;
  name: string;
  facultyName?: string;
}

interface Level {
  id: number;
  name: string;
}

interface Module {
  id: number;
  name?: string;
  moduleName?: string;
}

interface DeleteConfirmState {
  open: boolean;
  userId: number | null;
}

interface FacultyResponse {
  id: number;
  name?: string;
  facultyName?: string;
}

interface LevelResponse {
  id: number;
  name?: string;
  levelName?: string;
}

interface ModuleResponse {
  id: number;
  name?: string;
  moduleName?: string;
  title?: string;
}


export default function ManageUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [roleId, setRoleId] = useState<number>(3);
  const [isChecked, setIsChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<DeleteConfirmState>({
    open: false,
    userId: null,
  });

  const [expandedUserId, setExpandedUserId] = useState<number | null>(null);


  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [levels, setLevels] = useState<Level[]>([]);
  const [modules, setModules] = useState<Module[]>([]);

  const [selectedFaculty, setSelectedFaculty] = useState<number | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const [selectedModule, setSelectedModule] = useState<number | null>(null);
  const [selectedModuleRole, setSelectedModuleRole] = useState<number>(1);

  const router = useRouter();

  
  useEffect(() => {
    const storedToken =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    const roleSelected =
      localStorage.getItem("Role") || sessionStorage.getItem("Role");

    if (roleSelected !== "Admin" || !storedToken) router.push("/");
    setIsChecked(true);
  }, [router]);


  useEffect(() => {
    fetchUsers(roleId);
  }, [roleId]);

  const fetchUsers = async (role: number) => {
    try {
      setLoading(true);
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      const res = await axiosInstance.get(`/users/${role}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = res.data?.data?.data || [];
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching users:", err);
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };


  const handleDelete = async () => {
    if (!deleteConfirm.userId) return;
    const toastId = toast.loading("Deleting user...");

    try {
      await axiosInstance.delete(`/users/${deleteConfirm.userId}`);
      setUsers((prev) => prev.filter((u) => u.id !== deleteConfirm.userId));
      toast.success("User deleted successfully!", { id: toastId });
    } catch (err) {
      console.error("Error deleting user:", err);
      toast.error("Failed to delete user!", { id: toastId });
    } finally {
      setDeleteConfirm({ open: false, userId: null });
    }
  };

  const handleExpandRow = async (userId: number) => {
    setExpandedUserId(expandedUserId === userId ? null : userId);
    setSelectedFaculty(null);
    setSelectedLevel(null);
    setSelectedModule(null);
    setLevels([]);
    setModules([]);

    if (expandedUserId !== userId) {
      try {
        const token =
          localStorage.getItem("token") || sessionStorage.getItem("token");
        const res = await axiosInstance.get("/faculties", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const raw = res.data?.data || res.data || [];
        const formatted: Faculty[] = Array.isArray(raw)
          ? raw.map((f: FacultyResponse) => ({
              id: f.id,
              name: f.name || f.facultyName || "Unnamed Faculty",
            }))
          : [];

        setFaculties(formatted);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch faculties");
      }
    }
  };

  const handleFacultySelect = async (facultyId: number) => {
    setSelectedFaculty(facultyId);
    setLevels([]);
    setModules([]);
    setSelectedLevel(null);
    setSelectedModule(null);

    try {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      const res = await axiosInstance.get(`/faculties/${facultyId}/levels`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const raw = res.data?.data || res.data || [];
      const formatted: Level[] = Array.isArray(raw)
        ? raw.map((l: LevelResponse) => ({
            id: l.id,
            name: l.name || l.levelName || "Unnamed Level",
          }))
        : [];

      setLevels(formatted);
    } catch (err) {
      console.error("Error fetching levels:", err);
      toast.error("Failed to fetch levels");
    }
  };

  const handleLevelSelect = async (levelId: number) => {
    if (!selectedFaculty) {
      toast.error("Select a faculty first");
      return;
    }
    setSelectedLevel(levelId);
    setModules([]);
    setSelectedModule(null);

    try {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      const res = await axiosInstance.get(
        `/faculties/${selectedFaculty}/levels/${levelId}/modules`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const possibleData =
        res.data?.data ||
        res.data?.modules ||
        res.data?.data?.modules ||
        res.data ||
        [];

      const formatted: Module[] = Array.isArray(possibleData)
        ? possibleData.map((m: ModuleResponse) => ({
            id: m.id,
            name: m.moduleName || m.name || m.title || "Unnamed Module",
          }))
        : [];

      if (formatted.length === 0)
        toast.error("No modules found for this level");

      setModules(formatted);
    } catch (err) {
      console.error("Error fetching modules:", err);
      toast.error("Failed to fetch modules");
    }
  };

  const handleAssignModerator = async (userId: number) => {
    if (!selectedModule || !selectedModuleRole) {
      toast.error("Please select module and role");
      return;
    }

    try {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      await axiosInstance.post(
        `/modules/${selectedModule}/moderators`,
        { userId, moduleRoleId: selectedModuleRole },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Moderator assigned successfully!");
      setExpandedUserId(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to assign moderator");
    }
  };

 
  return (
    <div className="px-8">
      {isChecked && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mt-6"
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-[26px] font-[500]">
              Manage <span className="text-[#74BF44] font-[600]">Users</span>
            </h1>
            <div className="mt-8">
              <RoleDropdown selected={roleId} onChange={setRoleId} />
            </div>
          </div>

          {/* Table */}
          <div className="bg-white shadow-xl rounded-[10px] overflow-hidden">
            <table className="w-full border-collapse">
              <thead className="bg-[#E6F4EA] text-[#74BF44]">
                <tr>
                  <th className="text-left px-6 py-3">#</th>
                  <th className="text-left px-6 py-3">Username</th>
                  <th className="text-left px-6 py-3">Email</th>
                  <th className="text-left px-6 py-3">Role</th>
                  <th className="text-left px-6 py-3">Created At</th>
                  {roleId === 2 && (
                    <th className="text-left px-6 py-3">Assign Moderator</th>
                  )}
                  <th className="text-left px-6 py-3">Action</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="text-center py-6 text-gray-500">
                      Loading users...
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-6 text-gray-500">
                      No users found
                    </td>
                  </tr>
                ) : (
                  users.map((user, idx) => (
                    <React.Fragment key={user.id}>
                      <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">{idx + 1}</td>
                        <td className="px-6 py-4 flex items-center gap-2">
                          <div className="h-8 w-8 bg-[#74BF44] text-white flex items-center justify-center rounded-full">
                            <FiUser size={16} />
                          </div>
                          {user.username}
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {user.email}
                        </td>
                        <td className="px-6 py-4">
                          <span className="bg-[#E6F4EA] text-[#28a745] px-3 py-1 rounded-full text-sm">
                            {user.role.name}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-500 text-sm">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>

                        {roleId === 2 && (
                          <td className="px-6 py-4">
                            <button
                              onClick={() => handleExpandRow(user.id)}
                              className="bg-[#74BF44] text-white px-3 py-1.5 rounded hover:bg-green-600 text-sm transition-colors"
                            >
                              {expandedUserId === user.id
                                ? "Cancel"
                                : "Assign Moderator"}
                            </button>
                          </td>
                        )}

                        <td className="px-6 py-4">
                          <button
                            onClick={() =>
                              setDeleteConfirm({ open: true, userId: user.id })
                            }
                            className="text-red-500 hover:text-red-700 flex items-center gap-1 transition-colors"
                          >
                            <FiTrash2 size={16} /> Delete
                          </button>
                        </td>
                      </tr>

                      {/* Expanded Assign Row */}
                      {expandedUserId === user.id && (
                        <tr className="bg-gray-50 border-b border-gray-200">
                          <td colSpan={7} className="px-6 py-5">
                            <div className="flex flex-wrap gap-3 items-center">
                              {/* Faculty */}
                              <select
                                className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#74BF44] focus:border-transparent transition-all bg-white text-gray-700 min-w-[180px]"
                                value={selectedFaculty || ""}
                                onChange={(e) =>
                                  handleFacultySelect(Number(e.target.value))
                                }
                              >
                                <option value="">Select Faculty</option>
                                {faculties.map((f) => (
                                  <option key={f.id} value={f.id}>
                                    {f.name}
                                  </option>
                                ))}
                              </select>

                              {/* Level */}
                              <select
                                className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#74BF44] focus:border-transparent transition-all bg-white text-gray-700 min-w-[180px] disabled:bg-gray-100 disabled:cursor-not-allowed"
                                disabled={!selectedFaculty}
                                value={selectedLevel || ""}
                                onChange={(e) =>
                                  handleLevelSelect(Number(e.target.value))
                                }
                              >
                                <option value="">Select Level</option>
                                {levels.map((l) => (
                                  <option key={l.id} value={l.id}>
                                    {l.name}
                                  </option>
                                ))}
                              </select>

                              {/* Module */}
                              <select
                                className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#74BF44] focus:border-transparent transition-all bg-white text-gray-700 min-w-[180px] disabled:bg-gray-100 disabled:cursor-not-allowed"
                                disabled={!selectedLevel}
                                value={selectedModule || ""}
                                onChange={(e) =>
                                  setSelectedModule(Number(e.target.value))
                                }
                              >
                                <option value="">Select Module</option>
                                {modules.map((m) => (
                                  <option key={m.id} value={m.id}>
                                    {m.name || m.moduleName}
                                  </option>
                                ))}
                              </select>

                              {/* Role */}
                              <select
                                className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#74BF44] focus:border-transparent transition-all bg-white text-gray-700 min-w-[180px]"
                                value={selectedModuleRole}
                                onChange={(e) =>
                                  setSelectedModuleRole(Number(e.target.value))
                                }
                              >
                                <option value={1}>Module Leader</option>
                                <option value={2}>GTA</option>
                                <option value={3}>Tutor</option>
                              </select>

                              {/* Confirm */}
                              <button
                                onClick={() => handleAssignModerator(user.id)}
                                className="bg-[#74BF44] text-white px-5 py-2 rounded-md hover:bg-green-700 transition-colors font-medium shadow-sm"
                              >
                                Confirm
                              </button>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Delete confirmation modal */}
          {deleteConfirm.open && (
            <div className="fixed inset-0 flex items-start justify-center z-30">
              <div
                className="absolute inset-0 bg-black opacity-40"
                onClick={() => setDeleteConfirm({ open: false, userId: null })}
              />
              <div className="relative bg-white rounded-lg p-6 shadow-lg z-50 w-[400px] mt-20">
                <h2 className="text-lg font-semibold mb-4 text-gray-800">
                  Confirm Delete
                </h2>
                <p className="mb-6 text-gray-600">
                  Are you sure you want to delete this user?
                </p>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() =>
                      setDeleteConfirm({ open: false, userId: null })
                    }
                    className="px-4 py-2 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    className="px-4 py-2 rounded-md bg-[#66aa3b] text-white hover:bg-green-700 transition-colors"
                  >
                    Yes, Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
