"use client";

import ModeratorLevel from "@/components/dropdown/ModeratorLevel";
import ModeratorProgram from "@/components/dropdown/ModeratorProgram";
import WeekManager from "@/components/dropdown/WeekDropdown";
import ModeratorModule from "@/components/dropdown/ModeratorModule";
import RichTextEditor from "@/components/layout/RichTextEditor/RichTextEditor";
import React, { useRef, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { File, Link, Download, X } from "lucide-react";
import { Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import CategoryDropDown from "@/components/dropdown/ResourceCategory";
import ResourceTypeDropdown from "@/components/dropdown/ResourceTypeDropdown";
import { axiosInstance } from "@/services/axiosInstance";
import toast, { Toaster } from "react-hot-toast";
import { useSelected } from "@/context/selectedContext";
import { motion } from "framer-motion";

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
    if (RoleSelected !== "Admin" || !StoredToken) {
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

  const [selectedFacultyId, setSelectedFacultyId] = useState<number | null>(
    null
  );
  const [selectedLevelId, setSelectedLevelId] = useState<number | null>(null);
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
    setSelectedFacultyId(null);
    setSelectedLevelId(null);
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
    <div className="px-8">
      <Toaster position="top-center" reverseOrder={false} />
      {isChecked && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="">
            <div className="mt-8">
              <h1 className="text-[26px] font-[500] ">
                Create{" "}
                <span className="text-[#74BF44] font-[600]">New Resource</span>
              </h1>
              <p className="text-[18px] font-[400] text-gray-500 tracking-[-0.2px] mt-2">
                Add educational resources to help students learn effectively
              </p>
            </div>

            <motion.form
              onSubmit={handleSubmit(onSubmit)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              className="mt-9 w-full max-w-full bg-white rounded-[7px] border border-gray-300 shadow-[0_2px_8px_rgba(0,0,0,0.3)] p-10 mb-17 "
            >
              <div className="space-y-1 mt-1">
                <label className="text-[17px] font-[400] text-gray-700 ">
                  Topic <span className="text-red-600">*</span>
                </label>
                <input
                  {...register("topic", { required: "Topic is required" })}
                  type="text"
                  placeholder="Enter resource topic/title"
                  className="w-full rounded-[7px] mt-3 border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-[#74BF44] placeholder:text-gray-500 placeholder:tracking-[0.4px]"
                />
                {errors.topic && (
                  <p className="text-red-500 text-sm">{errors.topic.message}</p>
                )}
              </div>

              <div className="mt-6">
                <label className="text-[17px] font-[400] text-gray-700 ">
                  Resource Type <span className="text-red-600">*</span>
                </label>
                <ResourceTypeDropdown
                  resourceType={resourceType}
                  setResourceType={setResourceType}
                />
              </div>

              {resourceType === "normal" ? (
                <div>
                  <div className="py-10 flex flex-row ">
                    <div className="flex flex-col flex-1">
                      <label className="text-[17px] font-[400] text-gray-700">
                        Program <span className="text-red-600">*</span>
                      </label>
                      <ModeratorProgram
                        selectedFacultyId={selectedFacultyId}
                        setSelectedFacultyId={setSelectedFacultyId}
                      />
                    </div>

                    <div className="flex flex-col flex-1">
                      <label className="text-[17px] font-[400] text-gray-700">
                        Level <span className="text-red-600">*</span>
                      </label>
                      <ModeratorLevel
                        selectedFacultyId={selectedFacultyId}
                        selectedLevelId={selectedLevelId}
                        setSelectedLevelId={setSelectedLevelId}
                      />
                    </div>

                    <div className="flex flex-col flex-1">
                      <label className="text-[17px] font-[400] text-gray-700">
                        Module <span className="text-red-600">*</span>
                      </label>
                      <ModeratorModule
                        selectedFacultyId={selectedFacultyId}
                        selectedLevelId={selectedLevelId}
                        selectedModuleId={selectedModuleId}
                        setSelectedModuleId={setSelectedModuleId}
                      />
                    </div>

                    <div className="flex flex-col flex-1">
                      <label className="text-[17px] font-[400] text-gray-700 ">
                        Language/Tag
                      </label>
                      <input
                        {...register("tag")}
                        type="text"
                        className="w-full h-[40px] rounded-[7px] mt-3 border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-[#74BF44]"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col flex-1">
                    <label className="text-[17px] font-[400] text-gray-700 mt-[-6px]">
                      Week <span className="text-red-600">*</span>
                    </label>
                    <WeekManager selectedModuleId={selectedModuleId} />
                  </div>
                </div>
              ) : (
                <div className="py-10 flex flex-col">
                  <label className="text-[17px] font-[400] text-gray-700 flex items-center justify-between w-full">
                    <span>
                      Category <span className="text-red-600">*</span>
                    </span>

                    <span
                      className="text-[14px] text-[#74BF44] hover:underline cursor-pointer"
                      onClick={() => setManageMode((prev) => !prev)}
                    >
                      {manageMode ? "Close Manage" : "Manage Category"}
                    </span>
                  </label>

                  {!manageMode && (
                    <CategoryDropDown
                      selectedCategoryId={
                        selectedCategory ? parseInt(selectedCategory) : null
                      }
                      setSelectedCategoryId={(id) =>
                        setSelectedCategory(id?.toString() ?? null)
                      }
                    />
                  )}

                  {loadingCategories && (
                    <p className="text-gray-400 text-center py-2">
                      Loading categories...
                    </p>
                  )}
                  {errorCategories && (
                    <p className="text-red-500 text-center py-2">
                      {errorCategories}
                    </p>
                  )}

                  {manageMode && (
                    <div className="p-3 border-b border-gray-200 ">
                      <div className="flex items-center gap-2 mb-3">
                        <input
                          type="text"
                          value={newCategory}
                          onChange={(e) => setNewCategory(e.target.value)}
                          placeholder="Enter category name"
                          className="flex-1 rounded-[6px] border border-gray-300 p-2 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#74BF44]"
                        />
                        {editingCategoryId ? (
                          <button
                            onClick={handleUpdateCategory}
                            className="px-3 py-2 rounded-[6px] bg-[#74BF44] text-white text-sm font-semibold hover:bg-white hover:text-[#74BF44] border border-[#74BF44] transition"
                          >
                            Update
                          </button>
                        ) : (
                          <button
                            onClick={handleAddCategory}
                            className="px-3 py-2 rounded-[6px] bg-[#74BF44] text-white text-sm font-semibold hover:bg-white hover:text-[#74BF44] border border-[#74BF44] transition"
                          >
                            Add
                          </button>
                        )}
                      </div>

                      <div className="max-h-[220px] overflow-y-auto border border-gray-200 rounded">
                        {loadingCategories ? (
                          <p className="text-gray-400 text-center py-2">
                            Loading categories...
                          </p>
                        ) : errorCategories ? (
                          <p className="text-red-500 text-center py-2">
                            {errorCategories}
                          </p>
                        ) : categories.length > 0 ? (
                          categories.map((cat) => (
                            <div
                              key={cat.categoryId}
                              className={`flex items-center justify-between text-[14px] text-gray-500 px-3 py-2 border-b last:border-none border-gray-300 cursor-pointer hover:bg-gray-100 ${
                                editingCategoryId === cat.categoryId
                                  ? "bg-yellow-50"
                                  : ""
                              }`}
                              onClick={() =>
                                setSelectedCategory(cat.categoryId.toString())
                              }
                            >
                              <span className="truncate">
                                {cat.categoryName}
                              </span>
                              <div className="flex gap-2 ">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setEditingCategoryId(cat.categoryId);
                                    setNewCategory(cat.categoryName);
                                  }}
                                  className="text-blue-500 hover:text-blue-700"
                                  title="Edit"
                                >
                                  <Pencil size={16} />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteCategory(cat.categoryId);
                                  }}
                                  className="text-red-500 hover:text-red-700"
                                  title="Delete"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-gray-400 text-center py-2">
                            No categories found
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="space-y-1 py-10">
                <label className="text-[17px] font-[400] text-gray-700">
                  Description <span className="text-red-600">*</span>
                </label>
                <RichTextEditor
                  value={description}
                  onChange={(val) => {
                    setDescription(val);
                    setValue("description", val);
                  }}
                />
              </div>
              <div className="mt-9 w-full max-w-full bg-white rounded-[7px] border border-gray-300  p-10">
                <h1 className="text-[25px] font-[600] tracking-[0.5px] text-gray-800 mb-1">
                  Attachments <span className="text-red-600">*</span>
                </h1>
                <h1 className="text-[18px] font-[400] text-gray-500 tracking-[-0.2px] mt-2">
                  Upload multiple files and add multiple external links to
                  support your resource
                </h1>
                <div className="flex justify-between items-center mt-8 mb-6">
                  <h1 className="text-[20px] font-[500] tracking-[-0.2px]">
                    Files ({files.length})
                  </h1>
                  <button
                    type="button"
                    onClick={handleAddFileClick}
                    className="flex items-center gap-4 w-[200px] h-[40px] rounded-[7px] text-[15px] font-[600] text-gray-600 border border-gray-400 px-4 hover:bg-[#6868681A] cursor-pointer"
                  >
                    <File size={14} />
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
                {files.length === 0 ? (
                  <div className="border border-dashed border-gray-400 rounded-[7px] h-[360px] flex flex-col items-center justify-center text-gray-500">
                    <File size={70} />
                    <p className="mt-5 text-[22px] text-gray-400 font-[400]">
                      No files added yet
                    </p>
                    <button
                      type="button"
                      onClick={handleAddFileClick}
                      className="mt-4 w-[240px] h-[40px] rounded-[7px] border border-gray-400 text-[16px] font-[600] text-gray-600 tracking-[0.2px] cursor-pointer hover:bg-[#6868681A] flex items-center justify-center"
                    >
                      <span className="text-[25px] mr-4">+</span> Add Your First
                      File
                    </button>
                  </div>
                ) : (
                  <div className="border border-dashed border-gray-400 rounded-[7px] p-4">
                    {files.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between border-b py-2"
                      >
                        <span className="text-gray-700">{file.name}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveFile(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X size={20} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex justify-between items-center mt-10 mb-6">
                  <h1 className="text-[20px] font-[500] tracking-[-0.2px]">
                    External Links ({externalLinks.length})
                  </h1>
                  <button
                    type="button"
                    onClick={handleAddLinkClick}
                    className="flex items-center gap-4 w-[200px] h-[40px] rounded-[7px] text-[15px] font-[600] text-gray-600 border border-gray-400 px-4 hover:bg-[#6868681A] cursor-pointer"
                  >
                    <Link size={14} />
                    Add Another Link
                  </button>
                </div>
                {externalLinks.length === 0 && !showLinkInput && (
                  <div className="border border-dashed border-gray-400 rounded-[7px] h-[360px] flex flex-col items-center justify-center text-gray-500">
                    <Link size={70} />
                    <p className="mt-5 text-[22px] text-gray-400 font-[400]">
                      No external links added yet
                    </p>
                    <button
                      type="button"
                      onClick={handleAddLinkClick}
                      className="mt-4 w-[240px] h-[40px] rounded-[7px] border border-gray-400 text-[16px] font-[600] text-gray-600 tracking-[0.2px] cursor-pointer hover:bg-[#6868681A] flex items-center justify-center"
                    >
                      <span className="text-[25px] mr-4">+</span> Add Your First
                      Link
                    </button>
                  </div>
                )}
                {showLinkInput && (
                  <div className="border border-dashed border-gray-400 rounded-[7px] h-[360px] flex flex-col items-start justify-start text-gray-500 p-6">
                    <div className="flex flex-row items-center gap-4 w-full">
                      <input
                        type="text"
                        value={newLink}
                        onChange={(e) => setNewLink(e.target.value)}
                        placeholder="Enter external link"
                        className="flex-1 rounded-[7px] border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-[#74BF44]"
                      />
                      <button
                        type="button"
                        onClick={handleSaveLink}
                        className="w-[100px] h-[40px] rounded-[7px] bg-[#74BF44] text-white font-[600] border border-[#74BF44] hover:text-[#74BF44] hover:bg-white"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={handleCancelLink}
                        className="w-[100px] h-[40px] rounded-[7px] border border-gray-400 font-[600] hover:bg-[#6868681A]"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {externalLinks.length > 0 && (
                  <div className="border border-dashed border-gray-400 rounded-[7px] p-4">
                    {externalLinks.map((link, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between border-b py-2"
                      >
                        <a
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline"
                        >
                          {link}
                        </a>
                        <button
                          type="button"
                          onClick={() => handleRemoveLink(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X size={20} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-6 py-10">
                <button
                  type="submit"
                  disabled={submitting}
                  className={`flex items-center justify-center border-[#74BF44] text-[16px] font-[600] w-[200px] h-[44px] rounded-[7px] text-white border  bg-[#74BF44] cursor-pointer hover:text-[#74BF44] hover:bg-white  ${
                    submitting ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <Download className="mr-2" size={20} />
                  {submitting ? "Creating..." : "Create Resource"}
                </button>
              </div>
            </motion.form>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default Page;
