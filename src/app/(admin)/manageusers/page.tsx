"use client";

import React, { useEffect, useState } from "react";
import RoleDropdown from "@/components/dropdown/Roledropdown";
import ModeratorRoleDropDown from "@/components/dropdown/ModeratorRoleDropDown";
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

interface AxiosUsersResponse {
  data: {
    data: User[];
  };
}

interface DeleteConfirmState {
  open: boolean;
  userId: number | null;
}

export default function ManageUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isChecked, setisChecked] = useState(false);
  const [roleId, setRoleId] = useState<number>(3);
  const [loading, setLoading] = useState<boolean>(false);
  const [deleteConfirm, setDeleteConfirm] = useState<DeleteConfirmState>({
    open: false,
    userId: null,
  });

  const router = useRouter();

  useEffect(() => {
    const StoredToken =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    const RoleSelected =
      localStorage.getItem("Role") || sessionStorage.getItem("Role");
    if (RoleSelected !== "Admin" || !StoredToken) {
      router.push("/");
    }
    setisChecked(true);
  }, [router]);

  useEffect(() => {
    fetchUsers(roleId);
  }, [roleId]);

  const fetchUsers = async (role: number) => {
    try {
      setLoading(true);

      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const res = await axiosInstance.get<AxiosUsersResponse>(
        `/users/${role}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUsers(res.data.data.data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("Error fetching users:", err.message);
        toast.error(`Failed to fetch users: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAssignRole = async (userId: number, newRole: string) => {
    try {
      const toastId = toast.loading("Assigning role...");

      await axiosInstance.put(
        `/users/${userId}/assign-role`,
        { role: newRole },
        {
          headers: {
            Authorization: `Bearer ${
              localStorage.getItem("token") || sessionStorage.getItem("token")
            }`,
          },
        }
      );

      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId ? { ...u, role: { ...u.role, name: newRole } } : u
        )
      );

      toast.success("Role assigned successfully!", { id: toastId });
    } catch (err) {
      console.error("Error assigning role:", err);
      toast.error("Failed to assign role!");
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm.userId) return;

    const toastId = toast.loading("Deleting user...");

    try {
      await axiosInstance.delete(`/users/${deleteConfirm.userId}`);
      setUsers((prev) => prev.filter((u) => u.id !== deleteConfirm.userId));
      toast.success("User deleted successfully!", { id: toastId });
    } catch (err: unknown) {
      console.error("Error deleting user:", err);
      toast.error("Failed to delete user!", { id: toastId });
    } finally {
      setDeleteConfirm({ open: false, userId: null });
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
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-[26px] font-[500]">
              Manage <span className="text-[#74BF44] font-[600]">Users</span>
            </h1>
            <div className="mt-8">
              <RoleDropdown selected={roleId} onChange={setRoleId} />
            </div>
          </div>

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
                    <th className="text-left px-6 py-3">Assign Role</th>
                  )}

                  <th className="text-left px-6 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan={roleId === 2 ? 7 : 6}
                      className="px-6 py-6 text-center text-gray-500"
                    >
                      Loading users...
                    </td>
                  </tr>
                ) : users.length > 0 ? (
                  users.map((user, idx) => (
                    <tr
                      key={user.id}
                      className="border-b border-gray-300 hover:bg-gray-50 transition"
                    >
                      <td className="px-6 py-4 text-gray-700">{idx + 1}</td>
                      <td className="px-6 py-4 flex items-center gap-2">
                        <div className="h-8 w-8 flex items-center justify-center rounded-full bg-[#74BF44] text-white">
                          <FiUser size={16} />
                        </div>
                        {user.username}
                      </td>
                      <td className="px-6 py-4 text-gray-600">{user.email}</td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 rounded-full text-sm font-medium bg-[#E6F4EA] text-[#28a745]">
                          {user.role.name}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-500 text-sm">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>

                      {roleId === 2 && (
                        <td className="px-6 py-4">
                          <ModeratorRoleDropDown
                            userId={user.id}
                            onAssignRole={handleAssignRole}
                          />
                        </td>
                      )}

                      <td className="px-6 py-4">
                        <button
                          onClick={() =>
                            setDeleteConfirm({ open: true, userId: user.id })
                          }
                          className="text-red-500 hover:text-red-700 flex items-center gap-1"
                        >
                          <FiTrash2 size={16} /> Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={roleId === 2 ? 7 : 6}
                      className="px-6 py-6 text-center text-gray-500"
                    >
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {deleteConfirm.open && (
            <div className="fixed inset-0 flex items-start justify-center z-30 ml-50">
              <div
                className="absolute inset-0 bg-opacity-30"
                onClick={() => setDeleteConfirm({ open: false, userId: null })}
              />
              <div className="relative bg-white rounded-lg p-6 shadow-lg z-50 w-[400px] mt-1">
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
                    className="px-4 py-2 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    className="px-4 py-2 rounded-md bg-[#66aa3b] text-white hover:bg-green-700"
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
