"use client";

import { useEffect, useState, useCallback } from "react";
import { Edit, Trash2 } from "lucide-react";
import ModeratorProgram from "@/components/dropdown/ModeratorProgram";
import ModeratorLevel from "@/components/dropdown/ModeratorLevel";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { axiosInstance } from "@/services/axiosInstance";
import { motion } from "framer-motion";

interface Module {
  id: number | string;
  name: string;
  description: string;
  code: string;
  level?: {
    name?: string;
    faculty?: {
      name?: string;
    };
  };
}

export default function ModuleOverview() {
  const [modules, setModules] = useState<Module[]>([]);
  const [isChecked, setisChecked] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [selectedFacultyId, setSelectedFacultyId] = useState<number | null>(
    null
  );
  const [selectedLevelId, setSelectedLevelId] = useState<number | null>(null);

  const [moduleName, setModuleName] = useState("");
  const [moduleCode, setModuleCode] = useState("");
  const [moduleDescription, setModuleDescription] = useState("");
  const [moduleLeader, setModuleLeader] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const [deleteConfirm, setDeleteConfirm] = useState<{
    open: boolean;
    moduleId: number | string | null;
  }>({ open: false, moduleId: null });

  const router = useRouter();

  useEffect(() => {
    const StoredToken =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    const RoleSelected =
      localStorage.getItem("Role") || sessionStorage.getItem("Role");
    if (RoleSelected !== "Admin" || !StoredToken) {
      router.push("/");
    } else {
      setisChecked(true);
    }
  }, [router]);

  const fetchModules = useCallback(async () => {
    if (!selectedFacultyId || !selectedLevelId) {
      setModules([]);
      return;
    }
    try {
      const res = await axiosInstance.get(
        `/faculties/${selectedFacultyId}/levels/${selectedLevelId}/modules`
      );

      console.log("Modules API response:", res.data);

      setModules(res.data?.data || []);
    } catch (error) {
      console.error("Error fetching modules:", error);
      setModules([]);
    }
  }, [selectedFacultyId, selectedLevelId]);

  useEffect(() => {
    fetchModules();
  }, [fetchModules]);

  const resetForm = () => {
    setModuleName("");
    setModuleCode("");
    setModuleDescription("");
    setModuleLeader("");
    setSelectedFacultyId(null);
    setSelectedLevelId(null);
  };

  const handleCreateModule = async () => {
    if (
      !moduleName ||
      !moduleCode ||
      !moduleDescription ||
      !selectedLevelId ||
      !moduleLeader
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    if (isCreating) return;

    setIsCreating(true);
    try {
      await axiosInstance.post("/modules", {
        moduleName,
        moduleCode,
        moduleDescription,
        moduleLeader,
        levelId: selectedLevelId,
      });

      await fetchModules();
      setShowCreateModal(false);
      resetForm();
      toast.success("Module created successfully!");
    } catch (error) {
      toast.error("Failed to create module");
      console.error(error);
    } finally {
      setIsCreating(false);
    }
  };

  const confirmDeleteModule = (moduleId: number | string) => {
    setDeleteConfirm({ open: true, moduleId });
  };

  const handleDeleteModule = async () => {
    if (!deleteConfirm.moduleId) return;

    try {
      await axiosInstance.delete(`/modules/${deleteConfirm.moduleId}`);
      await fetchModules();
      toast.success("Module deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete module");
      console.error(error);
    } finally {
      setDeleteConfirm({ open: false, moduleId: null });
    }
  };

  return (
    <div className="px-8">
      {isChecked && (
        <div className="mt-8 bg-[#F7F7F7]">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <h1 className="text-[26px] font-[500]">
              Module <span className="text-[#74BF44] font-[600]">Overview</span>
            </h1>
            <p className="text-[18px] font-[400] text-gray-500 tracking-[-0.2px] mt-2">
              Manage your modules and their weekly content
            </p>
          </motion.div>

          <div className="flex items-center justify-end mt-4 space-x-2">
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-[#74BF44] hover:bg-white text-white px-6 py-2 rounded-md text-[16px] font-medium border-1 border-[#74BF44] hover:text-[#74BF44]"
            >
              Create Module
            </button>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="bg-white rounded-[7px] border border-gray-300 shadow-[0_2px_8px_rgba(0,0,0,0.3)] mt-9 p-10 mb-14">
              <div className="flex justify-between">
                <div>
                  <h2 className="text-[25px] font-[600] tracking-[0.5px] text-gray-800 mb-1">
                    Existing Modules
                  </h2>
                  <p className="text-gray-500 text-[18px] mb-6 font-[400] tracking-[-0.2px]">
                    Manage your created modules and their details
                  </p>
                </div>
                <div className="flex gap-4">
                  <ModeratorProgram
                    selectedFacultyId={selectedFacultyId}
                    setSelectedFacultyId={(id) => {
                      setSelectedFacultyId(id);
                      setSelectedLevelId(null);
                    }}
                  />
                  <ModeratorLevel
                    selectedFacultyId={selectedFacultyId}
                    selectedLevelId={selectedLevelId}
                    setSelectedLevelId={setSelectedLevelId}
                  />
                </div>
              </div>

              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="text-[20px] font-normal border-b border-gray-300">
                      <th className="py-2 px-3 font-normal">Module</th>
                      <th className="py-2 px-3 font-normal">Code</th>

                      <th className="py-2 px-3 font-normal">Level</th>
                      
                      <th className="py-2 px-3 font-normal">Status</th>
                      <th className="py-2 px-3 font-normal">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-[20px]">
                    {modules.length === 0 ? (
                      <tr>
                        <td
                          colSpan={6} 
                          className="text-center py-10 text-gray-500 font-[400]"
                        >
                          Please filter by Program and level to get the modules
                        </td>
                      </tr>
                    ) : (
                      modules.map((mod) => (
                        <motion.tr
                          key={mod.id}
                          className="border-b border-gray-300"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, ease: "easeOut" }}
                        >
                          <td className="py-5 px-3 w-[600px]">
                            <div className="font-[400] tracking-[-0.2px]">
                              {mod.name}
                            </div>
                            <div
                              className="text-gray-500 text-[17px] tracking-[-0.19px] mt-1 truncate"
                              style={{ maxWidth: "550px" }}
                              title={mod.description}
                            >
                              {mod.description}
                            </div>
                          </td>

                          <td className="text-[18px] text-gray-600 py-5 px-3">
                            {mod.code}
                          </td>

                          <td className="text-[18px] text-gray-600 py-5 px-3">
                            {mod.level?.name || "N/A"}
                          </td>

                         
                          <td className="text-[18px] text-gray-600 py-5 px-3">
                            <span className="bg-[#A4C93A] text-white text-xs font-medium px-3 py-2 rounded-[7px]">
                              Active
                            </span>
                          </td>

                          <td className="py-10 px-3 flex space-x-2">
                            <button className="p-1 rounded hover:bg-gray-100">
                              <Edit className="w-5 h-5 text-gray-600 cursor-pointer" />
                            </button>
                            <button
                              className="p-1 rounded hover:bg-gray-100"
                              onClick={() => confirmDeleteModule(mod.id)}
                            >
                              <Trash2 className="w-5 h-5 text-red-500" />
                            </button>
                          </td>
                        </motion.tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>

          {deleteConfirm.open && (
            <div className="fixed inset-0 flex items-center justify-center z-50">
              <div
                className="absolute inset-0 bg-opacity-30"
                onClick={() =>
                  setDeleteConfirm({ open: false, moduleId: null })
                }
              />
              <motion.div
                className="relative bg-white rounded-lg p-6 shadow-lg z-50 w-[400px]"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <h2 className="text-lg font-semibold mb-4">Confirm Delete</h2>
                <p className="mb-6">
                  Are you sure you want to delete this module?
                </p>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() =>
                      setDeleteConfirm({ open: false, moduleId: null })
                    }
                    className="px-4 py-2 rounded-md border border-gray-300"
                  >
                    No
                  </button>
                  <button
                    onClick={handleDeleteModule}
                    className="px-4 py-2 rounded-md bg-[#66aa3b] text-white hover:bg-green-700"
                  >
                    Yes, Delete
                  </button>
                </div>
              </motion.div>
            </div>
          )}

          {showCreateModal && (
            <div className="fixed inset-0 flex items-center justify-center z-50">
              <div
                className="absolute inset-0 bg-opacity-10 backdrop-blur-[4px]"
                onClick={() => {
                  setShowCreateModal(false);
                  resetForm();
                }}
              />
              <motion.div
                className="relative bg-white rounded-[10px] p-8 w-[600px] shadow-lg z-50"
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <h2 className="text-[24px] font-[600] mb-2 tracking-[0.5px]">
                  Create New Module
                </h2>
                <p className="text-gray-500 mb-6 text-[18px] font-[400] tracking-[-0.2px]">
                  Fill in the details to create a new learning module
                </p>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-[16px] font-[400] mb-2">
                      Module Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Introduction to Programming"
                      className="w-full border-gray-400 border rounded-md px-3 py-2"
                      value={moduleName}
                      onChange={(e) => setModuleName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-[16px] font-[400] mb-2">
                      Module Code <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="4CS001"
                      className="w-full border-gray-400 border rounded-md px-3 py-2"
                      value={moduleCode}
                      onChange={(e) => setModuleCode(e.target.value)}
                    />
                  </div>
                </div>

                <h3 className="text-[18px] font-[400] mb-2">Classification</h3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-[16px] font-[400] mb-1">
                      Program <span className="text-red-500">*</span>
                    </label>
                    <ModeratorProgram
                      selectedFacultyId={selectedFacultyId}
                      setSelectedFacultyId={(id) => {
                        setSelectedFacultyId(id);
                        setSelectedLevelId(null);
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-[16px] font-[400] mb-1">
                      Level <span className="text-red-500">*</span>
                    </label>
                    <ModeratorLevel
                      selectedFacultyId={selectedFacultyId}
                      selectedLevelId={selectedLevelId}
                      setSelectedLevelId={setSelectedLevelId}
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-[16px] font-[400] mb-2">
                    Topic Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    placeholder="Fundamentals of programming using Python"
                    className="w-full border-gray-400 border rounded-md px-3 py-2"
                    value={moduleDescription}
                    onChange={(e) => setModuleDescription(e.target.value)}
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-[16px] font-[400] mb-1">
                    Module Leader <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Dr. Subham"
                    className="w-full border-gray-400 border rounded-md px-3 py-2"
                    value={moduleLeader}
                    onChange={(e) => setModuleLeader(e.target.value)}
                  />
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => {
                      setShowCreateModal(false);
                      resetForm();
                    }}
                    className="px-4 py-2 rounded-md border border-gray-300 hover:bg-[#6868681A]"
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 rounded-md bg-[#74BF44] text-white hover:bg-white border-1 border-[#74BF44] hover:text-[#74BF44]"
                    onClick={handleCreateModule}
                    disabled={isCreating}
                  >
                    {isCreating ? "Creating..." : "Create Module"}
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
