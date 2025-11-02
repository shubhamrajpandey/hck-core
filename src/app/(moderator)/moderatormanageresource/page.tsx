"use client";

import React, { useState, useEffect } from "react";
import { Trash2, Pencil, X, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { axiosInstance } from "@/services/axiosInstance";
import toast, { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import axios from "axios";

interface FileItem {
  id?: string | number;
  fileName: string;
  filePath: string;
}

interface Resource {
  id: string | number;
  title: string;
  description: string;
  link: string;
  files: FileItem[];
}

interface Module {
  id: number;
  title: string;
}

interface Week {
  weekId: string | number;
  weekName: string;
}

interface WeekFile {
  fileId: string | number;
  fileName: string;
  filePath: string;
}

interface WeekLink {
  id: string | number;
  linkName: string;
  linkUrl: string;
}

interface WeekContent {
  id: string | number;
  title?: string;
  content?: string;
  files?: WeekFile[];
  links?: WeekLink[];
}

interface Module {
  id: number;
  title: string;
}
export default function ManageResourcesPage() {
  const router = useRouter();
  const [isChecked, setIsChecked] = useState(false);
  const [expandedRow, setExpandedRow] = useState<string | number | null>(null);
  const [mode, setMode] = useState<"program" | "extra">("extra");
  const [resources, setResources] = useState<Resource[]>([]);
  const [loadingResources, setLoadingResources] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [assignedModules, setAssignedModules] = useState<Module[]>([]);
  const [weeks, setWeeks] = useState<Week[]>([]);
  const [selectedModule, setSelectedModule] = useState<number | null>(null);
  const [selectedWeek, setSelectedWeek] = useState<string>("");

  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const [formData, setFormData] = useState<Partial<Resource>>({});

  // Check moderator auth
  useEffect(() => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    const role = localStorage.getItem("Role") || sessionStorage.getItem("Role");
    if (role !== "Moderator" || !token) {
      router.push("/");
    } else {
      setIsChecked(true);
    }
  }, [router]);

  // Fetch assigned modules
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
          (m: { Module: { id: number; name: string } }) => ({
            id: m.Module.id,
            title: m.Module.name,
          })
        );
        setAssignedModules(normalized);
      } catch (err) {
        console.error(err);
        setAssignedModules([]);
      }
    };
    fetchAssignedModules();
  }, []);

  // Fetch weeks for selected module
  useEffect(() => {
    const fetchWeeks = async () => {
      if (!selectedModule) {
        setWeeks([]);
        setSelectedWeek("");
        return;
      }
      try {
        const token =
          localStorage.getItem("token") || sessionStorage.getItem("token");
        const res = await axiosInstance.get(
          `/modules/${selectedModule}/weeks`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setWeeks(res.data.data || []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch weeks");
      }
    };
    fetchWeeks();
  }, [selectedModule]);

  // Fetch resources
  const processWeekContents = (weekContents: WeekContent[]) => {
    const allResources: Resource[] = [];
    weekContents.forEach((content) => {
      content.files?.forEach((file, fileIndex) => {
        allResources.push({
          id: `${content.id}-file-${fileIndex}`,
          title: content.title || file.fileName || "Untitled",
          description: content.content || "",
          link: file.filePath || "",
          files: [
            {
              id: file.fileId,
              fileName: file.fileName,
              filePath: file.filePath,
            },
          ],
        });
      });
      content.links?.forEach((link, linkIndex) => {
        allResources.push({
          id: `${content.id}-link-${linkIndex}`,
          title: content.title || link.linkName || "Untitled",
          description: content.content || "",
          link: link.linkUrl || "",
          files: [],
        });
      });
    });
    setResources(allResources);
    setPage(1);
    setTotalPages(1);
  };

  const fetchResources = React.useCallback(
    async (pageNumber: number) => {
      setLoadingResources(true);
      try {
        const token =
          localStorage.getItem("token") || sessionStorage.getItem("token");
        if (!token) return;

        if (mode === "extra") {
          const res = await axiosInstance.get(
            `/extra-resources?page=${pageNumber}&limit=10`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setResources(res.data.data.resources || []);
          setPage(res.data.data.page || 1);
          setTotalPages(res.data.data["total pages"] || 1);
        } else if (mode === "program") {
          if (selectedWeek) {
            const res = await axiosInstance.get(
              `/weeks/${selectedWeek}/week-contents`,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            processWeekContents(res.data.data || []);
          } else {
            setResources([]);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingResources(false);
      }
    },
    [mode, selectedWeek]
  );

  useEffect(() => {
    if (!isChecked) return;
    fetchResources(page);
  }, [isChecked, page, mode, selectedWeek, selectedModule, fetchResources]);

  const handleModuleSelect = (id: number) => {
    setSelectedModule(id);
    setSelectedWeek("");
    setResources([]);
  };

  const handleWeekSelect = (id: string) => {
    setSelectedWeek(id);
    setResources([]);
    fetchResources(1);
  };

  const handleDelete = async (id: string) => {
    const toastId = toast.loading("Deleting...");
    try {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");

      let endpoint = "";
      if (mode === "extra") {
        endpoint = `/extra-resources/${id}`;
      } else {
        const resource = resources.find((res) => res.id === id);
        if (!resource)
          return toast.error("Resource not found", { id: toastId });

        if (resource.files && resource.files.length > 0) {
          endpoint = `/files/${resource.files[0].id}`;
        } else {
          endpoint = `/links/${resource.id.toString().split("-")[0]}`;
        }
      }

      await axiosInstance.delete(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Deleted successfully", { id: toastId });
      setResources((prev) => prev.filter((res) => res.id !== id));
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete", { id: toastId });
    }
  };

  const handleEditSave = async () => {
    if (!editingResource) return;
    const toastId = toast.loading("Updating...");
    try {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      const endpoint =
        mode === "extra"
          ? `/extra-resources/${editingResource.id}`
          : `/links/${editingResource.id}`;
      await axiosInstance.patch(
        endpoint,
        mode === "extra"
          ? formData
          : { linkName: formData.title, linkUrl: formData.link },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Updated successfully", { id: toastId });
      setEditingResource(null);
      fetchResources(page);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update", { id: toastId });
    }
  };

  return (
    <>
      <Toaster position="top-center" />
      {isChecked && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="p-8 bg-[#F7F7F7] min-h-screen"
        >
          {/* Header */}
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h1 className="text-[26px] font-[500]">
                Manage{" "}
                <span className="text-[#74BF44] font-[600]">
                  {mode === "extra" ? "Extra" : "Program"} Resources
                </span>
              </h1>
              <p className="text-gray-500 text-[18px] mt-1">
                Manage {mode} learning resources with pagination
              </p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setMode("program")}
                className={`px-6 py-2 rounded ${
                  mode === "program"
                    ? "bg-[#74BF44] text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                Program Resources
              </button>
              <button
                onClick={() => setMode("extra")}
                className={`px-6 py-2 rounded ${
                  mode === "extra"
                    ? "bg-[#74BF44] text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                Extra Resources
              </button>
            </div>
          </div>

          {/* Dropdown filters */}
          {mode === "program" && (
            <div className="mb-8 mt-12 flex flex-wrap gap-4 justify-end">
              {/* Module Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger
                  disabled={assignedModules.length === 0}
                  className={`flex justify-between items-center px-3 py-2 border border-[#74BF44] rounded bg-white text-gray-500 w-[450px] ${
                    assignedModules.length === 0
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  {assignedModules.find((m) => m.id === selectedModule)
                    ?.title || "Select Module"}
                  <ChevronDown size={16} />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[450px] bg-white border border-gray-300 text-gray-500">
                  {assignedModules.length === 0 && (
                    <DropdownMenuItem className="text-gray-400">
                      No modules assigned
                    </DropdownMenuItem>
                  )}
                  {assignedModules.map((m) => (
                    <DropdownMenuItem
                      key={m.id}
                      onSelect={() => handleModuleSelect(m.id)}
                      className="hover:bg-[#E6F4EA]"
                    >
                      {m.title}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Week Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger
                  disabled={!selectedModule}
                  className={`flex justify-between items-center px-3 py-2 border border-[#74BF44] rounded bg-white text-gray-500 w-[140px] ${
                    !selectedModule ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {weeks.find((w) => w.weekId.toString() === selectedWeek)
                    ?.weekName || "Select Week"}
                  <ChevronDown size={16} />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[140px] bg-white border border-gray-300 text-gray-500">
                  {weeks.length === 0 && (
                    <DropdownMenuItem className="text-gray-400">
                      No weeks
                    </DropdownMenuItem>
                  )}
                  {weeks.map((w) => (
                    <DropdownMenuItem
                      key={w.weekId}
                      onSelect={() => handleWeekSelect(w.weekId.toString())}
                      className="hover:bg-[#E6F4EA]"
                    >
                      {w.weekName}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}

          {/* Table */}
          <div className="bg-white shadow-xl rounded-[10px] overflow-hidden">
            <table className="w-full border-collapse">
              <thead className="bg-[#E6F4EA] text-[#74BF44]">
                <tr>
                  <th className="text-left px-6 py-3">Title</th>
                  <th className="text-left px-6 py-3">Description</th>
                  <th className="text-left px-6 py-3">Link</th>
                  <th className="text-left px-6 py-3">Files</th>
                  <th className="text-left px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loadingResources ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-6 text-center text-gray-500"
                    >
                      Loading resources...
                    </td>
                  </tr>
                ) : resources.length > 0 ? (
                  resources.map((res) => (
                    <React.Fragment key={res.id}>
                      <tr
                        className="border-b border-gray-300 hover:bg-gray-50 transition h-[80px] cursor-pointer"
                        onClick={() =>
                          setExpandedRow(expandedRow === res.id ? null : res.id)
                        }
                      >
                        <td className="px-6 py-4 font-medium text-gray-800">
                          {res.title}
                        </td>
                        <td
                          className="px-6 py-4 text-gray-600 text-sm max-w-[250px] truncate"
                          dangerouslySetInnerHTML={{ __html: res.description }}
                        />
                        <td className="px-6 py-4 text-green-600 underline text-sm">
                          {res.link && (
                            <a href={res.link} target="_blank" rel="noreferrer">
                              {res.link}
                            </a>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {res.files && res.files.length > 0 ? (
                            <span>{res.files.length} file(s)</span>
                          ) : (
                            "No files"
                          )}
                        </td>
                        <td className="px-6 py-4 flex items-center gap-3">
                          <button
                            className="text-gray-600 hover:text-gray-800"
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingResource(res);
                              setFormData({
                                title: res.title,
                                description: res.description,
                                link: res.link,
                              });
                            }}
                          >
                            <Pencil size={18} />
                          </button>
                          <button
                            className="text-red-500 hover:text-red-700"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(res.id.toString());
                            }}
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>

                      {/* Expanded Row */}
                      {expandedRow === res.id && (
                        <tr className="bg-gray-50 border-b">
                          <td
                            colSpan={5}
                            className="px-6 py-4 text-sm text-gray-700"
                          >
                            <div>
                              <span className="font-semibold">
                                Full Description:
                              </span>
                              <div
                                className="mt-1 text-gray-600"
                                dangerouslySetInnerHTML={{
                                  __html: res.description,
                                }}
                              />
                            </div>
                            {res.files && res.files.length > 0 && (
                              <div className="mt-2">
                                <span className="font-semibold">Files:</span>
                                <ul className="list-disc pl-6 mt-1">
                                  {res.files.map((file, index) => (
                                    <li
                                      key={
                                        file.id || `${file.fileName}-${index}`
                                      }
                                    >
                                      <a
                                        href={file.filePath}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-green-600 underline"
                                      >
                                        {file.fileName}
                                      </a>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-6 text-center text-gray-500"
                    >
                      {mode === "program"
                        ? selectedModule && selectedWeek
                          ? "No program resources available for this week"
                          : "Please select a module and week to view program resources"
                        : "No extra resources available"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {mode === "extra" && (
            <div className="flex justify-between items-center mt-4">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-gray-700">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}

          {/* Edit Modal */}
          {editingResource && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-lg p-6 w-[500px]">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Edit Resource</h2>
                  <button
                    onClick={() => setEditingResource(null)}
                    className="text-gray-600 hover:text-gray-800"
                  >
                    <X size={20} />
                  </button>
                </div>
                <div className="flex flex-col gap-4">
                  <input
                    type="text"
                    value={formData.title || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="border rounded px-3 py-2 w-full"
                    placeholder="Title"
                  />
                  {mode === "extra" && (
                    <textarea
                      value={formData.description || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      className="border rounded px-3 py-2 w-full"
                      placeholder="Description"
                    />
                  )}
                  {mode === "program" && (
                    <input
                      type="text"
                      value={formData.link || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, link: e.target.value })
                      }
                      className="border rounded px-3 py-2 w-full"
                      placeholder="Link URL"
                    />
                  )}

                  <button
                    onClick={handleEditSave}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </>
  );
}
