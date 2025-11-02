"use client";

import WeekManager from "@/components/dropdown/WeekDropdownManager";
import RichTextEditor from "@/components/layout/RichTextEditor/RichTextEditor";
import React, { useRef, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { File as FileIcon, Link as LinkIcon, Download, X } from "lucide-react";
import { Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import CategoryDropDown from "@/components/dropdown/ResourceCategory";
import ResourceTypeDropdown from "@/components/dropdown/ResourceTypeDropdown";
import { axiosInstance } from "@/services/axiosInstance";
import toast, { Toaster } from "react-hot-toast";
import { useSelected } from "@/context/selectedContext";
import { motion } from "framer-motion";
import AssignedModuleDropdown from "@/components/dropdown/AssignedModuleDropdown";

type FormData = {
  topic: string;
  description: string;
  tag: string;
};

interface ExtraResourceFormData {
  topic: string;
  tag?: string;
}
interface Category {
  categoryId: number;
  categoryName: string;
}

function Page() {
  const router = useRouter();
  const [isChecked, setisChecked] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { selectedWeekContext } = useSelected();

  useEffect(() => {
    const StoredToken =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    const RoleSelected =
      localStorage.getItem("Role") || sessionStorage.getItem("Role");
    if (RoleSelected !== "Moderator" || !StoredToken) {
      router.push("/");
    }
    setisChecked(true);
  }, [router]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>();

  const [description, setDescription] = useState<string>("");

  const [resourceType, setResourceType] = useState<"normal" | "extra">(
    "normal"
  );



  const [selectedModuleId, setSelectedModuleId] = useState<number | null>(null);

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [errorCategories, setErrorCategories] = useState<string | null>(null);

  const [newCategory, setNewCategory] = useState("");
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(
    null
  );
  const [manageMode, setManageMode] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoadingCategories(true);
    try {
      const response = await axiosInstance.get("/categories");
      if (response.data && Array.isArray(response.data.data)) {
        setCategories(response.data.data);
        setErrorCategories(null);
      } else {
        setCategories([]);
        setErrorCategories("No categories found");
      }
    } catch (err) {
      console.error(err);
      setErrorCategories("Failed to fetch categories");
    } finally {
      setLoadingCategories(false);
    }
  };

  const handleAddFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files ? Array.from(e.target.files) : [];
    if (selectedFiles.length > 0) {
      setFiles((prev) => [...prev, ...selectedFiles]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const [externalLinks, setExternalLinks] = useState<string[]>([]);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [newLink, setNewLink] = useState("");

  const handleAddLinkClick = () => {
    setShowLinkInput(true);
    setNewLink("");
  };

  const handleSaveLink = () => {
    if (newLink.trim() !== "") {
      setExternalLinks((prev) => [...prev, newLink.trim()]);
    }
    setShowLinkInput(false);
  };

  const handleCancelLink = () => {
    setShowLinkInput(false);
  };

  const handleRemoveLink = (index: number) => {
    setExternalLinks((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: ExtraResourceFormData) => {
    if (submitting) return;
    setSubmitting(true);

    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");

    if (resourceType === "extra") {
      const toastId = toast.loading("Creating extra resource...");
      try {
        const formData = new FormData();
        formData.append("extraResourceTitle", data.topic);
        formData.append("extraResourceDescription", description);
        formData.append("link", externalLinks.join(","));
        formData.append("categoryId", selectedCategory || "");
        formData.append("keywords", data.tag || "");
        files.forEach((file) => formData.append("files", file));

        await axiosInstance.post("/extra-resources", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });

        toast.success("Extra resource created successfully!", { id: toastId });
      } catch (err) {
        toast.error("Failed to create extra resource", { id: toastId });
        console.error(err);
      } finally {
        setSubmitting(false);
      }
    } else {
      const toastId = toast.loading("Creating normal resource...");
      try {
        if (!selectedWeekContext) {
          toast.error("Please select or create a week first", { id: toastId });
          setSubmitting(false);
          return;
        }

        const formData = new FormData();
        formData.append("contentTitle", data.topic);
        formData.append("weekContent", description);
        formData.append("weekId", selectedWeekContext.toString());

        externalLinks.forEach((url, idx) => {
          formData.append("linkNames", `Link ${idx + 1}`);
          formData.append("linkUrls", url);
        });

        files.forEach((file) => formData.append("files", file));

        await axiosInstance.post("/week-contents", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });

        toast.success("Normal resource created successfully!", { id: toastId });
      } catch (err) {
        toast.error("Failed to create normal resource", { id: toastId });
        console.error(err);
      } finally {
        setSubmitting(false);
      }
    }

    setValue("topic", "");
    setValue("tag", "");
    setDescription("");
    setFiles([]);
    setExternalLinks([]);
    setSelectedCategory(null);
    setSelectedModuleId(null);
  };

  if (!isChecked) return null;

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;
    try {
      await axiosInstance.post("/categories/category", {
        categoryName: newCategory,
      });
      setNewCategory("");
      fetchCategories();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateCategory = async () => {
    if (!newCategory.trim() || editingCategoryId === null) return;
    try {
      await axiosInstance.patch(`/categories/${editingCategoryId}`, {
        categoryName: newCategory,
      });
      setEditingCategoryId(null);
      setNewCategory("");
      fetchCategories();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteCategory = async (id: number) => {
    try {
      await axiosInstance.delete(`/categories/${id}`);
      fetchCategories();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-[calc(100vh-40px)] pb-12">
      <Toaster position="top-center" reverseOrder={false} />

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-9xl mx-auto px-6 lg:px-8"
      >
        {/* Header */}
        <div className="pt-8">
          <h1 className="text-2xl lg:text-[26px] font-semibold text-gray-900">
            Create <span className="text-[#74BF44]">New Resource</span>
          </h1>
          <p className="mt-2 text-base text-gray-500">
            Add educational resources to help students learn effectively
          </p>
        </div>

        {/* Main content cards */}
        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
          {/* Resource Information card */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.3)] p-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-[20px] font-semibold text-gray-800">
                  Resource Information
                </h2>
                <p className="mt-1 text-[16px] text-gray-500">
                  Enter the basic details for your educational resource
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="mt-2">
                  <AssignedModuleDropdown
                    selectedModuleId={selectedModuleId}
                    setSelectedModuleId={setSelectedModuleId}
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="col-span-1 lg:col-span-2 space-y-4">
                <div>
                 <label className="text-[17px] font-[400] text-gray-700">
                    Topic <span className="text-red-600">*</span>
                  </label>
                  <input
                    {...register("topic", { required: "Topic is required" })}
                    type="text"
                    placeholder="Enter resource topic/title"
                    className="mt-2 w-full rounded-md border border-gray-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#74BF44]  placeholder:text-[16px]"
                  />
                  {errors.topic && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.topic.message}
                    </p>
                  )}
                </div>

                <div className="mt-6">
                  <label className="text-[17px] font-[400] text-gray-700">
                    Resource Type <span className="text-red-600">*</span>
                  </label>
                  <ResourceTypeDropdown
                    resourceType={resourceType}
                    setResourceType={setResourceType}
                  />
                </div>

                <div>
                  <label className="text-[17px] font-[400] text-gray-700">
                    Description <span className="text-red-600">*</span>
                  </label>
                  <div className="mt-2">
                    <RichTextEditor
                      value={description}
                      onChange={(val) => {
                        setDescription(val);
                        setValue("description", val);
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="col-span-1 space-y-4">
                <div>
                 <label className="text-[17px] font-[400] text-gray-700">
                    Language/Tag
                  </label>
                  <input
                    {...register("tag")}
                    type="text"
                    placeholder="HTML, CSS, JavaScript"
                    className="mt-2 w-full rounded-md border border-gray-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#74BF44] placeholder:text-[16px]"
                  />
                </div>

                {resourceType === "normal" ? (
                  <>
                    <div>
                     <label className="text-[17px] font-[400] text-gray-700">
                        Week <span className="text-red-600">*</span>
                      </label>
                      <div className="mt-5">
                        <WeekManager selectedModuleId={selectedModuleId} />
                      </div>
                    </div>
                  </>
                ) : (
                  <div>
                    <label className="flex items-center justify-between text-sm font-medium text-gray-700">
                      <span>
                        Category <span className="text-red-600">*</span>
                      </span>
                      <span
                        className="text-sm text-[#74BF44] cursor-pointer hover:underline"
                        onClick={() => setManageMode((p) => !p)}
                      >
                        {manageMode ? "Close Manage" : "Manage Category"}
                      </span>
                    </label>

                    {!manageMode ? (
                      <div className="mt-2">
                        <CategoryDropDown
                          selectedCategoryId={
                            selectedCategory ? parseInt(selectedCategory) : null
                          }
                          setSelectedCategoryId={(id) =>
                            setSelectedCategory(id?.toString() ?? null)
                          }
                        />
                      </div>
                    ) : (
                      <div className="mt-3">
                        <div className="flex gap-2 items-center">
                          <input
                            type="text"
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value)}
                            placeholder="Enter category name"
                            className="flex-1 rounded-md border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#74BF44]"
                          />
                          {editingCategoryId ? (
                            <button
                              type="button"
                              onClick={handleUpdateCategory}
                              className="px-3 py-2 rounded-md bg-[#74BF44] text-white text-sm font-medium hover:bg-green-600"
                            >
                              Update
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={handleAddCategory}
                              className="px-3 py-2 rounded-md bg-[#74BF44] text-white text-sm font-medium hover:bg-green-600"
                            >
                              Add
                            </button>
                          )}
                        </div>

                        <div className="mt-3 max-h-48 overflow-y-auto border border-gray-100 rounded-md">
                          {loadingCategories ? (
                            <div className="p-3 text-center text-gray-400">
                              Loading categories...
                            </div>
                          ) : errorCategories ? (
                            <div className="p-3 text-center text-red-500">
                              {errorCategories}
                            </div>
                          ) : categories.length > 0 ? (
                            categories.map((cat) => (
                              <div
                                key={cat.categoryId}
                                className={`flex items-center justify-between px-3 py-2 text-sm cursor-pointer border-b last:border-none ${
                                  editingCategoryId === cat.categoryId
                                    ? "bg-yellow-50"
                                    : "hover:bg-gray-50"
                                }`}
                                onClick={() =>
                                  setSelectedCategory(cat.categoryId.toString())
                                }
                              >
                                <span className="truncate">
                                  {cat.categoryName}
                                </span>
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setEditingCategoryId(cat.categoryId);
                                      setNewCategory(cat.categoryName);
                                    }}
                                    className="text-blue-500"
                                    title="Edit"
                                  >
                                    <Pencil size={16} />
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteCategory(cat.categoryId);
                                    }}
                                    className="text-red-500"
                                    title="Delete"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="p-3 text-center text-gray-400">
                              No categories found
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Attachments card */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.3)] p-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-[22px] font-semibold text-gray-800">
                  Attachments <span className="text-red-600">*</span>
                </h2>
                <p className="mt-1 text-[16px] text-gray-500">
                  Upload multiple files and add multiple external links to
                  support your resource
                </p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Files column */}
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-medium text-gray-700 text-[17px]">  
                    Files ({files.length})
                  </h3>
                  <button
                    type="button"
                    onClick={handleAddFileClick}
                    className="inline-flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md text-sm font-semibold hover:bg-gray-50"
                  >
                    <FileIcon size={16} />
                    Add Another File
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    multiple
                  />
                </div>

                <div className="mt-4">
                  {files.length === 0 ? (
                    <div className="h-72 rounded-md border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400">
                      <FileIcon size={64} />
                      <p className="mt-4 text-lg">No files added yet</p>
                      <button
                        type="button"
                        onClick={handleAddFileClick}
                        className="mt-4 inline-flex items-center gap-3 px-4 py-2 border border-gray-300 rounded-md font-semibold hover:bg-gray-50"
                      >
                        <span className="text-2xl">+</span>
                        Add Your First File
                      </button>
                    </div>
                  ) : (
                    <div className="rounded-md border border-gray-200 divide-y">
                      {files.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between px-4 py-3 text-sm"
                        >
                          <div className="truncate pr-4">{file.name}</div>
                          <div className="flex items-center gap-3">
                            <a
                              // optional: create object url for preview (keeps logic unchanged)
                              href={URL.createObjectURL(file)}
                              target="_blank"
                              rel="noreferrer"
                              className="text-gray-600 hover:text-gray-800 underline text-sm"
                            >
                              Open
                            </a>
                            <button
                              type="button"
                              onClick={() => handleRemoveFile(index)}
                              className="text-red-500 hover:text-red-700"
                              title="Remove"
                            >
                              <X size={18} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* External links column */}
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-medium text-gray-700 text-[17px]">
                    External Links ({externalLinks.length})
                  </h3>
                  <button
                    type="button"
                    onClick={handleAddLinkClick}
                    className="inline-flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md text-sm font-semibold hover:bg-gray-50"
                  >
                    <LinkIcon size={16} />
                    Add Another Link
                  </button>
                </div>

                <div className="mt-4">
                  {externalLinks.length === 0 && !showLinkInput ? (
                    <div className="h-72 rounded-md border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400">
                      <LinkIcon size={64} />
                      <p className="mt-4 text-lg">
                        No external links added yet
                      </p>
                      <button
                        type="button"
                        onClick={handleAddLinkClick}
                        className="mt-4 inline-flex items-center gap-3 px-4 py-2 border border-gray-300 rounded-md font-semibold hover:bg-gray-50"
                      >
                        <span className="text-2xl">+</span>
                        Add Your First Link
                      </button>
                    </div>
                  ) : showLinkInput ? (
                    <div className="h-72 rounded-md border-2 border-dashed border-gray-300 p-4">
                      <div className="flex gap-3 items-center">
                        <input
                          type="text"
                          value={newLink}
                          onChange={(e) => setNewLink(e.target.value)}
                          placeholder="Enter external link"
                          className="flex-1 rounded-md border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#74BF44]"
                        />
                        <button
                          type="button"
                          onClick={handleSaveLink}
                          className="px-3 py-2 rounded-md bg-[#74BF44] text-white text-sm font-medium"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={handleCancelLink}
                          className="px-3 py-2 rounded-md border border-gray-300 text-sm font-medium hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-md border border-gray-200 divide-y">
                      {externalLinks.map((link, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between px-4 py-3 text-sm"
                        >
                          <a
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline truncate pr-4"
                          >
                            {link}
                          </a>
                          <button
                            type="button"
                            onClick={() => handleRemoveLink(index)}
                            className="text-red-500 hover:text-red-700"
                            title="Remove"
                          >
                            <X size={18} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Action bar (buttons) */}
          <div className="flex justify-between items-center">
            <div />
            <div className="flex items-center gap-4">
              <button
                type="button"
                className="px-4 py-2 rounded-md border border-gray-300 bg-white text-sm font-medium hover:bg-gray-50"
              >
                Save as Draft
              </button>

              <button
                type="submit"
                disabled={submitting}
                className={`inline-flex items-center gap-2 px-5 py-2 rounded-md text-sm font-semibold text-white bg-[#74BF44] border border-[#74BF44] hover:bg-white hover:text-[#74BF44] ${
                  submitting ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <Download size={16} />
                {submitting ? "Creating..." : "Create Resource"}
              </button>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default Page;
